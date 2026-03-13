import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generatePressRelease(params: {
  description: string;
  type: string;
  tone: string;
  language: string;
  artistName?: string;
  genre?: string;
  location?: string;
}): Promise<{ title: string; subtitle: string; body: string }> {
  const systemPrompt = `You are a professional music PR copywriter. Generate press releases in AP style format specifically for the music industry. Your writing should be compelling, factual-sounding, and ready to send to music journalists.

Format the response as JSON with these fields:
- title: A compelling headline (max 120 chars)
- subtitle: A supporting subheadline (max 200 chars)
- body: The full press release body in professional PR format with paragraphs. Include a dateline, body paragraphs, quotes placeholder, and boilerplate "About" section. Use proper AP style.

Tone: ${params.tone}
Language: ${params.language}`;

  const userPrompt = `Generate a music industry press release for the following:

Type: ${params.type}
${params.artistName ? `Artist/Band: ${params.artistName}` : ""}
${params.genre ? `Genre: ${params.genre}` : ""}
${params.location ? `Location: ${params.location}` : ""}

Description: ${params.description}

Return ONLY valid JSON with title, subtitle, and body fields.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      { role: "user", content: userPrompt },
    ],
    system: systemPrompt,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function generatePitchEmail(params: {
  contactName: string;
  contactOutlet: string;
  contactBeat: string;
  pressRelease: string;
  artistName: string;
  genre: string;
}): Promise<{ subject: string; body: string }> {
  const systemPrompt = `You are a music PR specialist who writes personalized pitch emails to journalists. Your emails are concise, respectful of the journalist's time, and clearly explain why this story is relevant to their specific beat and outlet.

Format the response as JSON with:
- subject: Email subject line (max 80 chars, no clickbait)
- body: The email body, personalized and professional. Keep it under 200 words.`;

  const userPrompt = `Write a personalized pitch email to:

Journalist: ${params.contactName}
Outlet: ${params.contactOutlet}
Their Beat: ${params.contactBeat}

About:
Artist: ${params.artistName}
Genre: ${params.genre}

Press Release Summary:
${params.pressRelease.slice(0, 500)}

Return ONLY valid JSON with subject and body fields.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    messages: [
      { role: "user", content: userPrompt },
    ],
    system: systemPrompt,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function calculateMatchScore(params: {
  userGenre: string;
  userLocation: string;
  contactGenre: string;
  contactRegion: string;
  contactBeat: string;
}): Promise<number> {
  // Simple algorithmic matching (no API call needed)
  let score = 50; // base score

  const userGenres = params.userGenre.toLowerCase().split(",").map((g) => g.trim());
  const contactGenres = params.contactGenre.toLowerCase().split(",").map((g) => g.trim());

  // Genre overlap
  const genreOverlap = userGenres.filter((g) =>
    contactGenres.some((cg) => cg.includes(g) || g.includes(cg))
  );
  score += genreOverlap.length * 15;

  // Region match
  if (
    params.contactRegion.toLowerCase().includes("global") ||
    params.contactRegion.toLowerCase().includes(params.userLocation.toLowerCase().slice(0, 2))
  ) {
    score += 10;
  }

  // Beat relevance
  if (params.contactBeat) {
    const beatWords = params.contactBeat.toLowerCase().split(/[\s,]+/);
    const matchingBeatWords = beatWords.filter((w) =>
      userGenres.some((g) => g.includes(w) || w.includes(g))
    );
    score += matchingBeatWords.length * 5;
  }

  return Math.min(99, Math.max(40, score));
}

export function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
