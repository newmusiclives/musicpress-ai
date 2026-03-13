import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  outlet: z.string().min(1, "Outlet is required"),
  type: z.string().min(1, "Type is required"),
  genre: z.string().optional(),
  region: z.string().optional(),
  beat: z.string().optional(),
  phone: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  verified: z.boolean().optional(),
  articleCount: z.number().int().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const genre = searchParams.get("genre") || "";
    const region = searchParams.get("region") || "";
    const sort = searchParams.get("sort") || "name";

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { outlet: { contains: search } },
        { genre: { contains: search } },
        { beat: { contains: search } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (genre) {
      where.genre = { contains: genre };
    }

    if (region) {
      where.region = { contains: region };
    }

    const orderBy: Record<string, string> = {};
    if (sort.startsWith("-")) {
      orderBy[sort.slice(1)] = "desc";
    } else {
      orderBy[sort] = "asc";
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        outlet: data.outlet,
        type: data.type,
        genre: data.genre,
        region: data.region,
        beat: data.beat,
        phone: data.phone,
        twitter: data.twitter,
        instagram: data.instagram,
        linkedin: data.linkedin,
        website: data.website,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        verified: data.verified ?? true,
        articleCount: data.articleCount ?? 0,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
