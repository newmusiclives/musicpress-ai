import { NextRequest, NextResponse } from "next/server";
import { generatePressRelease, isAnthropicConfigured } from "@/lib/anthropic";
import { getAuthUser } from "@/lib/session";
import { z } from "zod/v4";

const generateSchema = z.object({
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  tone: z.string().optional(),
  language: z.string().optional(),
  artistName: z.string().optional(),
  genre: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthUser();
    if (error) return error;

    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { description, type, tone, language, artistName, genre, location } = parsed.data;

    // If Anthropic is not configured, return a mock response
    if (!isAnthropicConfigured()) {
      return NextResponse.json({
        title: `${artistName || "Artist"} Announces ${type}`,
        subtitle: `Exciting new ${type.toLowerCase()} from ${artistName || "the artist"} set to make waves in the ${genre || "music"} scene`,
        body: `FOR IMMEDIATE RELEASE\n\n${location || "Los Angeles, CA"} -- ${artistName || "The artist"} is thrilled to announce ${description}.\n\nThis ${type.toLowerCase()} represents a significant milestone in the ${genre || "music"} landscape. With a ${tone || "professional"} approach, ${artistName || "the artist"} continues to push boundaries.\n\n"We are incredibly excited about this announcement," said ${artistName || "the artist"}. "This has been a long time coming and we can't wait for everyone to experience it."\n\nFor more information, press inquiries, or interview requests, please contact the artist's press team.\n\n###\n\nAbout ${artistName || "The Artist"}\n${artistName || "The artist"} is a ${genre || "music"} act based in ${location || "Los Angeles"}. Known for their unique sound and compelling performances, they continue to captivate audiences worldwide.`,
        mock: true,
      });
    }

    const result = await generatePressRelease({
      description,
      type,
      tone: tone || "professional",
      language: language || "en",
      artistName,
      genre,
      location,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error generating press release:", err);
    return NextResponse.json(
      { error: "Failed to generate press release" },
      { status: 500 }
    );
  }
}
