import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const pets = await db.pet.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pets);
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
    const { name, nameEn, species, breed, color, gender, birthday, adoptionDate, weight, personality, avatarUrl, coverUrl, bio, bioEn } = body;

    const newPet = await db.pet.create({
      data: {
        name,
        nameEn,
        species: species || "cat",
        breed,
        color,
        gender,
        birthday: birthday ? new Date(birthday) : null,
        adoptionDate: adoptionDate ? new Date(adoptionDate) : null,
        weight: weight ? parseFloat(weight) : null,
        personality: personality || [],
        avatarUrl,
        coverUrl,
        bio,
        bioEn,
      },
    });

    return NextResponse.json(newPet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
