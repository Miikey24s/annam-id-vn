import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get("petId");

    const entries = await db.journalEntry.findMany({
      where: petId ? { petId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(entries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, titleEn, slug, content, contentEn, excerpt, excerptEn, coverImage, category, tags, mood, isPublished, isDraft } = body;

    // Fetch petId automatically
    const pet = await db.pet.findFirst({ where: { isActive: true } });
    if (!pet) {
      return NextResponse.json({ error: "No active pet profile found" }, { status: 400 });
    }

    const newEntry = await db.journalEntry.create({
      data: {
        petId: pet.id,
        title,
        titleEn,
        slug,
        content,
        contentEn,
        excerpt,
        excerptEn,
        coverImage,
        category: category || "daily",
        tags: tags || [],
        mood,
        isPublished,
        isDraft,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
