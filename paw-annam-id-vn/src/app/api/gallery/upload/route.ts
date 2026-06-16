import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import db from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // 1. Verify auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const petId = formData.get("petId") as string;
    const albumId = formData.get("albumId") as string | null;
    const caption = formData.get("caption") as string | null;
    const captionEn = formData.get("captionEn") as string | null;
    const isFavorite = formData.get("isFavorite") === "true";

    if (!file || !petId) {
      return NextResponse.json({ error: "File and petId are required" }, { status: 400 });
    }

    const fileType = file.type.startsWith("video") ? "video" : "image";
    let uploadUrl = "";
    let publicId = "";
    let format = "";

    // 3. Upload file based on type
    if (fileType === "video") {
      // Upload video to Supabase Storage
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${petId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

      const { data, error } = await supabase.storage
        .from("videos")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      uploadUrl = publicUrlData.publicUrl;
      publicId = fileName;
      format = file.name.split(".").pop() || "mp4";
    } else {
      // Upload image to Cloudinary
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: `paw-memories/${petId}`,
        resource_type: "image",
      });

      uploadUrl = result.secure_url;
      publicId = result.public_id;
      format = result.format;
    }

    // 4. Create record in db
    const galleryImage = await db.galleryImage.create({
      data: {
        petId,
        albumId: albumId && albumId !== "null" && albumId !== "" ? albumId : null,
        url: uploadUrl,
        publicId,
        type: fileType,
        caption,
        captionEn,
        format,
        size: file.size,
        isFavorite,
      },
    });

    return NextResponse.json(galleryImage);
  } catch (error: any) {
    console.error("Server upload API error:", error);
    return NextResponse.json({ error: error.message || "Tải lên thất bại." }, { status: 500 });
  }
}
