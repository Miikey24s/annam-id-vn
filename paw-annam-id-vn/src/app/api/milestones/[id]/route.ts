import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

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
    const { title, titleEn, description, descriptionEn, category, icon, imageUrl, date, ageAtEvent, isCompleted } = body;

    const updatedMilestone = await db.milestone.update({
      where: { id },
      data: {
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
      },
    });

    return NextResponse.json(updatedMilestone);
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

    await db.milestone.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Milestone deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
