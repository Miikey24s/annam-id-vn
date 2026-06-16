import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import db from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { caption, captionEn, isFavorite, albumId } = body;

    const updatedImage = await db.galleryImage.update({
      where: { id },
      data: {
        caption,
        captionEn,
        isFavorite: isFavorite !== undefined ? isFavorite : undefined,
        albumId: albumId === "" ? null : albumId,
      },
    });

    return NextResponse.json(updatedImage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the image to get publicId & type
    const img = await db.galleryImage.findUnique({
      where: { id },
    });

    if (!img) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete physical files
    if (img.publicId) {
      if (img.type === "video") {
        await supabase.storage.from("videos").remove([img.publicId]);
      } else {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // Delete DB record
    await db.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
