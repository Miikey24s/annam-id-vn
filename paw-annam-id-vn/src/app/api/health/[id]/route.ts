import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Check auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, titleEn, description, descriptionEn, date, nextDate, vetName, cost } = body;

    const updatedRecord = await db.healthRecord.update({
      where: { id },
      data: {
        type,
        title,
        titleEn,
        description,
        descriptionEn,
        date: new Date(date),
        nextDate: nextDate ? new Date(nextDate) : null,
        vetName,
        cost: cost ? parseFloat(cost) : null,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Check auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.healthRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Health record deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
