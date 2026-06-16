import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const pet = await db.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(pet);
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
    const { name, nameEn, species, breed, color, gender, birthday, adoptionDate, weight, personality, avatarUrl, coverUrl, bio, bioEn, isActive } = body;

    const updatedPet = await db.pet.update({
      where: { id },
      data: {
        name,
        nameEn,
        species,
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
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(updatedPet);
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

    await db.pet.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pet deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
