import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Demo User ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@musicpress.ai" },
    update: {},
    create: {
      email: "demo@musicpress.ai",
      name: "Demo Artist",
      passwordHash,
      role: "artist",
      plan: "artist_pro",
      genre: "Indie Rock, Alternative",
      location: "Austin, TX",
      bio: "Independent artist creating genre-blending music from the heart of Austin.",
      website: "https://example.com",
      truefansConnected: true,
      truefansId: "demo-truefans-123",
    },
  });

  // ─── Contacts (Music Journalists) ─────────────────────────────────────────

  // ══════════════════════════════════════════════════════════════════════════
  // REAL contacts with PUBLICLY AVAILABLE email addresses.
  // Sources: official publication contact pages, public social bios, and
  // publicly listed submission/press addresses as of March 2026.
  // ══════════════════════════════════════════════════════════════════════════

  const journalists = [
    // ── Rolling Stone ──────────────────────────────────────────────────────
    { name: "Rolling Stone Tips Desk", email: "tips@rollingstone.com", outlet: "Rolling Stone", genre: "Rock, Pop, All Genres", region: "US", beat: "News Tips, Story Ideas", bio: "Rolling Stone editorial tip line for press releases, story ideas, and news tips. Public contact listed on rollingstone.com/contact.", articleCount: 0 },
    { name: "Rolling Stone Letters", email: "letters@rollingstone.com", outlet: "Rolling Stone", genre: "Rock, Pop, All Genres", region: "US", beat: "Letters to the Editor", bio: "Rolling Stone letters desk for reader/industry correspondence. Public contact on rollingstone.com/contact.", articleCount: 0 },
    // ── Pitchfork ──────────────────────────────────────────────────────────
    { name: "Pitchfork Tips Desk", email: "tips@pitchfork.com", outlet: "Pitchfork", genre: "Indie, Alternative, Experimental", region: "US", beat: "News Tips, Music Submissions", bio: "Pitchfork's public editorial tip line. Best way to reach their team for press and music tips.", articleCount: 0 },
    // ── NME ────────────────────────────────────────────────────────────────
    { name: "NME Press Office", email: "press@nme.com", outlet: "NME", genre: "Indie, Rock, Pop, Electronic", region: "UK", beat: "Press Inquiries, Music News", bio: "NME press office for press releases and media inquiries. Listed on nme.com/contact.", articleCount: 0 },
    // ── Billboard ──────────────────────────────────────────────────────────
    { name: "Billboard Tips Desk", email: "tips@billboard.com", outlet: "Billboard", genre: "Pop, Charts, Industry", region: "US", beat: "News Tips, Industry News", bio: "Billboard tip line for news tips and story ideas. Listed on billboard.com/tip-us.", articleCount: 0 },
    { name: "Billboard News Tips", email: "news_tips@billboard.com", outlet: "Billboard", genre: "Pop, Charts, Industry", region: "US", beat: "Confidential Tips", bio: "Billboard confidential news tips address. Listed on billboard.com/tip-us.", articleCount: 0 },
    // ── Consequence (of Sound) ─────────────────────────────────────────────
    { name: "Consequence News Desk", email: "news@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "News Tips, Breaking News", bio: "Consequence of Sound news desk for tips and press releases. Listed on consequence.net/contact-us.", articleCount: 0 },
    { name: "Consequence Submissions", email: "submissions@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "Music Submissions", bio: "Consequence of Sound music submission email. Listed on consequence.net/contact-us.", articleCount: 0 },
    { name: "Consequence Editorial", email: "info@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "General Comments, Press", bio: "Consequence of Sound general editorial email. Listed on consequence.net/contact-us.", articleCount: 0 },
    // ── The FADER ──────────────────────────────────────────────────────────
    { name: "The FADER Editorial", email: "editorial@thefader.com", outlet: "The FADER", genre: "Hip Hop, R&B, Pop, Emerging", region: "US", beat: "Music & Culture Features", bio: "The FADER editorial team email for press and pitches. Publicly referenced submission address.", articleCount: 0 },
    // ── Clash Magazine ─────────────────────────────────────────────────────
    { name: "Robin Murray", email: "robin@clashmusic.com", outlet: "Clash Magazine", genre: "Rock, Pop, Electronic, Indie", region: "UK", beat: "Editor-in-Chief", bio: "Editor-in-Chief of Clash Magazine. Email publicly listed on clashmusic.com/contact-clash.", articleCount: 0 },
    { name: "Shahzaib Hussain", email: "shahzaib@clashmusic.com", outlet: "Clash Magazine", genre: "Rock, Pop, Electronic, Indie", region: "UK", beat: "Deputy Editor", bio: "Deputy Editor at Clash Magazine. Email publicly listed on clashmusic.com/contact-clash.", articleCount: 0 },
    { name: "Ana Lamond", email: "ana@clashmusic.com", outlet: "Clash Magazine", genre: "Rock, Pop, Electronic, Indie", region: "UK", beat: "Editorial Assistant", bio: "Editorial Assistant at Clash Magazine. Email publicly listed on clashmusic.com/contact-clash.", articleCount: 0 },
    { name: "Clash Magazine Press", email: "press@clashmusic.com", outlet: "Clash Magazine", genre: "Rock, Pop, Electronic, Indie", region: "UK", beat: "Press Inquiries", bio: "Clash Magazine press office. Listed on clashmusic.com/contact-clash.", articleCount: 0 },
    // ── DIY Magazine ───────────────────────────────────────────────────────
    { name: "Sarah Jamieson", email: "sarah@diymag.com", outlet: "DIY Magazine", genre: "Indie, Rock, Pop", region: "UK", beat: "Managing Editor", bio: "Managing Editor at DIY Magazine handling cover opportunities, print commissions, brand activity. Listed on diymag.com/contacts.", articleCount: 0 },
    { name: "Emma Swann", email: "emma@diymag.com", outlet: "DIY Magazine", genre: "Indie, Rock, Pop", region: "UK", beat: "Founding Editor, Reviews", bio: "Founding Editor at DIY Magazine. Handles festival enquiries, album and live reviews. Listed on diymag.com/contacts.", articleCount: 0 },
    { name: "Lisa Wright", email: "lisa@diymag.com", outlet: "DIY Magazine", genre: "Indie, Rock, Pop", region: "UK", beat: "Features Editor", bio: "Features Editor at DIY Magazine handling feature opportunities across print and live events. Listed on diymag.com/contacts.", articleCount: 0 },
    // ── The Line of Best Fit ───────────────────────────────────────────────
    { name: "The Line of Best Fit News", email: "news@thelineofbestfit.com", outlet: "The Line of Best Fit", genre: "Indie, Dream Pop, Shoegaze, Alt", region: "UK", beat: "News, Press Releases", bio: "The Line of Best Fit news desk for press releases. The UK's biggest independent new music website. Listed on thelineofbestfit.com/contact.", articleCount: 0 },
    { name: "The Line of Best Fit General", email: "hello@thelineofbestfit.com", outlet: "The Line of Best Fit", genre: "Indie, Dream Pop, Shoegaze, Alt", region: "UK", beat: "General Inquiries", bio: "General inquiries for The Line of Best Fit. Listed on thelineofbestfit.com/contact.", articleCount: 0 },
    // ── The Quietus ────────────────────────────────────────────────────────
    { name: "John Doran", email: "john@thequietus.com", outlet: "The Quietus", genre: "Experimental, Art Rock, Electronic", region: "UK", beat: "Editor, Features", bio: "Editor of The Quietus covering features and experimental music. Email publicly listed on thequietus.com/contact.", articleCount: 0 },
    { name: "Luke Turner", email: "luke@thequietus.com", outlet: "The Quietus", genre: "Experimental, Art Rock, Electronic", region: "UK", beat: "Co-Editor, Music Submissions", bio: "Co-Editor at The Quietus handling music submissions, advertising, and business. Listed on thequietus.com/contact.", articleCount: 0 },
    { name: "Laurie Tuffrey", email: "laurie@thequietus.com", outlet: "The Quietus", genre: "Experimental, Art Rock, Electronic", region: "UK", beat: "New Music Editor", bio: "New Music Editor at The Quietus. Email publicly listed on thequietus.com/contact.", articleCount: 0 },
    // ── Crack Magazine ──────────────────────────────────────────────────────
    { name: "Crack Magazine Editorial", email: "crack@crackmagazine.net", outlet: "Crack Magazine", genre: "Electronic, Club, Culture", region: "UK", beat: "General Enquiries, Submissions", bio: "Crack Magazine general enquiries and submissions. Europe's biggest independent free monthly music magazine. Listed on crackmagazine.net.", articleCount: 0 },
    // ── Dazed ──────────────────────────────────────────────────────────────
    { name: "Dazed Music", email: "hello@dazed.studio", outlet: "Dazed", genre: "Culture, Music, Fashion", region: "UK", beat: "Music & Culture", bio: "Dazed general contact for music and culture pitches. Listed on dazeddigital.com/contact.", articleCount: 0 },
    // ── Loud and Quiet ─────────────────────────────────────────────────────
    { name: "Loud and Quiet Submissions", email: "contribute@loudandquiet.com", outlet: "Loud and Quiet", genre: "Indie, Alternative, Experimental", region: "UK", beat: "Music Submissions, Contributions", bio: "Loud and Quiet bi-monthly independent music magazine. Submission email listed on loudandquiet.com/contact.", articleCount: 0 },
    // ── PopMatters ─────────────────────────────────────────────────────────
    { name: "PopMatters Editorial", email: "editor@popmatters.com", outlet: "PopMatters", genre: "All Genres, Culture", region: "US", beat: "Editorial, Music & Culture Criticism", bio: "PopMatters editorial email. Independent, women/LGBTQ-owned international magazine of cultural criticism. Listed in site metadata.", articleCount: 0 },
    // ── FACT Magazine ──────────────────────────────────────────────────────
    { name: "FACT Magazine Promos", email: "promos@factmag.com", outlet: "FACT Magazine", genre: "Electronic, Hip Hop, Club", region: "UK", beat: "Music Promos, Submissions", bio: "FACT Magazine promo submissions email for electronic and hip hop music. Publicly listed submission address.", articleCount: 0 },
    // ── Resident Advisor ───────────────────────────────────────────────────
    { name: "Resident Advisor Projects", email: "projects@ra.co", outlet: "Resident Advisor", genre: "Electronic, Techno, House", region: "UK", beat: "Projects, Sustainability", bio: "Resident Advisor project inquiries email. Listed on ra.co/about.", articleCount: 0 },
  ];

  const curators = [
    // ── Indiemono ──────────────────────────────────────────────────────────
    // Free submission platform since 2011, 100K+ followers. Submit via indiemono.com/music-submit
    { name: "Indiemono", email: "info@indiemono.com", outlet: "Indiemono Playlists", genre: "Indie, Alternative, Chill, Electronic", region: "Global", beat: "Indie Discovery, Chill", bio: "Independent Spotify playlist curator since 2011 with 100K+ followers. Free submission tool at indiemono.com. Based in Spain.", articleCount: 0 },
    // ── Pigeons & Planes (Playlist) ────────────────────────────────────────
    { name: "Pigeons & Planes Playlist", email: "submissions@pigeonsandplanes.com", outlet: "Pigeons & Planes", genre: "All Genres, Hip Hop, Pop, Indie", region: "US", beat: "Music Discovery, Playlist", bio: "Complex Networks music discovery platform. Submit with subject 'PLAYLIST SUBMISSION' and Spotify link. Direct-from-artist only. Public email from their X/Twitter.", articleCount: 0 },
    // ── Obscure Sound ──────────────────────────────────────────────────────
    { name: "Mike Mineo", email: "obscuresoundmail@gmail.com", outlet: "Obscure Sound", genre: "Indie, Rock, Electronic", region: "US", beat: "Indie Discovery, Playlists", bio: "Founder and editor of Obscure Sound since 2006. Also curates Spotify playlists. Use subject 'Obscure Sound Submission'. Listed on obscuresound.com/about/contact.", articleCount: 0 },
    // ── For The Love of Bands ──────────────────────────────────────────────
    { name: "For The Love of Bands", email: "info@fortheloveofbands.com", outlet: "For The Love of Bands", genre: "Indie, Folk, Alternative", region: "Global", beat: "Indie Playlists, Blog, Podcast", bio: "Indie music blog, Spotify playlist curator, and podcast. Note: unsolicited music to this email may be deleted; use their official submission form. Listed on fortheloveofbands.com.", articleCount: 0 },
    // ── Bolting Bits ───────────────────────────────────────────────────────
    { name: "Bolting Bits", email: "contact@boltingbits.com", outlet: "Bolting Bits", genre: "House, Techno, Jazz, Electronic", region: "Global", beat: "Electronic, Jazz Playlists", bio: "Music blog and playlist curator focused on house, techno, and jazz. Submission email publicly listed.", articleCount: 0 },
    // ── The Alternative ────────────────────────────────────────────────────
    { name: "The Alternative", email: "TheAltSubmissions@gmail.com", outlet: "The Alternative", genre: "Indie, Alternative, Emo, Punk", region: "US", beat: "Indie, Alternative Discovery", bio: "Music blog and playlist curator covering indie, alternative, emo, and punk. Public submission email.", articleCount: 0 },
    // ── This Song Is Sick ──────────────────────────────────────────────────
    { name: "This Song Is Sick", email: "submission@thissongissick.com", outlet: "This Song Is Sick", genre: "Electronic, Hip-Hop, Indie", region: "US", beat: "Electronic, Hip-Hop Playlists", bio: "Music blog and playlist curator showcasing pre-breakthrough artists across electronic, hip-hop, and indie. Public email.", articleCount: 0 },
    // ── Underground Hip Hop Blog ───────────────────────────────────────────
    { name: "Underground Hip Hop Blog", email: "UGHHBLOG@GMAIL.COM", outlet: "Underground Hip Hop Blog", genre: "Hip Hop, Rap", region: "US", beat: "Underground Hip Hop Playlists", bio: "Underground hip hop blog and playlist curator. Email for music consideration and advertising. Listed on undergroundhiphopblog.com/contact.", articleCount: 0 },
    // ── Tune Curator ───────────────────────────────────────────────────────
    { name: "Tune", email: "tunesubmissions@gmail.com", outlet: "Tune", genre: "Indie, Alternative, Experimental", region: "Global", beat: "Indie, Alternative Playlists", bio: "Independent Spotify playlist curator accepting indie, alternative, and experimental music submissions.", articleCount: 0 },
    // ── Gorilla vs Bear (also curates playlists) ───────────────────────────
    { name: "Chris (Gorilla vs Bear)", email: "chris@gorillavsbear.net", outlet: "Gorilla vs Bear", genre: "Indie, Alternative, Electronic", region: "US", beat: "Indie Discovery, Playlists", bio: "Founder/Editor of Gorilla vs. Bear, Texas-based indie music blog and playlist curator. Once called 'the New Yorker of hipster blogs.' Listed on gorillavsbear.net/contact.", articleCount: 0 },
    // ── KEXP Music Submissions ─────────────────────────────────────────────
    { name: "KEXP Music Department", email: "md@kexp.org", outlet: "KEXP", genre: "All Genres, Indie, World", region: "US", beat: "Radio Playlist, Music Discovery", bio: "KEXP Seattle public radio music department. Best way to submit music for airplay and playlist consideration. Listed on kexp.org/about/submission-guidelines.", articleCount: 0 },
    // ── Music Promotion USA ────────────────────────────────────────────────
    { name: "Music Promotion USA", email: "submit@musicpromotionusa.com", outlet: "Music Promotion USA", genre: "All Genres", region: "US", beat: "Spotify Playlist Submissions", bio: "Curated Spotify playlist submission service across various genres. Listed on musicpromotionusa.com.", articleCount: 0 },
  ];

  const blogs = [
    // ── Atwood Magazine ────────────────────────────────────────────────────
    { name: "Mitch Mosk (Atwood Magazine)", email: "mitch@atwoodmagazine.com", outlet: "Atwood Magazine", genre: "Indie, Alternative, Pop, Folk", region: "US", beat: "Indie Features, Reviews", bio: "Editor at Atwood Magazine. Keep pitches to 2-3 sentences with direct music links. Expect 1000+ emails/week. Listed on atwoodmagazine.com/pitching-us.", articleCount: 0 },
    // ── Gorilla vs Bear ────────────────────────────────────────────────────
    { name: "Gorilla vs Bear Editorial", email: "chrismc99@gmail.com", outlet: "Gorilla vs Bear", genre: "Indie, Alternative, Electronic", region: "US", beat: "Indie Discovery", bio: "Founder Chris's public email for Gorilla vs Bear, the Texas-based indie music blog. Listed on gorillavsbear.net/contact.", articleCount: 0 },
    // ── Obscure Sound ──────────────────────────────────────────────────────
    { name: "Mike Mineo (Obscure Sound)", email: "obscuresoundmail@gmail.com", outlet: "Obscure Sound", genre: "Indie, Rock, Electronic", region: "US", beat: "Indie Discovery", bio: "Founder/editor of Obscure Sound since 2006. Use subject 'Obscure Sound Submission' with streaming link, press photo, brief bio. Listed on obscuresound.com/about/contact.", articleCount: 0 },
    // ── FACT Magazine ──────────────────────────────────────────────────────
    { name: "FACT Magazine Promos", email: "promos@factmag.com", outlet: "FACT Magazine", genre: "Electronic, Hip Hop, Club", region: "UK", beat: "Electronic, Hip Hop Music", bio: "FACT Magazine promo submissions for electronic and hip hop music. Publicly listed submission email.", articleCount: 0 },
    // ── Consequence of Sound ───────────────────────────────────────────────
    { name: "Consequence Submissions", email: "submissions@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "Music Submissions", bio: "Consequence of Sound music submission email for press and artist submissions. Listed on consequence.net/contact-us.", articleCount: 0 },
    // ── Everything Is Noise ────────────────────────────────────────────────
    { name: "Toni 'Inter' Meese", email: "inter@everythingisnoise.net", outlet: "Everything Is Noise", genre: "Metal, Progressive, Experimental, Hip Hop", region: "Global", beat: "Press Inquiries, Submissions", bio: "Editor at Everything Is Noise. Blog covering metal, progressive, ambient, hip-hop, and experimental music. Listed on everythingisnoise.net/contact.", articleCount: 0 },
    // ── The Line of Best Fit ───────────────────────────────────────────────
    { name: "The Line of Best Fit News", email: "news@thelineofbestfit.com", outlet: "The Line of Best Fit", genre: "Indie, Alternative, Dream Pop", region: "UK", beat: "News, Press Releases", bio: "UK's biggest independent new music website. Send news and press releases here. Listed on thelineofbestfit.com/contact.", articleCount: 0 },
    // ── Earmilk ────────────────────────────────────────────────────────────
    { name: "Earmilk Business", email: "business@earmilk.com", outlet: "Earmilk", genre: "Electronic, Hip Hop, R&B, Funk", region: "US", beat: "Business Inquiries", bio: "Earmilk business email. Note: music submissions are accepted exclusively through SubmitHub. Listed on earmilk.com/contact-us.", articleCount: 0 },
    // ── Crack Magazine ─────────────────────────────────────────────────────
    { name: "Crack Magazine", email: "crack@crackmagazine.net", outlet: "Crack Magazine", genre: "Electronic, Club, Culture", region: "UK", beat: "General Enquiries, Submissions", bio: "Europe's biggest independent free monthly music and culture magazine. Listed on crackmagazine.net.", articleCount: 0 },
    // ── Loud and Quiet ─────────────────────────────────────────────────────
    { name: "Loud and Quiet", email: "contribute@loudandquiet.com", outlet: "Loud and Quiet", genre: "Indie, Alternative, Experimental", region: "UK", beat: "Music Submissions", bio: "Independent bi-monthly music magazine, website, and podcast host. Send submissions and work samples. Listed on loudandquiet.com/contact.", articleCount: 0 },
    // ── PopMatters ─────────────────────────────────────────────────────────
    { name: "PopMatters Editorial", email: "editor@popmatters.com", outlet: "PopMatters", genre: "All Genres, Culture", region: "US", beat: "Music & Culture Criticism", bio: "Independent, women/LGBTQ-owned international magazine of cultural criticism and analysis since 1999. Listed in site metadata.", articleCount: 0 },
    // ── Pigeons & Planes ───────────────────────────────────────────────────
    { name: "Pigeons & Planes", email: "submissions@pigeonsandplanes.com", outlet: "Pigeons & Planes", genre: "All Genres, Hip Hop, Pop, Rock", region: "US", beat: "Music Discovery", bio: "Complex Networks music discovery platform. Has broken Billie Eilish, Post Malone, and more. Use subject 'PLAYLIST SUBMISSION'. Public email from X/Twitter.", articleCount: 0 },
  ];

  const podcasters = [
    // ── Song Exploder ──────────────────────────────────────────────────────
    { name: "Hrishikesh Hirway", email: "contact@songexploder.net", outlet: "Song Exploder", genre: "All Genres", region: "US", beat: "Song Breakdowns", bio: "Host/Creator of Song Exploder, where musicians break apart their songs piece by piece. Part of Radiotopia/PRX. Note: not currently accepting song submissions. Listed on songexploder.net/about.", articleCount: 0 },
    // ── Dissect ────────────────────────────────────────────────────────────
    { name: "Cole Cuchna", email: "dissectpodcast@gmail.com", outlet: "Dissect", genre: "Hip Hop, R&B, Pop", region: "US", beat: "Album Analysis", bio: "Host of Dissect, a serialized music analysis podcast. Each season dissects a single album. Listed on dissectpodcast.com/contact.", articleCount: 0 },
    // ── Switched on Pop ────────────────────────────────────────────────────
    { name: "Nate Sloan & Charlie Harding", email: "press@switchedonpop.com", outlet: "Switched on Pop", genre: "Pop", region: "US", beat: "Pop Music Analysis", bio: "Musicologist Nate Sloan and songwriter Charlie Harding analyze pop music. Produced by Vulture. Listed on switchedonpop.com/contact.", articleCount: 0 },
    { name: "Switched on Pop Booking", email: "booking@switchedonpop.com", outlet: "Switched on Pop", genre: "Pop", region: "US", beat: "Booking, Guest Appearances", bio: "Booking email for Switched on Pop guest appearances and events. Listed on switchedonpop.com/contact.", articleCount: 0 },
    // ── Sound Opinions ─────────────────────────────────────────────────────
    { name: "Sound Opinions (Alex Claiborne)", email: "alex@soundopinions.org", outlet: "Sound Opinions", genre: "Rock, Indie, All Genres", region: "US", beat: "Music Reviews, Interviews", bio: "Producer at Sound Opinions, the world's only rock 'n' roll talk show. Hosted by Greg Kot and Jim DeRogatis. Listed on soundopinions.org.", articleCount: 0 },
    { name: "Sound Opinions Interact", email: "interact@soundopinions.org", outlet: "Sound Opinions", genre: "Rock, Indie, All Genres", region: "US", beat: "Listener Interaction", bio: "Sound Opinions listener interaction and feedback email. Public address from soundopinions.org.", articleCount: 0 },
    // ── All Songs Considered (NPR) ─────────────────────────────────────────
    { name: "All Songs Considered (NPR)", email: "allsongs@npr.org", outlet: "All Songs Considered", genre: "All Genres, Indie, Folk", region: "US", beat: "New Music Discovery", bio: "NPR's flagship music discovery podcast. Submit with subject 'Please consider my music' and a streaming link. Listed on NPR.org.", articleCount: 0 },
    // ── The Indie Artist Podcast ───────────────────────────────────────────
    { name: "The Indie Artist Podcast", email: "theindieartistpodcast@gmail.com", outlet: "The Indie Artist Podcast", genre: "All Genres, Indie", region: "Global", beat: "Indie Artist Interviews", bio: "Podcast featuring independent artists. Submit new album/EP or 3 songs from Bandcamp. Listed on theindieartistpodcast.wordpress.com.", articleCount: 0 },
    // ── For The Love of Bands Podcast ──────────────────────────────────────
    { name: "For The Love of Bands Podcast", email: "info@fortheloveofbands.com", outlet: "For The Love of Bands", genre: "Indie, Folk, Alternative", region: "Global", beat: "Indie Music Podcast & Blog", bio: "New music podcast featuring upcoming artists. Use their official submission form for music; this email for general inquiries. Listed on fortheloveofbands.com.", articleCount: 0 },
    // ── The Needle Drop ────────────────────────────────────────────────────
    { name: "Anthony Fantano (The Needle Drop)", email: "therealgiggens@gmail.com", outlet: "The Needle Drop", genre: "All Genres", region: "US", beat: "Music Reviews, Album Reviews", bio: "Anthony Fantano's business/interview inquiries email. World's busiest music nerd. Music submissions via form at theneedledrop.com/contact.", articleCount: 0 },
    // ── Indie And A Show Podcast ───────────────────────────────────────────
    // Uses Google Form for podcast submissions: https://forms.gle/s8BvdTbyPGEqGYjs7
    { name: "Indie And A Show Podcast", email: "contact@indieandashow.com", outlet: "Indie And A Show", genre: "Indie, Alternative", region: "UK", beat: "Indie Artist Interviews, Reviews", bio: "UK-based indie music podcast with reviews and artist spotlights. Submit via Google Form or contact form at indieandashow.com/pages/submit.", articleCount: 0 },
    // ── Song Exploder Booking ──────────────────────────────────────────────
    { name: "Andrew Morgan (Song Exploder Booking)", email: "andrew@groundcontroltouring.com", outlet: "Song Exploder / Ground Control Touring", genre: "All Genres", region: "US", beat: "Event Booking, Speaking", bio: "Booking agent for Song Exploder events and Hrishikesh Hirway speaking engagements at Ground Control Touring. Listed on songexploder.net/about.", articleCount: 0 },
  ];

  // Insert all contacts
  const allContacts = [
    ...journalists.map((j) => ({ ...j, type: "journalist" as const })),
    ...curators.map((c) => ({ ...c, type: "curator" as const })),
    ...blogs.map((b) => ({ ...b, type: "blog" as const })),
    ...podcasters.map((p) => ({ ...p, type: "podcaster" as const })),
  ];

  for (const contact of allContacts) {
    await prisma.contact.upsert({
      where: { id: `seed-${contact.email.replace(/[@.]/g, "-")}` },
      update: {
        name: contact.name,
        outlet: contact.outlet,
        genre: contact.genre,
        region: contact.region,
        beat: contact.beat,
        bio: contact.bio,
        articleCount: contact.articleCount,
        type: contact.type,
      },
      create: {
        id: `seed-${contact.email.replace(/[@.]/g, "-")}`,
        name: contact.name,
        email: contact.email,
        outlet: contact.outlet,
        type: contact.type,
        genre: contact.genre,
        region: contact.region,
        beat: contact.beat,
        bio: contact.bio,
        articleCount: contact.articleCount,
        verified: true,
      },
    });
  }

  console.log(`Seeded ${allContacts.length} contacts`);

  // ─── Pitch Requests ───────────────────────────────────────────────────────

  const pitchRequests = [
    {
      title: "Looking for indie artists for SXSW 2026 roundup article",
      description: "Writing a comprehensive guide to must-see indie acts at SXSW 2026. Looking for unsigned or independent artists with a strong live show and new music to promote.",
      outlet: "Austin Chronicle",
      journalist: "Rachel Martinez",
      category: "festival",
      deadline: "2026-03-18",
      genres: "indie,rock,alternative,folk",
      regions: "US",
    },
    {
      title: "New music Friday playlist submissions — fresh indie & alternative",
      description: "Accepting submissions for New Music Friday and Fresh Finds playlists. Priority given to artists with upcoming releases in the next 2 weeks. Must have Spotify artist profile.",
      outlet: "Spotify Editorial",
      journalist: "Editorial Team",
      category: "playlist",
      deadline: "Rolling",
      genres: "indie,alternative,pop,rock",
      regions: "Global",
    },
    {
      title: "Seeking live venue profiles for summer entertainment guide",
      description: "Compiling our annual summer entertainment guide. Looking for unique live music venues with interesting programming, history, or renovation stories.",
      outlet: "Time Out",
      journalist: "Alex Thompson",
      category: "venue_feature",
      deadline: "2026-03-25",
      genres: "all",
      regions: "US,UK",
    },
    {
      title: "Emerging artists to watch in 2026 — podcast interview requests",
      description: "Season 20 focusing on emerging artists. Looking for musicians who can discuss their creative process in depth. Must have at least one released track.",
      outlet: "Song Exploder",
      journalist: "Hrishikesh Hirway",
      category: "podcast",
      deadline: "2026-04-01",
      genres: "all",
      regions: "Global",
    },
    {
      title: "Hip hop producers breaking new ground — feature article",
      description: "Feature on innovative hip hop producers. Interested in those blending traditional beats with electronic or world music elements. 3000-word feature piece.",
      outlet: "Complex",
      journalist: "Chris Hernandez",
      category: "feature_article",
      deadline: "2026-03-20",
      genres: "hip hop,rap,electronic",
      regions: "US",
    },
    {
      title: "Local music scene spotlights — Nashville, Austin, Portland",
      description: "NPR series on thriving local music scenes. Seeking artists and venue owners who are integral to their local community. Radio interview + online feature.",
      outlet: "NPR Music",
      journalist: "Karen Gutierrez",
      category: "scene_spotlight",
      deadline: "2026-04-05",
      genres: "all",
      regions: "US",
    },
    {
      title: "Electronic music rising stars — end of year list prep",
      description: "Early research for our end-of-year electronic music coverage. Looking for breakthrough electronic artists and producers releasing in 2026.",
      outlet: "Resident Advisor",
      journalist: "Nina Kowalski",
      category: "feature_article",
      deadline: "2026-05-01",
      genres: "electronic,techno,house,ambient",
      regions: "Global",
    },
    {
      title: "Singer-songwriter showcase — acoustic sessions",
      description: "Recording intimate acoustic sessions for our YouTube channel and podcast. Seeking folk and singer-songwriter artists for filmed performances.",
      outlet: "Paste Magazine",
      journalist: "James Wright",
      category: "podcast",
      deadline: "2026-04-15",
      genres: "folk,singer-songwriter,americana,acoustic",
      regions: "US",
    },
  ];

  for (const pr of pitchRequests) {
    await prisma.pitchRequest.create({ data: pr });
  }

  console.log(`Seeded ${pitchRequests.length} pitch requests`);

  // ─── Demo Press Releases ──────────────────────────────────────────────────

  await prisma.pressRelease.createMany({
    data: [
      {
        userId: user.id,
        title: "Rising Indie Band 'The Midnight Owls' Announces Debut Album 'Electric Dreams'",
        subtitle: "Austin-based quartet set to release 12-track debut produced by Grammy-winner on April 15",
        body: `AUSTIN, TX — March 10, 2026 — The Midnight Owls, Austin's fastest-rising indie rock quartet, today announced their highly anticipated debut album "Electric Dreams," set for release on April 15, 2026 via Independent Music Co.\n\nThe 12-track album, produced by Grammy-winning producer Joe Smith at Sunset Studios in Austin, showcases the band's signature blend of shimmering guitars, driving rhythms, and introspective lyrics that have earned them a devoted following in the Austin live music scene.\n\n"Electric Dreams is about the tension between who we are online and who we are in real life," says lead vocalist and guitarist Alex Turner. "We wanted to make an album that sounds like staying up until 4 AM scrolling through your phone while the world sleeps around you."\n\nThe album's lead single, "Neon Heartbeat," has already garnered attention from tastemakers, receiving adds on Spotify's New Music Friday and Apple Music's Essentials playlists. The track has accumulated over 500,000 streams in its first two weeks.\n\nTo celebrate the release, The Midnight Owls will embark on a 20-city North American tour beginning May 1, with stops at iconic venues including The Bowery Ballroom (NYC), The Troubadour (LA), and Empty Bottle (Chicago).\n\n###\n\nAbout The Midnight Owls:\nFormed in 2024 in Austin, TX, The Midnight Owls blend indie rock, dream pop, and post-punk into a sound that's both nostalgic and forward-looking. The band has performed at SXSW, Austin City Limits, and sold out venues across Texas.`,
        type: "album_release",
        status: "distributed",
        distributedAt: new Date("2026-03-10"),
        outletsReached: 47,
        totalViews: 2340,
      },
      {
        userId: user.id,
        title: "The Blue Note Announces Spring 2026 Concert Series Featuring 20+ Artists",
        subtitle: "Historic Austin venue unveils ambitious lineup spanning indie rock to jazz",
        body: `AUSTIN, TX — March 5, 2026 — The Blue Note, Austin's beloved live music institution, today announced its Spring 2026 Concert Series featuring over 20 acts across 8 weeks of programming.\n\nThe series kicks off March 22 with indie rock favorites The Midnight Owls and runs through May 15, featuring a diverse roster that includes Luna & The Wolves, DJ Solarflare, Brass Revolution, and Maya Chen among others.\n\n"This spring lineup represents everything we love about Austin's music scene," says venue owner Maria Santos. "We've got local favorites, touring acts, and some incredible emerging artists that we think are about to break big."\n\nHighlights include:\n• March 22: The Midnight Owls (Album Release Show)\n• March 28: Luna & The Wolves\n• April 3: DJ Solarflare (Electronic Night)\n• April 10: Brass Revolution (Jazz Night)\n• April 15: Maya Chen (Acoustic Intimate Series)\n\nTickets are available now through the venue website with early bird pricing available through March 15.\n\n###\n\nAbout The Blue Note:\nOpened in 1985, The Blue Note has been a cornerstone of Austin's live music scene for over 40 years, hosting thousands of shows and launching the careers of numerous artists.`,
        type: "venue_event",
        status: "distributed",
        distributedAt: new Date("2026-03-05"),
        outletsReached: 23,
        totalViews: 1120,
      },
    ],
  });

  console.log("Seeded 2 press releases");

  // ─── Demo Campaigns ───────────────────────────────────────────────────────

  await prisma.campaign.createMany({
    data: [
      {
        userId: user.id,
        name: "New Album Launch — 'Electric Dreams'",
        type: "album_release",
        status: "active",
        subject: "New Album: The Midnight Owls — 'Electric Dreams' (April 15)",
        body: "Hi {firstName},\n\nI'm reaching out because I think you'd be interested in the debut album from The Midnight Owls...",
        sentAt: new Date("2026-03-10"),
      },
      {
        userId: user.id,
        name: "Tour Announcement — Spring 2026",
        type: "tour",
        status: "completed",
        subject: "Tour Announcement: The Midnight Owls — 20-City North American Tour",
        body: "Hi {firstName},\n\nExciting news — The Midnight Owls are hitting the road...",
        sentAt: new Date("2026-03-05"),
        completedAt: new Date("2026-03-08"),
      },
      {
        userId: user.id,
        name: "Single Drop — 'Midnight Run'",
        type: "single_release",
        status: "draft",
        subject: "",
        body: "",
      },
      {
        userId: user.id,
        name: "Festival Lineup Announcement",
        type: "festival",
        status: "scheduled",
        subject: "SoundWave Festival 2026 Full Lineup Revealed",
        body: "Hi {firstName},\n\nWe're thrilled to share the full lineup for SoundWave Festival 2026...",
        scheduledAt: new Date("2026-03-18"),
      },
    ],
  });

  console.log("Seeded 4 campaigns");

  // ─── Demo Media Mentions ──────────────────────────────────────────────────

  await prisma.mediaMention.createMany({
    data: [
      { userId: user.id, title: "'Electric Dreams' Review: The Midnight Owls Deliver a Stunning Debut", outlet: "Pitchfork", author: "Sarah Chen", type: "review", sentiment: "positive", reach: "2.4M", date: new Date("2026-03-12") },
      { userId: user.id, title: "10 Indie Albums You Need to Hear This Spring", outlet: "NME", author: "Emily Wright", type: "roundup", sentiment: "positive", reach: "1.8M", date: new Date("2026-03-11") },
      { userId: user.id, title: "The Blue Note Announces Exciting Spring Concert Series", outlet: "Austin Chronicle", author: "Rachel Martinez", type: "news", sentiment: "positive", reach: "450K", date: new Date("2026-03-10") },
      { userId: user.id, title: "Spring Tour Announcement Roundup: Who's Hitting the Road", outlet: "Consequence of Sound", author: "Liam O'Brien", type: "roundup", sentiment: "neutral", reach: "1.2M", date: new Date("2026-03-09") },
      { userId: user.id, title: "Artist Interview: Behind the Making of 'Midnight Run'", outlet: "Song Exploder", author: "Hrishikesh Hirway", type: "podcast", sentiment: "positive", reach: "890K", date: new Date("2026-03-08") },
      { userId: user.id, title: "New Music Friday Picks: Our Favorite Releases This Week", outlet: "Stereogum", author: "Jake Torres", type: "playlist", sentiment: "positive", reach: "780K", date: new Date("2026-03-07") },
    ],
  });

  console.log("Seeded 6 media mentions");

  // ─── Demo Venue ───────────────────────────────────────────────────────────

  const venue = await prisma.venue.create({
    data: {
      userId: user.id,
      name: "The Blue Note",
      location: "Austin, TX",
      address: "123 6th Street, Austin, TX 78701",
      capacity: 500,
      description: "Austin's premier live music venue since 1985.",
      website: "https://thebluenote-austin.example.com",
      rating: 4.8,
    },
  });

  await prisma.show.createMany({
    data: [
      { venueId: venue.id, artist: "The Midnight Owls", date: new Date("2026-03-22"), time: "8:00 PM", ticketsSold: 325, capacity: 500, pressStatus: "sent", coverage: 3 },
      { venueId: venue.id, artist: "Luna & The Wolves", date: new Date("2026-03-28"), time: "9:00 PM", ticketsSold: 400, capacity: 500, pressStatus: "confirmed", coverage: 5 },
      { venueId: venue.id, artist: "DJ Solarflare", date: new Date("2026-04-03"), time: "10:00 PM", ticketsSold: 210, capacity: 500, pressStatus: "draft", coverage: 0 },
      { venueId: venue.id, artist: "Brass Revolution", date: new Date("2026-04-10"), time: "7:30 PM", ticketsSold: 275, capacity: 500, pressStatus: "sent", coverage: 2 },
      { venueId: venue.id, artist: "Maya Chen (Acoustic)", date: new Date("2026-04-15"), time: "7:00 PM", ticketsSold: 450, capacity: 500, pressStatus: "not_started", coverage: 0 },
      { venueId: venue.id, artist: "The Vinyl Prophets", date: new Date("2026-04-22"), time: "8:30 PM", ticketsSold: 150, capacity: 500, pressStatus: "not_started", coverage: 0 },
    ],
  });

  console.log("Seeded venue with 6 shows");

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
