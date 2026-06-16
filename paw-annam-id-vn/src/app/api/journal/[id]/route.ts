import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const entry = await db.journalEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const { title, titleEn, slug, content, contentEn, excerpt, excerptEn, coverImage, category, tags, mood, isPublished, isDraft } = body;

    const existingEntry = await db.journalEntry.findUnique({ where: { id } });
    if (!existingEntry) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    const wasPublished = existingEntry.isPublished;
    const shouldSetPublishedAt = isPublished && !wasPublished;

    const updatedEntry = await db.journalEntry.update({
      where: { id },
      data: {
        title,
        titleEn,
        slug,
        content,
        contentEn,
        excerpt,
        excerptEn,
        coverImage,
        category,
        tags: tags || [],
        mood,
        isPublished,
        isDraft,
        publishedAt: shouldSetPublishedAt ? new Date() : undefined,
      },
    });

    return NextResponse.json(updatedEntry);
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

    await db.journalEntry.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Journal entry deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
