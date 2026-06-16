import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const logs = await db.weightLog.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(logs);
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
    const { weight, date, note } = body;

    // Fetch active pet
    const pet = await db.pet.findFirst({ where: { isActive: true } });
    if (!pet) {
      return NextResponse.json({ error: "No active pet profile found" }, { status: 400 });
    }

    const newLog = await db.weightLog.create({
      data: {
        petId: pet.id,
        weight: parseFloat(weight),
        date: new Date(date),
        note,
      },
    });

    // Also update the weight on Pet profile directly
    await db.pet.update({
      where: { id: pet.id },
      data: { weight: parseFloat(weight) },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
