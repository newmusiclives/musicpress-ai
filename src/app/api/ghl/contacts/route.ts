import { NextRequest, NextResponse } from "next/server";
import { ghlCreateContact, isGHLConfigured } from "@/lib/ghl";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const syncContactSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = syncContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    if (!isGHLConfigured()) {
      return NextResponse.json({
        message: "GHL not configured",
        mock: true,
        contact: {
          id: "mock-ghl-contact-id",
          email: parsed.data.email,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
        },
      });
    }

    const result = await ghlCreateContact({
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      tags: parsed.data.tags,
      customFields: parsed.data.customFields,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error syncing contact to GHL:", err);
    return NextResponse.json(
      { error: "Failed to sync contact to GHL" },
      { status: 500 }
    );
  }
}
