import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const milestones = await db.milestone.findMany({
      orderBy: [{ isCompleted: "desc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(milestones);
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
    const { title, titleEn, description, descriptionEn, category, icon, imageUrl, date, ageAtEvent, isCompleted } = body;

    // Fetch active petId
    const pet = await db.pet.findFirst({ where: { isActive: true } });
    if (!pet) {
      return NextResponse.json({ error: "No active pet profile found" }, { status: 400 });
    }

    const newMilestone = await db.milestone.create({
      data: {
        petId: pet.id,
        title,
        titleEn,
        description,
        descriptionEn,
        category,
        icon,
        imageUrl,
        date: date ? new Date(date) : null,
        ageAtEvent,
        isCompleted,
        isPredefined: false,
      },
    });

    return NextResponse.json(newMilestone, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
