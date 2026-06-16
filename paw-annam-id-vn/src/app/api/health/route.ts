import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const records = await db.healthRecord.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    // Fetch active pet
    const pet = await db.pet.findFirst({ where: { isActive: true } });
    if (!pet) {
      return NextResponse.json({ error: "No active pet profile found" }, { status: 400 });
    }

    const newRecord = await db.healthRecord.create({
      data: {
        petId: pet.id,
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

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
