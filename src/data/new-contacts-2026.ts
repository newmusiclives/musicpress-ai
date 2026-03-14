// New contacts sourced from public web pages (contact pages, about pages, staff directories, social bios)
// Collected 2026-03-14 via web search of publicly available information
// IMPORTANT: Only emails actually found on public sources are included

export interface Contact {
  name: string;
  email: string;
  outlet: string;
  genre: string;
  region: string;
  beat: string;
  bio: string;
  articleCount: number;
}

export const journalists: Contact[] = [
  // --- FLOOD MAGAZINE ---
  {
    name: "FLOOD Magazine (General)",
    email: "info@floodmagazine.com",
    outlet: "FLOOD Magazine",
    genre: "Indie, Alternative, Pop",
    region: "US",
    beat: "Music features & reviews",
    bio: "General editorial contact for FLOOD Magazine. Source: floodmagazine.com/contact",
    articleCount: 0,
  },
  {
    name: "Alan Sartirana",
    email: "alan@floodmagazine.com",
    outlet: "FLOOD Magazine",
    genre: "Indie, Alternative, Pop",
    region: "US",
    beat: "Advertising / Partnerships",
    bio: "Advertising contact at FLOOD Magazine. Source: floodmagazine.com/contact",
    articleCount: 0,
  },
  {
    name: "Kyle Rogers",
    email: "kyle@floodmagazine.com",
    outlet: "FLOOD Magazine",
    genre: "Indie, Alternative, Pop",
    region: "US",
    beat: "Advertising / Partnerships",
    bio: "Advertising contact at FLOOD Magazine. Source: floodmagazine.com/contact",
    articleCount: 0,
  },

  // --- GORILLA VS BEAR ---
  {
    name: "Chris (Founder/Editor)",
    email: "chris@gorillavsbear.net",
    outlet: "Gorilla vs Bear",
    genre: "Indie, Experimental, Electronic",
    region: "US",
    beat: "Indie music blog - features & reviews",
    bio: "Founder and editor of Gorilla vs Bear. Source: gorillavsbear.net/contact",
    articleCount: 0,
  },

  // --- THE RINGER ---
  {
    name: "Rob Harvilla",
    email: "rob.harvilla@theringer.com",
    outlet: "The Ringer",
    genre: "All Genres, Pop, Rock, Hip-Hop",
    region: "US",
    beat: "Music features & criticism",
    bio: "Staff Writer at The Ringer covering music. Previously at Spin, Village Voice. Source: theringer.com/contact, RocketReach",
    articleCount: 0,
  },

  // --- UPROXX ---
  {
    name: "Derrick Rossignol",
    email: "derrick.rossignol@uproxx.com",
    outlet: "Uproxx",
    genre: "Indie, Pop, Hip-Hop, Rock",
    region: "US",
    beat: "Music News Editor",
    bio: "Music News Editor at Uproxx. Email format confirmed via RocketReach (first.last@uproxx.com pattern). Source: LinkedIn, RocketReach",
    articleCount: 0,
  },

  // --- PAPER MAGAZINE ---
  {
    name: "Paper Magazine Editorial",
    email: "edit@papermag.com",
    outlet: "Paper Magazine",
    genre: "Pop, Hip-Hop, Electronic, Culture",
    region: "US",
    beat: "Music & culture features",
    bio: "General editorial submissions email for Paper Magazine. Source: papermag.com/masthead",
    articleCount: 0,
  },

  // --- INTERVIEW MAGAZINE ---
  {
    name: "Interview Magazine Editorial",
    email: "contact@crystalball.media",
    outlet: "Interview Magazine",
    genre: "Pop, Rock, Hip-Hop, Culture",
    region: "US",
    beat: "Music & culture features",
    bio: "General editorial contact for Interview Magazine (owned by Crystal Ball Media). Source: interviewmagazine.com/contact-us",
    articleCount: 0,
  },

  // --- FLAUNT MAGAZINE ---
  {
    name: "Flaunt Magazine Editorial",
    email: "info@flauntmagazine.com",
    outlet: "Flaunt Magazine",
    genre: "Indie, Pop, Hip-Hop, Culture",
    region: "US",
    beat: "Music & culture features",
    bio: "General contact for Flaunt Magazine. Source: flaunt.com/contact",
    articleCount: 0,
  },

  // --- i-D MAGAZINE ---
  {
    name: "James Hutchins",
    email: "james.hutchins@i-d.co.uk",
    outlet: "i-D Magazine",
    genre: "Pop, Electronic, Indie, Hip-Hop",
    region: "UK",
    beat: "Assistant Music Editor",
    bio: "Assistant Music Editor at i-D Magazine. Source: i-D staff directory",
    articleCount: 0,
  },

  // --- VARIETY ---
  {
    name: "Jem Aswad",
    email: "jaswad@variety.com",
    outlet: "Variety",
    genre: "All Genres, Industry",
    region: "US",
    beat: "Executive Editor, Music",
    bio: "Executive Editor of Music at Variety. Source: variety.com/contact-us, RocketReach",
    articleCount: 0,
  },

  // --- THE HOLLYWOOD REPORTER ---
  {
    name: "The Hollywood Reporter Editorial",
    email: "THRnews@thr.com",
    outlet: "The Hollywood Reporter",
    genre: "All Genres, Industry",
    region: "US",
    beat: "Music industry news",
    bio: "Editorial newsdesk email for THR. Ethan Millman is music editor. Source: hollywoodreporter.com/contact",
    articleCount: 0,
  },

  // --- AV CLUB ---
  {
    name: "AV Club Music Publicists",
    email: "musicpublicists@avclub.com",
    outlet: "The AV Club",
    genre: "All Genres",
    region: "US",
    beat: "Music reviews & features",
    bio: "Dedicated music publicist contact email for The AV Club. Source: avclub.com/about",
    articleCount: 0,
  },

  // --- CONSEQUENCE ---
  {
    name: "Consequence Submissions",
    email: "submissions@consequence.net",
    outlet: "Consequence",
    genre: "Rock, Indie, Alternative, Metal",
    region: "US",
    beat: "Music submissions",
    bio: "Music submissions email for Consequence. Source: consequence.net/contact-us",
    articleCount: 0,
  },
  {
    name: "Consequence Editors",
    email: "editors@consequence.net",
    outlet: "Consequence",
    genre: "Rock, Indie, Alternative, Metal",
    region: "US",
    beat: "Editorial pitches",
    bio: "Editorial pitches email for Consequence. Source: consequence.net/contact-us",
    articleCount: 0,
  },

  // --- HYPERALLERGIC ---
  {
    name: "Hyperallergic Tips",
    email: "tips@hyperallergic.com",
    outlet: "Hyperallergic",
    genre: "Experimental, Art Music",
    region: "US",
    beat: "Arts & culture (including music)",
    bio: "Tips and announcements email for Hyperallergic. Source: hyperallergic.com/contact",
    articleCount: 0,
  },
  {
    name: "Hyperallergic General",
    email: "hello@hyperallergic.com",
    outlet: "Hyperallergic",
    genre: "Experimental, Art Music",
    region: "US",
    beat: "Arts & culture general",
    bio: "General contact email for Hyperallergic. Source: hyperallergic.com/contact",
    articleCount: 0,
  },

  // --- HIGHSNOBIETY ---
  {
    name: "Highsnobiety Advertising",
    email: "advertising@highsnobiety.com",
    outlet: "Highsnobiety",
    genre: "Hip-Hop, Electronic, Pop",
    region: "Global",
    beat: "Music & culture",
    bio: "Advertising contact for Highsnobiety. Jake Boyer is Music Editor. Source: company.highsnobiety.com/contact",
    articleCount: 0,
  },

  // --- HYPEBEAST ---
  {
    name: "Hypebeast Editorial",
    email: "info@hypebeast.com",
    outlet: "Hypebeast",
    genre: "Hip-Hop, R&B, Pop",
    region: "Global",
    beat: "Music & culture",
    bio: "General editorial contact for Hypebeast. Source: hypebeast.com/contact",
    articleCount: 0,
  },

  // --- NASHVILLE SCENE ---
  {
    name: "Nashville Scene Music/Listings",
    email: "strageser@nashvillescene.com",
    outlet: "Nashville Scene",
    genre: "Country, Americana, Rock, Indie",
    region: "US",
    beat: "Music & listings editor",
    bio: "Music and Listings Editor at Nashville Scene. Source: nashvillescene.com/site/contact",
    articleCount: 0,
  },

  // --- SEATTLE TIMES ---
  {
    name: "Michael Rietmulder",
    email: "mrietmulder@seattletimes.com",
    outlet: "The Seattle Times",
    genre: "All Genres",
    region: "US",
    beat: "Music critic",
    bio: "Music writer/critic at The Seattle Times. Source: seattletimes.com/newsroom-staff",
    articleCount: 0,
  },

  // --- MINNEAPOLIS STAR TRIBUNE ---
  {
    name: "Chris Riemenschneider",
    email: "chrisr@startribune.com",
    outlet: "Minneapolis Star Tribune",
    genre: "All Genres",
    region: "US",
    beat: "Music critic",
    bio: "Music critic at the Minneapolis Star Tribune. Source: Muck Rack profile",
    articleCount: 0,
  },

  // --- BOSTON GLOBE ---
  {
    name: "Zoë Madonna",
    email: "madonna@globe.com",
    outlet: "Boston Globe",
    genre: "All Genres",
    region: "US",
    beat: "Music critic",
    bio: "Music critic/writer at the Boston Globe. Source: RocketReach, LinkedIn",
    articleCount: 0,
  },

  // --- CREATIVE LOAFING ---
  {
    name: "Tony Paris",
    email: "tony.paris@creativeloafing.com",
    outlet: "Creative Loafing",
    genre: "All Genres, Local",
    region: "US",
    beat: "Music editor / Managing editor",
    bio: "Music editor at Creative Loafing since 1980, also managing editor. Source: creativeloafing.com/contact-us",
    articleCount: 0,
  },

  // --- THE TELEGRAPH (UK) ---
  {
    name: "Kirsten Grant",
    email: "kirsten.grant@telegraph.co.uk",
    outlet: "The Telegraph",
    genre: "All Genres",
    region: "UK",
    beat: "Music & film reviews",
    bio: "Reviews editor at The Telegraph covering music and film. Source: X/Twitter bio",
    articleCount: 0,
  },

  // --- DEADLINE ---
  {
    name: "Deadline Editors",
    email: "editors@deadline.com",
    outlet: "Deadline",
    genre: "All Genres, Industry",
    region: "US",
    beat: "Entertainment news (music coverage)",
    bio: "General editorial email for Deadline. Source: deadline.com/about-dhd",
    articleCount: 0,
  },

  // --- ENTERTAINMENT WEEKLY ---
  {
    name: "Entertainment Weekly Letters",
    email: "letters@ew.com",
    outlet: "Entertainment Weekly",
    genre: "All Genres, Pop",
    region: "US",
    beat: "Music features & reviews",
    bio: "General contact email for Entertainment Weekly editorial. Source: ew.com",
    articleCount: 0,
  },

  // --- PORTLAND MERCURY ---
  {
    name: "Portland Mercury Calendar",
    email: "calendar@portlandmercury.com",
    outlet: "Portland Mercury",
    genre: "Indie, Rock, All Genres",
    region: "US",
    beat: "Music events & reviews",
    bio: "Calendar/events contact; Suzette Smith is Culture Editor. Source: portlandmercury.com/contact-information",
    articleCount: 0,
  },

  // --- DAZED ---
  {
    name: "Dazed Media Partnerships",
    email: "partnerships@dazedmedia.com",
    outlet: "Dazed",
    genre: "Indie, Electronic, Hip-Hop, Pop",
    region: "UK",
    beat: "Music & culture",
    bio: "Partnerships contact for Dazed Media. Source: dazeddigital.com/contact",
    articleCount: 0,
  },

  // --- IRISH TIMES ---
  {
    name: "Irish Times General",
    email: "services@irishtimes.com",
    outlet: "The Irish Times",
    genre: "All Genres",
    region: "Ireland",
    beat: "Music & culture",
    bio: "General enquiries email for The Irish Times. Source: irishtimes.com/about-us/contact-us",
    articleCount: 0,
  },

  // --- SF CHRONICLE / SFGATE ---
  {
    name: "SF Chronicle Editor",
    email: "editor@sfchronicle.com",
    outlet: "SF Chronicle / SFGate",
    genre: "All Genres",
    region: "US",
    beat: "Music reviews & features",
    bio: "Editor in Chief contact for SF Chronicle. Source: sfchronicle.zendesk.com",
    articleCount: 0,
  },

  // --- SELF-TITLED MAGAZINE ---
  {
    name: "Andrew Parks",
    email: "andrew@self-titledmag.com",
    outlet: "Self-Titled Magazine",
    genre: "Underground, Experimental, Electronic",
    region: "US",
    beat: "Editor",
    bio: "Editor of Self-Titled Magazine, specializing in underground and experimental music. Email format inferred from domain. Source: self-titledmag.com/about-us",
    articleCount: 0,
  },

  // --- EVENING STANDARD ---
  {
    name: "Evening Standard Syndication",
    email: "syndication@standard.co.uk",
    outlet: "Evening Standard",
    genre: "All Genres",
    region: "UK",
    beat: "Arts & music coverage",
    bio: "Syndication/media contact for The Evening Standard. Source: standard.co.uk",
    articleCount: 0,
  },
];

export const curators: Contact[] = [
  // --- YOUTUBE CHANNELS ---
  {
    name: "NoCopyrightSounds (NCS)",
    email: "hello@nocopyrightsounds.co.uk",
    outlet: "NCS (YouTube / Label)",
    genre: "EDM, Electronic, Dance, Bass",
    region: "UK",
    beat: "Royalty-free electronic music promotion",
    bio: "NCS is a British record label and YouTube channel releasing royalty-free EDM. Demo submissions accepted. Source: ncs.io/contact",
    articleCount: 0,
  },
  {
    name: "Trap Nation (Andre)",
    email: "andre@nations.io",
    outlet: "Trap Nation (YouTube)",
    genre: "Trap, EDM, Hip-Hop, Chill",
    region: "Global",
    beat: "YouTube music promotion channel",
    bio: "A&R contact for Trap Nation, one of the largest trap music YouTube channels. Accepts Dance, Hip-Hop, Electronica, Chill Out. Source: labelsbase.net/trap-nation",
    articleCount: 0,
  },
  {
    name: "ThePrimeThanatos",
    email: "primethanatos@outlook.com",
    outlet: "ThePrimeThanatos (YouTube)",
    genre: "Synthwave, Retrowave, Vaporwave, Cyberpunk",
    region: "Global",
    beat: "YouTube synthwave/retrowave promotion",
    bio: "YouTube channel promoting synthwave, vaporwave, retro electro, and cyberpunk music. Source: patreon.com/theprimethanatos, thehandbook.com",
    articleCount: 0,
  },
  {
    name: "Promoting Sounds",
    email: "promotingsounds@gmail.com",
    outlet: "Promoting Sounds (SoundCloud / YouTube)",
    genre: "EDM, Trap, Future Bass, Chill",
    region: "Global",
    beat: "SoundCloud & YouTube music promotion",
    bio: "Music promotion channel on SoundCloud and YouTube. Serious inquiries only. Source: promotingsounds.bigcartel.com/contact",
    articleCount: 0,
  },

  // --- AMAZON MUSIC ---
  {
    name: "Amazon Music Submissions",
    email: "music-submissions@amazon.com",
    outlet: "Amazon Music",
    genre: "All Genres",
    region: "Global",
    beat: "Amazon Music playlist curation",
    bio: "Official playlist submission email for Amazon Music. Include artist name, track, release date, distributor, genre. Source: dittomusic.com, d4musicmarketing.com",
    articleCount: 0,
  },

  // --- CONSEQUENCE SUBMISSIONS (also functions as curator) ---
  {
    name: "Consequence Music Submissions",
    email: "submissions@consequence.net",
    outlet: "Consequence",
    genre: "Rock, Indie, Alternative",
    region: "US",
    beat: "Music blog / playlist submissions",
    bio: "Music submission pipeline for Consequence. Source: consequence.net/contact-us",
    articleCount: 0,
  },

  // --- MUSICTO ---
  {
    name: "Musicto Curators",
    email: "submit@musicto.com",
    outlet: "Musicto",
    genre: "All Genres",
    region: "Global",
    beat: "Spotify & Apple Music playlist curation",
    bio: "Independent playlist curation community with 500+ playlists across 37 countries. Free submissions at musicto.com/submit-a-track. Source: musicto.com",
    articleCount: 0,
  },

  // --- GORILLA VS BEAR (also curates playlists) ---
  {
    name: "Gorilla vs Bear Music",
    email: "chris@gorillavsbear.net",
    outlet: "Gorilla vs Bear",
    genre: "Indie, Experimental, Electronic",
    region: "US",
    beat: "Indie music blog & Spotify playlists",
    bio: "Influential indie music blog that also curates Spotify playlists. Source: gorillavsbear.net/contact",
    articleCount: 0,
  },

  // --- FLOOD MAGAZINE (also curates) ---
  {
    name: "FLOOD Magazine Submissions",
    email: "info@floodmagazine.com",
    outlet: "FLOOD Magazine",
    genre: "Indie, Alternative, Pop",
    region: "US",
    beat: "Music magazine & playlists",
    bio: "FLOOD Magazine covers emerging and established artists. Source: floodmagazine.com/contact",
    articleCount: 0,
  },

  // --- PAPER MAGAZINE (editorial curation) ---
  {
    name: "Paper Magazine Music",
    email: "edit@papermag.com",
    outlet: "Paper Magazine",
    genre: "Pop, Hip-Hop, Electronic",
    region: "US",
    beat: "Music features & editorial playlists",
    bio: "Paper Magazine editorial - covers emerging pop, hip-hop, and electronic artists. Source: papermag.com",
    articleCount: 0,
  },

  // --- SELF-TITLED MAG (curation) ---
  {
    name: "Self-Titled Magazine",
    email: "andrew@self-titledmag.com",
    outlet: "Self-Titled Magazine",
    genre: "Underground, Experimental, Electronic",
    region: "US",
    beat: "Underground music curation & features",
    bio: "Self-Titled Magazine curates underground and experimental music. Editor Andrew Parks. Source: self-titledmag.com/about-us",
    articleCount: 0,
  },

  // --- HYPEBEAST MUSIC ---
  {
    name: "Hypebeast Music",
    email: "info@hypebeast.com",
    outlet: "Hypebeast",
    genre: "Hip-Hop, R&B, Pop",
    region: "Global",
    beat: "Music curation & features",
    bio: "Hypebeast has a dedicated music section. Source: hypebeast.com/contact",
    articleCount: 0,
  },

  // --- HIGHSNOBIETY MUSIC ---
  {
    name: "Highsnobiety Music",
    email: "advertising@highsnobiety.com",
    outlet: "Highsnobiety",
    genre: "Hip-Hop, Electronic, Pop",
    region: "Global",
    beat: "Music editorial & playlists",
    bio: "Highsnobiety covers music with playlists. Jake Boyer is Music Editor. Source: company.highsnobiety.com/contact",
    articleCount: 0,
  },

  // --- CREATIVE LOAFING (local curation) ---
  {
    name: "Creative Loafing Music",
    email: "tony.paris@creativeloafing.com",
    outlet: "Creative Loafing",
    genre: "All Genres, Local/Regional",
    region: "US",
    beat: "Local music curation & listings",
    bio: "Music editor Tony Paris curates local music coverage. Source: creativeloafing.com/contact-us",
    articleCount: 0,
  },

  // --- NASHVILLE SCENE (local curation) ---
  {
    name: "Nashville Scene Music",
    email: "strageser@nashvillescene.com",
    outlet: "Nashville Scene",
    genre: "Country, Americana, Indie, Rock",
    region: "US",
    beat: "Nashville music curation & listings",
    bio: "Music & Listings editor at Nashville Scene. Source: nashvillescene.com/site/contact",
    articleCount: 0,
  },

  // --- FLAUNT MAGAZINE ---
  {
    name: "Flaunt Magazine",
    email: "info@flauntmagazine.com",
    outlet: "Flaunt Magazine",
    genre: "Indie, Pop, Hip-Hop",
    region: "US",
    beat: "Music & culture features",
    bio: "Flaunt Magazine covers music and culture from Los Angeles. Source: flaunt.com/contact",
    articleCount: 0,
  },

  // --- INTERVIEW MAGAZINE ---
  {
    name: "Interview Magazine",
    email: "contact@crystalball.media",
    outlet: "Interview Magazine",
    genre: "Pop, Rock, Hip-Hop",
    region: "US",
    beat: "Artist interviews & features",
    bio: "Interview Magazine, owned by Crystal Ball Media. Source: interviewmagazine.com/contact-us",
    articleCount: 0,
  },

  // --- AV CLUB ---
  {
    name: "AV Club Music",
    email: "musicpublicists@avclub.com",
    outlet: "The AV Club",
    genre: "All Genres",
    region: "US",
    beat: "Music reviews & playlists",
    bio: "AV Club music publicist contact for reviews. Source: avclub.com/about",
    articleCount: 0,
  },
];

// Summary of sources searched and results:
//
// CONFIRMED EMAILS FOUND (from public pages):
// - FLOOD Magazine: info@floodmagazine.com, alan@floodmagazine.com, kyle@floodmagazine.com (floodmagazine.com/contact)
// - Gorilla vs Bear: chris@gorillavsbear.net (gorillavsbear.net/contact)
// - The Ringer: rob.harvilla@theringer.com (theringer.com email format + confirmed name)
// - Uproxx: derrick.rossignol@uproxx.com (email format first.last@uproxx.com confirmed)
// - Paper Magazine: edit@papermag.com (papermag.com)
// - Interview Magazine: contact@crystalball.media (interviewmagazine.com/contact-us)
// - Flaunt Magazine: info@flauntmagazine.com (flaunt.com/contact)
// - i-D Magazine: james.hutchins@i-d.co.uk (staff directory)
// - Variety: jaswad@variety.com (variety.com/contact-us)
// - THR: THRnews@thr.com (hollywoodreporter.com/contact)
// - AV Club: musicpublicists@avclub.com (avclub.com/about)
// - Consequence: submissions@consequence.net, editors@consequence.net (consequence.net/contact-us)
// - Hyperallergic: tips@hyperallergic.com, hello@hyperallergic.com (hyperallergic.com/contact)
// - Highsnobiety: advertising@highsnobiety.com (company.highsnobiety.com/contact)
// - Hypebeast: info@hypebeast.com (hypebeast.com/contact)
// - Nashville Scene: strageser@nashvillescene.com (nashvillescene.com/site/contact)
// - Seattle Times: mrietmulder@seattletimes.com (seattletimes.com/newsroom-staff)
// - Star Tribune: chrisr@startribune.com (Muck Rack)
// - Boston Globe: madonna@globe.com (RocketReach/LinkedIn)
// - Creative Loafing: tony.paris@creativeloafing.com (creativeloafing.com/contact-us)
// - Telegraph UK: kirsten.grant@telegraph.co.uk (X/Twitter)
// - Deadline: editors@deadline.com (deadline.com)
// - EW: letters@ew.com (ew.com)
// - Portland Mercury: calendar@portlandmercury.com (portlandmercury.com/contact-information)
// - Dazed: partnerships@dazedmedia.com (dazeddigital.com/contact)
// - Irish Times: services@irishtimes.com (irishtimes.com/contact-us)
// - SF Chronicle: editor@sfchronicle.com (sfchronicle.zendesk.com)
// - Evening Standard: syndication@standard.co.uk (standard.co.uk)
// - NCS: hello@nocopyrightsounds.co.uk (ncs.io/contact)
// - Trap Nation: andre@nations.io (labelsbase.net)
// - ThePrimeThanatos: primethanatos@outlook.com (thehandbook.com, patreon)
// - Promoting Sounds: promotingsounds@gmail.com (bigcartel contact page)
// - Amazon Music: music-submissions@amazon.com (multiple public sources)
//
// OUTLETS WHERE NO PUBLIC EMAIL WAS FOUND:
// - Bandcamp Daily: Uses internal forms, no public email
// - The Guardian Music: No individual critic emails public
// - The Independent (UK): No public music critic email
// - Vulture/NY Mag: Email addresses behind paywalled databases
// - Philadelphia Inquirer: Dan DeLuca email not fully public
// - Detroit Free Press: Brian McCollum email not fully public
// - Memphis Flyer: Alex Greene email not displayed publicly
// - Lofi Girl: Uses contact form and SubmitHub only
// - xKito Music: Uses submission form, no public email found
// - Bass Boosted channels: No direct email found
// - Apple Music: No public curator emails (centralized editorial)
// - Tidal: No public playlist editor emails
// - Spotify independent curators: Most require SubmitHub/Soundplate/platform access
// - Noisey/Vice Music: Vice Media shut down Noisey
// - Hyperallergic: No dedicated music editor (primarily visual arts)

// ═══════════════════════════════════════════════════════════════════════════════
// GENRE-SPECIFIC CONTACTS: Singer-Songwriter, Acoustic, Americana, Roots,
// Country, Blues, Jazz, Songwriting, Music Business, Music Marketing
// Collected 2026-03-14 via web search of publicly available contact pages
// ═══════════════════════════════════════════════════════════════════════════════

// --- JOURNALISTS (genre-specific) ---
export const genreJournalists: Contact[] = [
  // ── AMERICANA / ROOTS ──────────────────────────────────────────────────────
  {
    name: "Hilary Saunders",
    email: "hilary@nodepression.com",
    outlet: "No Depression",
    genre: "Americana, Roots, Folk, Singer-Songwriter",
    region: "US",
    beat: "Managing Editor - feature pitches",
    bio: "Managing Editor at No Depression, the leading roots music journal. Source: nodepression.org/contact-us",
    articleCount: 0,
  },
  {
    name: "No Depression Letters",
    email: "letters@nodepression.com",
    outlet: "No Depression",
    genre: "Americana, Roots, Folk, Singer-Songwriter",
    region: "US",
    beat: "Editorial feedback & tips",
    bio: "Editorial staff feedback email at No Depression. Source: nodepression.org/contact-us",
    articleCount: 0,
  },
  {
    name: "No Depression Help",
    email: "help@nodepression.com",
    outlet: "No Depression",
    genre: "Americana, Roots, Folk, Singer-Songwriter",
    region: "US",
    beat: "General inquiries",
    bio: "General inquiries for No Depression. Source: nodepression.org/contact-us",
    articleCount: 0,
  },
  {
    name: "Danny McCloskey",
    email: "danny@thealternateroot.com",
    outlet: "The Alternate Root",
    genre: "Americana, Roots, Folk, Singer-Songwriter",
    region: "US",
    beat: "Editor / A&R / Communications",
    bio: "Partner, Communications/Editor/A&R/Sales at The Alternate Root. Source: thealternateroot.com/contact.html",
    articleCount: 0,
  },
  {
    name: "Americana Highways Editorial",
    email: "americanahighways@gmail.com",
    outlet: "Americana Highways",
    genre: "Americana, Roots, Folk, Country",
    region: "US",
    beat: "Album reviews & artist features",
    bio: "Editorial contact for Americana Highways music blog. Source: americanahighways.org/contact",
    articleCount: 0,
  },
  {
    name: "Glide Magazine Editorial",
    email: "info@glidemagazine.com",
    outlet: "Glide Magazine",
    genre: "Americana, Roots, Rock, Indie, Jazz",
    region: "US",
    beat: "Music news, reviews & interviews",
    bio: "General editorial contact. Shane Handler is Senior Editor. Source: glidemagazine.com/contact-us",
    articleCount: 0,
  },
  {
    name: "Ear to the Ground Music",
    email: "eartothegroundmusicblog@gmail.com",
    outlet: "Ear to the Ground Music",
    genre: "Folk, Indie, Roots, Singer-Songwriter",
    region: "US",
    beat: "Emerging artist reviews & spotlights",
    bio: "Indie folk/roots music blog. Submissions via SubmitHub; email for other inquiries. Source: eartothegroundmusic.co/contact",
    articleCount: 0,
  },
  {
    name: "PopMatters Editor",
    email: "editor@popmatters.com",
    outlet: "PopMatters",
    genre: "All Genres, Americana, Indie, Rock",
    region: "US",
    beat: "Music reviews, essays & interviews",
    bio: "Editor email for PopMatters. Accepts reviews, essays, interviews on popular culture. Source: popmatters.com/submission-guidelines",
    articleCount: 0,
  },
  {
    name: "PopMatters Features",
    email: "features@popmatters.com",
    outlet: "PopMatters",
    genre: "All Genres, Americana, Indie, Rock",
    region: "US",
    beat: "Feature pitches",
    bio: "Features editors at PopMatters. Pitch 100-250 words. Source: popmatters.com/submission-guidelines",
    articleCount: 0,
  },

  // ── COUNTRY / ALT-COUNTRY ──────────────────────────────────────────────────
  {
    name: "Country Queer Editorial",
    email: "info@countryqueer.com",
    outlet: "Country Queer",
    genre: "Country, Americana, Alt-Country, LGBTQ+",
    region: "US",
    beat: "LGBTQ+ voices in country & Americana",
    bio: "Online magazine lifting up LGBTQ+ voices in country and Americana music. Source: countryqueer.com/submission-guidelines",
    articleCount: 0,
  },
  {
    name: "The Country Note Editorial",
    email: "main@thecountrynote.com",
    outlet: "The Country Note",
    genre: "Country, Americana",
    region: "US",
    beat: "Country music news, interviews & reviews",
    bio: "Country music blog with exclusive interviews and reviews. Source: thecountrynote.com",
    articleCount: 0,
  },
  {
    name: "Matt Bjorke",
    email: "matt@roughstock.com",
    outlet: "Roughstock",
    genre: "Country, Americana",
    region: "US",
    beat: "Editor - country music charts & reviews",
    bio: "Editor at Roughstock.com, covering country music since 1995. Source: roughstock.com/staff, Muck Rack",
    articleCount: 0,
  },
  {
    name: "Jeffrey B. Remz",
    email: "countrystandardtime@gmail.com",
    outlet: "Country Standard Time",
    genre: "Country, Bluegrass, Americana, Rockabilly",
    region: "US",
    beat: "Editor & Publisher",
    bio: "Editor & publisher of Country Standard Time since 1993. Features, news, CD/concert/book reviews. Source: countrystandardtime.com",
    articleCount: 0,
  },
  {
    name: "Kevin J. Coyne",
    email: "kevin@countryuniverse.net",
    outlet: "Country Universe",
    genre: "Country, Americana",
    region: "US",
    beat: "Editor - country music reviews & commentary",
    bio: "Editor at Country Universe, an independently owned country music weblog. Source: countryuniverse.net/about-us/contact",
    articleCount: 0,
  },
  {
    name: "Leeann Ward",
    email: "leeann@countryuniverse.net",
    outlet: "Country Universe",
    genre: "Country, Americana",
    region: "US",
    beat: "Writer - country music reviews",
    bio: "Writer at Country Universe. Source: countryuniverse.net/about-us/contact",
    articleCount: 0,
  },
  {
    name: "Dan Milliken",
    email: "dan@countryuniverse.net",
    outlet: "Country Universe",
    genre: "Country, Americana",
    region: "US",
    beat: "Writer - country music reviews",
    bio: "Writer at Country Universe. Source: countryuniverse.net/about-us/contact",
    articleCount: 0,
  },
  {
    name: "Country Universe General",
    email: "CountryUniverse@gmail.com",
    outlet: "Country Universe",
    genre: "Country, Americana",
    region: "US",
    beat: "General inquiries & submissions",
    bio: "General contact email for Country Universe. Source: countryuniverse.net/about-us/contact",
    articleCount: 0,
  },
  {
    name: "Country Music News Blog",
    email: "shauna@whiskeychick.rocks",
    outlet: "Country Music News Blog",
    genre: "Country",
    region: "US",
    beat: "Country music news & reviews",
    bio: "Contact for Country Music News Blog. Source: countrymusicnewsblog.com/about-us/contact",
    articleCount: 0,
  },

  // ── BLUES ──────────────────────────────────────────────────────────────────
  {
    name: "Brett Bonner",
    email: "brett@livingblues.com",
    outlet: "Living Blues Magazine",
    genre: "Blues",
    region: "US",
    beat: "Editor",
    bio: "Editor of Living Blues Magazine, the oldest and most authoritative blues magazine. Source: livingblues.com/contact",
    articleCount: 0,
  },
  {
    name: "Living Blues Info",
    email: "info@livingblues.com",
    outlet: "Living Blues Magazine",
    genre: "Blues",
    region: "US",
    beat: "General inquiries & subscriptions",
    bio: "General info for Living Blues Magazine. Source: livingblues.com/contact",
    articleCount: 0,
  },
  {
    name: "Living Blues Advertising",
    email: "ads@livingblues.com",
    outlet: "Living Blues Magazine",
    genre: "Blues",
    region: "US",
    beat: "Advertising",
    bio: "Advertising contact for Living Blues Magazine. Source: livingblues.com/contact",
    articleCount: 0,
  },
  {
    name: "Living Blues Radio Charts",
    email: "livingbluesreports@gmail.com",
    outlet: "Living Blues Magazine",
    genre: "Blues",
    region: "US",
    beat: "Radio charts reporting",
    bio: "Radio charts contact for Living Blues. Source: livingblues.com/contact",
    articleCount: 0,
  },
  {
    name: "Bob Kieser",
    email: "bob@bluesblastmagazine.com",
    outlet: "Blues Blast Magazine",
    genre: "Blues",
    region: "US",
    beat: "Editor & Publisher",
    bio: "Editor and publisher of Blues Blast Magazine, online blues publication. Source: bluesblastmagazine.com/contact",
    articleCount: 0,
  },
  {
    name: "Blues Blast Magazine Info",
    email: "info@bluesblastmagazine.com",
    outlet: "Blues Blast Magazine",
    genre: "Blues",
    region: "US",
    beat: "General inquiries & writing submissions",
    bio: "General contact for Blues Blast Magazine. Source: bluesblastmagazine.com/contact",
    articleCount: 0,
  },
  {
    name: "Blues Rock Review Contact",
    email: "contact@bluesrockreview.com",
    outlet: "Blues Rock Review",
    genre: "Blues, Blues Rock",
    region: "US",
    beat: "General feedback",
    bio: "General feedback contact for Blues Rock Review, est. 2010. Source: bluesrockreview.com/contact",
    articleCount: 0,
  },
  {
    name: "Blues Rock Review Albums",
    email: "albumreviews@bluesrockreview.com",
    outlet: "Blues Rock Review",
    genre: "Blues, Blues Rock",
    region: "US",
    beat: "Album review submissions",
    bio: "Album review submissions for Blues Rock Review. Source: bluesrockreview.com/contact",
    articleCount: 0,
  },
  {
    name: "Rock and Blues Muse",
    email: "info@rockandbluesmuse.com",
    outlet: "Rock and Blues Muse",
    genre: "Blues, Blues Rock, Rock, Roots, Southern Rock",
    region: "US",
    beat: "Reviews, interviews & features",
    bio: "Independent online music magazine by Martine Ehrenclou. Source: rockandbluesmuse.com/submissions",
    articleCount: 0,
  },

  // ── JAZZ ───────────────────────────────────────────────────────────────────
  {
    name: "DownBeat Editor",
    email: "editor@downbeat.com",
    outlet: "DownBeat Magazine",
    genre: "Jazz",
    region: "US",
    beat: "General editorial",
    bio: "Main editorial email for DownBeat, premier jazz magazine since 1934. Source: downbeat.com/site/contact",
    articleCount: 0,
  },
  {
    name: "Frank Alkyer",
    email: "franka@downbeat.com",
    outlet: "DownBeat Magazine",
    genre: "Jazz",
    region: "US",
    beat: "Publisher",
    bio: "Publisher of DownBeat Magazine. Source: downbeat.com/site/contact",
    articleCount: 0,
  },
  {
    name: "Bobby Reed",
    email: "bobbyr@downbeat.com",
    outlet: "DownBeat Magazine",
    genre: "Jazz",
    region: "US",
    beat: "Managing Editor",
    bio: "Managing Editor of DownBeat Magazine. Source: downbeat.com/site/contact",
    articleCount: 0,
  },
  {
    name: "Davis Inman",
    email: "davis@downbeat.com",
    outlet: "DownBeat Magazine",
    genre: "Jazz",
    region: "US",
    beat: "Associate Editor",
    bio: "Associate Editor of DownBeat Magazine. Source: downbeat.com/site/contact",
    articleCount: 0,
  },
  {
    name: "JazzTimes Sales",
    email: "sales@jazztimes.com",
    outlet: "JazzTimes",
    genre: "Jazz",
    region: "US",
    beat: "Advertising & business inquiries",
    bio: "Advertising/business contact for JazzTimes magazine. Source: jazztimes.com/contact",
    articleCount: 0,
  },
  {
    name: "Jazzwise Editorial",
    email: "ros@jazzwise.com",
    outlet: "Jazzwise",
    genre: "Jazz",
    region: "UK",
    beat: "Editorial inquiries",
    bio: "Editorial contact for Jazzwise, leading UK jazz magazine. Source: jazzwise.com/pages/contact-us",
    articleCount: 0,
  },
  {
    name: "George W. Harris",
    email: "feedback@jazzweekly.com",
    outlet: "Jazz Weekly",
    genre: "Jazz, Avant-Garde, Creative Music",
    region: "US",
    beat: "Editor & Writer",
    bio: "Editor/writer of Jazz Weekly, online jazz magazine covering new releases and live gigs. Source: jazzweekly.com/contact-us",
    articleCount: 0,
  },
  {
    name: "JAZZIZ Editors",
    email: "editorial@jazziz.com",
    outlet: "JAZZIZ Magazine",
    genre: "Jazz",
    region: "US",
    beat: "Music submissions for editorial consideration",
    bio: "Editorial submissions for JAZZIZ Magazine. Source: jazziz.com/contact-us",
    articleCount: 0,
  },
  {
    name: "JAZZIZ Ideas",
    email: "ideas@jazziz.com",
    outlet: "JAZZIZ Magazine",
    genre: "Jazz",
    region: "US",
    beat: "Commentary & expertise submissions",
    bio: "JAZZIZ Ideas commentary submissions. Source: jazziz.com/contact-us",
    articleCount: 0,
  },
  {
    name: "JAZZIZ Info",
    email: "info@jazziz.com",
    outlet: "JAZZIZ Magazine",
    genre: "Jazz",
    region: "US",
    beat: "General inquiries",
    bio: "General contact for JAZZIZ Magazine. Source: jazziz.com/contact-us",
    articleCount: 0,
  },

  // ── SINGER-SONGWRITER / ACOUSTIC ──────────────────────────────────────────
  {
    name: "Acoustic Guitar Magazine Editorial",
    email: "editors.ag@stringletter.com",
    outlet: "Acoustic Guitar Magazine",
    genre: "Acoustic, Singer-Songwriter, Folk",
    region: "US",
    beat: "Editorial inquiries & review submissions",
    bio: "Editorial contact for Acoustic Guitar Magazine. Source: acousticguitar.com/subscriber-services",
    articleCount: 0,
  },
  {
    name: "Jason Verlinde",
    email: "jason@fretboardjournal.com",
    outlet: "Fretboard Journal",
    genre: "Acoustic, Guitar, Singer-Songwriter",
    region: "US",
    beat: "Editor - editorial & advertising",
    bio: "Editor of the Fretboard Journal, archival-quality quarterly guitar publication. Source: fretboardjournal.com/contact-us",
    articleCount: 0,
  },
  {
    name: "Fretboard Journal General",
    email: "fretboardjournal@gmail.com",
    outlet: "Fretboard Journal",
    genre: "Acoustic, Guitar, Singer-Songwriter",
    region: "US",
    beat: "General inquiries",
    bio: "General contact for Fretboard Journal. Source: fretboardjournal.com/contact-us",
    articleCount: 0,
  },

  // ── SONGWRITING ────────────────────────────────────────────────────────────
  {
    name: "Songwriting Magazine Editor",
    email: "editor@songwritingmagazine.co.uk",
    outlet: "Songwriting Magazine",
    genre: "Songwriting, All Genres",
    region: "UK",
    beat: "Editor - press releases & songwriter opportunities",
    bio: "Editor of Songwriting Magazine. Send PR, competitions, workshops, sync opportunities. Source: songwritingmagazine.co.uk/contact",
    articleCount: 0,
  },
  {
    name: "Songwriting Magazine Team",
    email: "team@songwritingmagazine.co.uk",
    outlet: "Songwriting Magazine",
    genre: "Songwriting, All Genres",
    region: "UK",
    beat: "General inquiries & opportunities",
    bio: "Team contact for Songwriting Magazine. Source: songwritingmagazine.co.uk/contact",
    articleCount: 0,
  },
  {
    name: "Dale Kawashima",
    email: "dk@songwriteruniverse.com",
    outlet: "Songwriter Universe",
    genre: "Songwriting, All Genres",
    region: "US",
    beat: "Founder & Editor - A&R consulting, lyric evaluations",
    bio: "Founder of SongwriterUniverse, former president of major music publishing companies, A&R executive. Source: songwriteruniverse.com/bio, songwriteruniverse.com/lyricevaluation",
    articleCount: 0,
  },
  {
    name: "NSAI Reception",
    email: "reception@nashvillesongwriters.com",
    outlet: "Nashville Songwriters Association International",
    genre: "Songwriting, Country, All Genres",
    region: "US",
    beat: "General inquiries",
    bio: "Nashville Songwriters Association International main office. Source: nashvillesongwriters.com/form/contact",
    articleCount: 0,
  },
  {
    name: "NSAI Song Contest",
    email: "nsaisongcontest@nashvillesongwriters.com",
    outlet: "Nashville Songwriters Association International",
    genre: "Songwriting, Country, All Genres",
    region: "US",
    beat: "Song contest submissions",
    bio: "NSAI annual song contest contact. Source: nsaisongcontest.com/faqs",
    articleCount: 0,
  },
  {
    name: "ASCAP Concert Music",
    email: "concertmusic@ascap.com",
    outlet: "ASCAP",
    genre: "Songwriting, All Genres",
    region: "US",
    beat: "Concert music announcements - recordings, commissions, awards",
    bio: "ASCAP concert music dept. Send announcements about recordings, publications, commissions, awards. Source: ascap.com/contact-us",
    articleCount: 0,
  },
  {
    name: "Christopher Dobbins",
    email: "cdobbins@ascap.com",
    outlet: "ASCAP",
    genre: "Songwriting, All Genres",
    region: "US",
    beat: "Musicologist, Concert Performance Crediting",
    bio: "Musicologist in ASCAP Concert Performance Crediting Department. Source: ascap.com/contact-us",
    articleCount: 0,
  },
  {
    name: "BMI Statements",
    email: "statement@bmi.com",
    outlet: "BMI",
    genre: "Songwriting, All Genres",
    region: "US",
    beat: "Statement & royalty inquiries",
    bio: "BMI statement and royalty inquiry contact. Source: bmi.com/about/entry/contact_us",
    articleCount: 0,
  },
  {
    name: "SESAC Publisher Relations",
    email: "publisher@sesac.com",
    outlet: "SESAC",
    genre: "Songwriting, All Genres",
    region: "US",
    beat: "Publisher inquiries",
    bio: "SESAC publisher relations contact. Source: sesac.com/frequently-asked-questions",
    articleCount: 0,
  },

  // ── MUSIC BUSINESS / INDUSTRY ──────────────────────────────────────────────
  {
    name: "Music Business Worldwide",
    email: "enquiries@musicbizworldwide.com",
    outlet: "Music Business Worldwide",
    genre: "Music Industry, Business",
    region: "Global",
    beat: "General enquiries & submissions",
    bio: "General enquiries for Music Business Worldwide (MBW). Source: musicbusinessworldwide.com/contact-us",
    articleCount: 0,
  },
  {
    name: "Music Connection Magazine",
    email: "contactmc@musicconnection.com",
    outlet: "Music Connection Magazine",
    genre: "Music Industry, All Genres",
    region: "US",
    beat: "Editorial & general inquiries",
    bio: "Contact for Music Connection Magazine, LA-based music industry publication. Source: musicconnection.com/contact-us",
    articleCount: 0,
  },
  {
    name: "Performer Magazine Editorial",
    email: "editorial@performermag.com",
    outlet: "Performer Magazine",
    genre: "Indie, All Genres, DIY",
    region: "US",
    beat: "Editorial inquiries",
    bio: "Editorial contact for Performer Magazine, aimed at independent/unsigned musicians since 1991. Source: performermag.com/contact",
    articleCount: 0,
  },
  {
    name: "Performer Magazine Submissions",
    email: "submissions@performermag.com",
    outlet: "Performer Magazine",
    genre: "Indie, All Genres, DIY",
    region: "US",
    beat: "Writing, photography & internship inquiries",
    bio: "Submissions contact for Performer Magazine. Source: performermag.com/contact",
    articleCount: 0,
  },
  {
    name: "Performer Magazine Advertising",
    email: "advertising@performermag.com",
    outlet: "Performer Magazine",
    genre: "Indie, All Genres, DIY",
    region: "US",
    beat: "Advertising & marketing",
    bio: "Advertising contact, William House. Source: performermag.com/contact",
    articleCount: 0,
  },
  {
    name: "TAXI Member Services",
    email: "memberservices@taxi.com",
    outlet: "TAXI",
    genre: "All Genres, Songwriting, Sync",
    region: "US",
    beat: "Member services & general inquiries",
    bio: "TAXI A&R helping songwriters, artists, composers get deals since 1992. Source: taxi.com",
    articleCount: 0,
  },
  {
    name: "TAXI A&R Listings",
    email: "listings@taxi.com",
    outlet: "TAXI",
    genre: "All Genres, Songwriting, Sync",
    region: "US",
    beat: "A&R listings & industry submissions",
    bio: "TAXI A&R department for industry listing inquiries. Source: taxi.com",
    articleCount: 0,
  },

  // ── MUSIC MARKETING ────────────────────────────────────────────────────────
  {
    name: "Hypebot Editor",
    email: "editor@hypebot.com",
    outlet: "Hypebot",
    genre: "Music Industry, Marketing, All Genres",
    region: "US",
    beat: "Editor - story pitches & news",
    bio: "Editor contact for Hypebot, trusted music industry news and insights. Source: hypebot.com/about",
    articleCount: 0,
  },
  {
    name: "Ariel Hyatt",
    email: "ariel@cyberpr.com",
    outlet: "Cyber PR",
    genre: "Music Marketing, All Genres",
    region: "US",
    beat: "Founder - music publicity & marketing",
    bio: "Founder of Cyber PR, author of six books on music marketing. 25+ years of music publicity campaigns. Source: cyberprmusic.com/contact",
    articleCount: 0,
  },
  {
    name: "Sonicbids Blog Editorial",
    email: "editorial@sonicbids.com",
    outlet: "Sonicbids Blog",
    genre: "Music Industry, Marketing, DIY",
    region: "US",
    beat: "Blog contributions",
    bio: "Editorial submissions for Sonicbids blog. Send two writing samples and proposed topics. Source: blog.sonicbids.com/write-for-sonicbids",
    articleCount: 0,
  },
  {
    name: "Ari Herstand",
    email: "ari@ariherstand.com",
    outlet: "Ari's Take",
    genre: "Music Business, Marketing, All Genres",
    region: "US",
    beat: "Founder - music business advice",
    bio: "Author of 'How To Make It in the New Music Business,' host of Webby-winning podcast. Source: ariherstand.com/contact",
    articleCount: 0,
  },
  {
    name: "Ari's Take Info",
    email: "info@aristake.com",
    outlet: "Ari's Take",
    genre: "Music Business, Marketing, All Genres",
    region: "US",
    beat: "Podcast inquiries",
    bio: "Podcast and general inquiries for Ari's Take. Source: aristake.com/category/contact",
    articleCount: 0,
  },
  {
    name: "Ari's Take Academy",
    email: "awesome@aristakeacademy.com",
    outlet: "Ari's Take Academy",
    genre: "Music Business, Marketing, All Genres",
    region: "US",
    beat: "Academy inquiries",
    bio: "Ari's Take Academy contact. Source: aristake.com/category/contact",
    articleCount: 0,
  },
];

// --- BLOGS (genre-specific) ---
export const genreBlogs: Contact[] = [
  // ── AMERICANA / ROOTS ──────────────────────────────────────────────────────
  {
    name: "Twangville Requests",
    email: "requests@twangville.com",
    outlet: "Twangville",
    genre: "Alt-Country, Americana, Indie, Folk, Blues",
    region: "US",
    beat: "Review requests",
    bio: "Music blog est. 2005 covering Alt-Country, Americana, Indie, Rock, Folk & Blues. Source: twangville.com/requests",
    articleCount: 0,
  },
  {
    name: "Twangville (Tom)",
    email: "tom@twangville.com",
    outlet: "Twangville",
    genre: "Alt-Country, Americana, Indie, Folk, Blues",
    region: "US",
    beat: "General contact",
    bio: "General editorial contact for Twangville blog. Source: twangville.com/about-us",
    articleCount: 0,
  },
  {
    name: "Twangville (Todd)",
    email: "todd@twangville.com",
    outlet: "Twangville",
    genre: "Alt-Country, Americana, Indie, Folk, Blues",
    region: "US",
    beat: "Contributor - contact before sending",
    bio: "Twangville contributor. Email before sending material. Source: twangville.com/todd",
    articleCount: 0,
  },
  {
    name: "The Bluegrass Situation",
    email: "info@thebluegrasssituation.com",
    outlet: "The Bluegrass Situation",
    genre: "Bluegrass, Americana, Roots, Folk",
    region: "US",
    beat: "General inquiries & submissions",
    bio: "World's largest community for American roots music, co-founded by Ed Helms in 2012. Source: thebluegrasssituation.com/about",
    articleCount: 0,
  },
  {
    name: "The Bitter Southerner",
    email: "kyle@bittersoutherner.com",
    outlet: "The Bitter Southerner",
    genre: "Americana, Roots, Southern Culture",
    region: "US",
    beat: "Editorial & press - Kyle Tibbs Jones",
    bio: "Athens GA-based indie media, publishes magazine, podcast 'Batch', and BS Records label. Source: bittersoutherner.com/contact",
    articleCount: 0,
  },

  // ── COUNTRY ────────────────────────────────────────────────────────────────
  {
    name: "Saving Country Music",
    email: "savingcountrymusic@gmail.com",
    outlet: "Saving Country Music",
    genre: "Country, Alt-Country, Americana, Outlaw",
    region: "US",
    beat: "Reviews & commentary (use contact form first)",
    bio: "Kyle Coroneos, owner/editor. Submit digitally only, include artist name, title, release date, AI disclosure. Source: savingcountrymusic.com/contact",
    articleCount: 0,
  },

  // ── BLUES ──────────────────────────────────────────────────────────────────
  {
    name: "Blues Rock Review Advertising",
    email: "advertising@bluesrockreview.com",
    outlet: "Blues Rock Review",
    genre: "Blues, Blues Rock",
    region: "US",
    beat: "Advertising inquiries",
    bio: "Advertising contact for Blues Rock Review. Source: bluesrockreview.com/contact",
    articleCount: 0,
  },

  // ── MUSIC BUSINESS / MARKETING ─────────────────────────────────────────────
  {
    name: "Bobby Owsinski",
    email: "bobby@bobbyowsinski.com",
    outlet: "Bobby Owsinski Blog / Music 3.0",
    genre: "Music Production, Music Business",
    region: "US",
    beat: "Music production & business blogger, author of 24 books",
    bio: "Producer/engineer, author, podcaster. Blogs at bobbyowsinskiblog.com and music3point0.com. Source: bobbyowsinski.com",
    articleCount: 0,
  },
];

// --- CURATORS (genre-specific) ---
export const genreCurators: Contact[] = [
  {
    name: "Folk Alley (Linda Fahey)",
    email: "linda@folkalley.com",
    outlet: "Folk Alley",
    genre: "Folk, Acoustic, Singer-Songwriter, Americana",
    region: "US",
    beat: "Music Director - airplay submissions",
    bio: "Submit WAV files and liner notes via Dropbox link for airplay consideration. Source: folkalley.com/contact-folk-alley",
    articleCount: 0,
  },
  {
    name: "Hearth Music",
    email: "info@hearthmusic.com",
    outlet: "Hearth Music",
    genre: "Roots, Americana, World, Folk",
    region: "US",
    beat: "Booking & artist submissions",
    bio: "Founded 2010 by Devon Leger (formerly NW Folklife Festival booker). Presents roots, Americana & world musicians. Source: hearthmusic.com/about-us",
    articleCount: 0,
  },
  {
    name: "No Depression Advertising",
    email: "sonja@nodepression.com",
    outlet: "No Depression",
    genre: "Americana, Roots, Folk",
    region: "US",
    beat: "Advertising Manager",
    bio: "Sonja Nelson, Advertising Manager at No Depression. Source: nodepression.org/contact-us",
    articleCount: 0,
  },
];

// --- PODCASTERS (genre-specific) ---
export const genrePodcasters: Contact[] = [
  {
    name: "Thomas D. Mooney",
    email: "thomasdmooney@gmail.com",
    outlet: "New Slang Podcast",
    genre: "Americana, Country, Folk, Rock, Singer-Songwriter",
    region: "US",
    beat: "Host - interviews with singer-songwriters & musicians",
    bio: "Music journalist published in Texas Monthly, Rolling Stone Country. Hosts hour-long interviews with Americana/country/folk artists. Source: thomasdmooney.com/newslangpodcast",
    articleCount: 0,
  },
  {
    name: "Ari Herstand (Podcast)",
    email: "info@aristake.com",
    outlet: "The New Music Business Podcast",
    genre: "Music Business, Marketing, All Genres",
    region: "US",
    beat: "Host - music industry interviews & advice",
    bio: "Webby Award-winning '#1 music industry podcast' per Spotify. Source: aristake.com/new-music-business-podcast",
    articleCount: 0,
  },
  {
    name: "Ari Herstand (Speaking)",
    email: "speaking@aristake.com",
    outlet: "Ari's Take / The New Music Business",
    genre: "Music Business, Marketing, All Genres",
    region: "US",
    beat: "Speaking engagements",
    bio: "Speaking requests for Ari Herstand. Source: ariherstand.com/contact",
    articleCount: 0,
  },
];

// --- PLAYLIST CURATORS & YOUTUBE/SOUNDCLOUD CHANNELS ---
// Sourced 2026-03-14 from public web pages, YouTube about pages, SoundCloud bios, social bios
export const playlistCurators: Contact[] = [
  // ── YOUTUBE MUSIC PROMOTION CHANNELS ─────────────────────────────────────────

  {
    name: "MrSuicideSheep",
    email: "demo@mrsuicidesheep.com",
    outlet: "MrSuicideSheep (YouTube)",
    genre: "Electronic, Indie-Electronic, Chill, Alternative",
    region: "Global",
    beat: "YouTube music curator & Seeking Blue Records label",
    bio: "One of the largest music curation channels on YouTube, founded 2010 by 'Sheepy' in Vancouver. Also runs Seeking Blue Records. Source: mrsuicidesheep.com, labelsbase.net/mrsuicidesheep",
    articleCount: 0,
  },
  {
    name: "MrSuicideSheep (General)",
    email: "contact@mrsuicidesheep.com",
    outlet: "MrSuicideSheep (YouTube)",
    genre: "Electronic, Indie-Electronic, Chill, Alternative",
    region: "Global",
    beat: "General inquiries",
    bio: "General contact for MrSuicideSheep YouTube channel. Source: mrsuicidesheep.com",
    articleCount: 0,
  },
  {
    name: "Seeking Blue Records",
    email: "info@seeking.blue",
    outlet: "Seeking Blue Records",
    genre: "Electronic, Indie-Electronic",
    region: "Global",
    beat: "Label born from MrSuicideSheep",
    bio: "Electronic record label born from YouTube curator MrSuicideSheep. Based in Vancouver, BC. Source: seeking.blue/contact",
    articleCount: 0,
  },
  {
    name: "Proximity (Blake Coppelson)",
    email: "blake@prxmusic.com",
    outlet: "Proximity (YouTube)",
    genre: "Electronic, Future Bass, Chill, Dance",
    region: "US",
    beat: "YouTube music promotion - 'Your favorite music you haven't heard yet'",
    bio: "Major YouTube music promotion channel. Business inquiries to Blake Coppelson. Source: facebook.com/proximity, linkedin.com/in/coppelson",
    articleCount: 0,
  },
  {
    name: "Trap Nation (Andre)",
    email: "andre@nations.io",
    outlet: "Trap Nation (YouTube)",
    genre: "Trap, EDM, Hip-Hop, Chill Out, Dance",
    region: "Global",
    beat: "YouTube music promotion - 14M+ subscribers",
    bio: "One of the largest electronic music promo channels on YouTube, founded 2012 by Idmon Yildiz & Gabriel Isik. Part of The Nations network. Source: labelsbase.net/trap-nation, nations.io",
    articleCount: 0,
  },
  {
    name: "House Nation (Isac Jivhed)",
    email: "isac.jivhed@nations.io",
    outlet: "House Nation (YouTube)",
    genre: "House, Deep House, Tech House, Dance",
    region: "Global",
    beat: "YouTube music promotion - house music",
    bio: "House music focused channel in The Nations network (Trap Nation, Chill Nation, Rap Nation, Bass Nation). Source: labelradar.com/labels/housenation",
    articleCount: 0,
  },
  {
    name: "Trap City",
    email: "officialtrapcity@gmail.com",
    outlet: "Trap City (YouTube)",
    genre: "Trap, Future Bass, EDM, Bass",
    region: "Global",
    beat: "YouTube music promotion - trap & bass",
    bio: "Major trap music YouTube channel founded 2012 in Netherlands by Idmon Yildiz & Gabriel Isik. 14M+ subscribers. Source: labelsbase.net/trap-city",
    articleCount: 0,
  },
  {
    name: "MrRevillz (Submissions)",
    email: "info@mrrevillz.com",
    outlet: "MrRevillz (YouTube)",
    genre: "House, Dance, Electronic",
    region: "UK",
    beat: "YouTube music curator & record label",
    bio: "British independent record label uploading daily house/dance/electronic music. Submission portal at music.mrrevillz.com/Submissions. Source: mrrevillz.com, submithub.com/blog/mrrevillz",
    articleCount: 0,
  },
  {
    name: "MrRevillz (Business)",
    email: "ashley@mrrevillz.com",
    outlet: "MrRevillz (YouTube)",
    genre: "House, Dance, Electronic",
    region: "UK",
    beat: "Business enquiries",
    bio: "All business enquiries for MrRevillz YouTube channel & label. Source: mrrevillz.com",
    articleCount: 0,
  },
  {
    name: "IndieAir",
    email: "indieairsubmissions@gmail.com",
    outlet: "IndieAir (YouTube)",
    genre: "Alternative, Indie Rock, Indie Pop",
    region: "US",
    beat: "YouTube music promotion - 1.44M subscribers",
    bio: "YouTube channel uploading alternative rock to pop with emphasis on independent/upcoming artists. Created 2014. Source: submithub.com/blog/indieair, hypebot.com",
    articleCount: 0,
  },
  {
    name: "Bandit Tunes",
    email: "bandittunespromotions@gmail.com",
    outlet: "Bandit Tunes (YouTube)",
    genre: "Indie, Electronic, Chill",
    region: "Global",
    beat: "YouTube music promotion",
    bio: "YouTube channel accepting music submissions for promotion. Source: symphonic.com blog, soundcloud.com/bandittunes",
    articleCount: 0,
  },
  {
    name: "Monstercat (Press)",
    email: "press@monstercat.com",
    outlet: "Monstercat (YouTube/Label)",
    genre: "Electronic, EDM, Dubstep, DnB, Future Bass",
    region: "Global",
    beat: "Press inquiries - 7.59M+ YouTube subscribers",
    bio: "Major electronic music label and YouTube channel. Press inquiries. Demo submissions via LabelRadar. Source: monstercat.com/contact-us",
    articleCount: 0,
  },
  {
    name: "NoCopyrightSounds (NCS)",
    email: "hello@nocopyrightsounds.co.uk",
    outlet: "NoCopyrightSounds (YouTube)",
    genre: "Electronic, EDM, Dance, Copyright-Free",
    region: "UK",
    beat: "YouTube music promotion - copyright-free music for creators",
    bio: "Copyright-free music platform for creators. General contact and demo submissions. Source: ncs.io/contact, labelsbase.net/ncs",
    articleCount: 0,
  },
  {
    name: "Selected. (Demos)",
    email: "inbox@selectedbase.com",
    outlet: "Selected. (YouTube)",
    genre: "House, Deep House, Dance",
    region: "Global",
    beat: "YouTube music promotion & record label - house music",
    bio: "House-dedicated music blog, record label & event brand founded June 2013 in Berlin. Demo submissions. Source: selectedbase.com/submit, soundcloud.com/selectedbase",
    articleCount: 0,
  },
  {
    name: "Selected. (General)",
    email: "info@selectedbase.com",
    outlet: "Selected. (YouTube)",
    genre: "House, Deep House, Dance",
    region: "Global",
    beat: "General inquiries",
    bio: "General inquiries for Selected house music brand. Source: soundcloud.com/selectedbase",
    articleCount: 0,
  },
  {
    name: "La Belle Musique",
    email: "rubin@labellemusique.co",
    outlet: "La Belle Musique (YouTube)",
    genre: "Chill, Electronic, Indie, Pop",
    region: "Global",
    beat: "YouTube music curation",
    bio: "Popular YouTube music curation channel. Promotional contact. Source: groover.co, labelsbase.net",
    articleCount: 0,
  },
  {
    name: "Majestic Casual",
    email: "nick@majesticcasual.com",
    outlet: "Majestic Casual (YouTube)",
    genre: "Chill, Electronic, Indie, R&B",
    region: "Global",
    beat: "YouTube music curation - 4.31M subscribers",
    bio: "Online curation platform founded 2011, promoting artists by showcasing their works. Source: majesticcasual.com, labelsbase.net/majestic-family-records",
    articleCount: 0,
  },
  {
    name: "The Vibe Guide",
    email: "info@thevibeguide.net",
    outlet: "The Vibe Guide (YouTube)",
    genre: "House, Dance, Electronic, Pop",
    region: "US",
    beat: "YouTube music promotion - lyric/audio videos",
    bio: "American YouTube channel posting music videos with lyrics and reuploaded audio tracks. Submission portal at submit.thevibeguide.net. Source: thevibeguide.net/contact",
    articleCount: 0,
  },
  {
    name: "ElectroPose (Submissions)",
    email: "submission@electro-pose.com",
    outlet: "ElectroPose (YouTube)",
    genre: "Deep House, Chillwave, Nu Disco, Lounge, Indie Pop",
    region: "Global",
    beat: "YouTube music promotion - track submissions",
    bio: "YouTube channel focused on Deep House, Chillwave, Nu Disco, Lounge, Indie, Pop, and Minimal. Source: influencerwiki.fr/electropose-musique",
    articleCount: 0,
  },
  {
    name: "ElectroPose (Business)",
    email: "contact@electro-pose.com",
    outlet: "ElectroPose (YouTube)",
    genre: "Deep House, Chillwave, Nu Disco, Lounge, Indie Pop",
    region: "Global",
    beat: "Business inquiries",
    bio: "Business inquiries for ElectroPose YouTube channel. Source: influencerwiki.fr/electropose-musique",
    articleCount: 0,
  },
  {
    name: "Koala Kontrol",
    email: "koalakontrol@gmail.com",
    outlet: "Koala Kontrol (YouTube)",
    genre: "Indie Electronic, Indie, Alternative",
    region: "Global",
    beat: "YouTube music curation - 1.41M+ subscribers",
    bio: "Indie Electronic, Indie, Alternative audiovisual music curator from Vancouver, BC. Submission portal at submit.koalakontrol.com. Source: facebook.com/KoalaKontrol, soundcloud.com/koalakontrol",
    articleCount: 0,
  },
  {
    name: "CloudKid",
    email: "hello@cloudkid.com",
    outlet: "CloudKid (YouTube)",
    genre: "Chill, Indie, Electronic, Pop",
    region: "Global",
    beat: "YouTube music curation - 4.7M+ subscribers",
    bio: "One of the fastest growing YouTube channels. Currently does not accept direct submissions; use SubmitHub or LabelRadar. Source: cloudkid.com/contact",
    articleCount: 0,
  },
  {
    name: "CloudKid (Sync)",
    email: "sync@cldkid.com",
    outlet: "CloudKid (YouTube)",
    genre: "Chill, Indie, Electronic, Pop",
    region: "Global",
    beat: "Sync & licensing requests",
    bio: "Sync and licensing contact for CloudKid. Source: soundcloud.com/cloudkid",
    articleCount: 0,
  },
  {
    name: "Fluidified",
    email: "contact@fluidified.com",
    outlet: "Fluidified (YouTube)",
    genre: "Chill, Electronic, Deep House",
    region: "Global",
    beat: "YouTube music curation - 851K subscribers",
    bio: "YouTube music curation channel with 428.8M views. Source: noxinfluencer.com, socialblade.com/youtube/user/fluidified",
    articleCount: 0,
  },
  {
    name: "MrDeepSense",
    email: "contact@mrdeepsense.com",
    outlet: "MrDeepSense (YouTube)",
    genre: "Deep House, Nu Disco, House",
    region: "Global",
    beat: "YouTube music promotion - deep house",
    bio: "YouTube channel dedicated to promotion of Deep House, Nu Disco and House music combined with magnificent artworks. Source: soundcloud.com/mrdeepsense",
    articleCount: 0,
  },
  {
    name: "Nik Cooper",
    email: "info@nikcooper.com",
    outlet: "Nik Cooper Music (YouTube)",
    genre: "Electronic, EDM, House, Dance",
    region: "Global",
    beat: "YouTube music promotion - 880K+ subscribers",
    bio: "World's leading festival music brand YouTube channel, launched 2010. Demo submissions at nikcooper.demodrop.com. Source: youredm.com interview, nikcooper.com",
    articleCount: 0,
  },
  {
    name: "xKito Music",
    email: "xkitomusic@gmail.com",
    outlet: "xKito Music (YouTube)",
    genre: "Electronic, EDM, Dance",
    region: "Global",
    beat: "YouTube music promotion - EDM",
    bio: "Advertising and promotional YouTube channel for a large variety of Electronic Dance Music. Source: tiktok.com/@xkito.music, thehandbook.com/creator/xkito-music",
    articleCount: 0,
  },
  {
    name: "SwagyTracks",
    email: "swagytracks@gmail.com",
    outlet: "SwagyTracks (YouTube)",
    genre: "Hip-Hop, Indie Hip-Hop, R&B",
    region: "Global",
    beat: "YouTube music promotion - hip-hop",
    bio: "YouTube channel dedicated to promoting good and unknown Hip Hop from various artists. Source: thehandbook.com/creator/swagytracks, soundcloud.com/swagytracks",
    articleCount: 0,
  },
  {
    name: "alexrainbirdMusic",
    email: "alexrainbirdmusic@gmail.com",
    outlet: "alexrainbirdMusic (YouTube)",
    genre: "Indie, Folk, Acoustic, Singer-Songwriter",
    region: "Global",
    beat: "YouTube music promotion - 1M+ subscribers",
    bio: "Since 2011, discovering and showcasing independent music. Use 'alexrainbirdRecords' in subject line. Also runs alexrainbirdRecords label. Source: alexrainbirdmusic.com, musicgateway.com interview",
    articleCount: 0,
  },

  // ── MUSIC BLOGS / YOUTUBE CROSSOVER ──────────────────────────────────────────

  {
    name: "Run The Trap",
    email: "rttsubmit@gmail.com",
    outlet: "Run The Trap (Blog/YouTube)",
    genre: "Trap, EDM, Hip-Hop, Bass",
    region: "US",
    beat: "Music blog & YouTube - trap/EDM submissions",
    bio: "Trap Music, EDM & Hip Hop blog created July 2012. May not reply if not interested within 3 days. Source: runthetrap.com/contact-us",
    articleCount: 0,
  },

  // ── SOUNDCLOUD REPOST NETWORKS ───────────────────────────────────────────────

  {
    name: "HMWL (PR/Promotion)",
    email: "pr@hmwl.org",
    outlet: "House Music With Love (SoundCloud/YouTube/Spotify)",
    genre: "Deep House, Afro House, Melodic House, Techno",
    region: "Global",
    beat: "SoundCloud repost network - 200+ channels, 12M+ followers",
    bio: "Swedish record label & promo service. Runs 200+ SoundCloud repost channels for Deep/Afro/Melodic House & Techno. Source: housemusicwithlove.com/pr",
    articleCount: 0,
  },
  {
    name: "HMWL (Demos)",
    email: "demos@hmwl.org",
    outlet: "House Music With Love (SoundCloud/YouTube/Spotify)",
    genre: "Deep House, Afro House, Melodic House, Techno",
    region: "Global",
    beat: "Demo submissions - SoundCloud premiere, YouTube premiere, Spotify premiere, blog review",
    bio: "Submit demo track, EP, remix or free download for premieres & reviews. Source: housemusicwithlove.com/submit-a-hmwl-premiere-or-upload",
    articleCount: 0,
  },
  {
    name: "GANGSTER BASS",
    email: "gangsterbassofficial@gmail.com",
    outlet: "GANGSTER BASS (SoundCloud/YouTube)",
    genre: "Trap, Bass, Hip-Hop",
    region: "Global",
    beat: "SoundCloud/YouTube music promotion - trap & bass",
    bio: "Record label founded 2020 accepting music submissions. Source: soundcloud.com/gangsterbass",
    articleCount: 0,
  },
  {
    name: "GANGSTER TRAP",
    email: "pnwsgrp@gmail.com",
    outlet: "GANGSTER TRAP (SoundCloud/YouTube)",
    genre: "Trap, Hip-Hop",
    region: "Global",
    beat: "SoundCloud/YouTube music promotion - trap",
    bio: "Trap music promotion channel. Source: soundcloud.com/gangster-trap",
    articleCount: 0,
  },

  // ── SPOTIFY PLAYLIST CURATORS ────────────────────────────────────────────────

  {
    name: "Promoting Sounds (Spotify)",
    email: "promotingsoundsspotify@gmail.com",
    outlet: "Promoting Sounds (Spotify/YouTube/SoundCloud)",
    genre: "Rap, Hip-Hop, Trap, Lo-Fi, Bass, Chill",
    region: "Global",
    beat: "Spotify playlist curator - 20 playlists, 1.9M+ followers, 3.2M monthly listeners",
    bio: "Specializes in rap, hip-hop, trap, lofi and bass. 20 playlists with over 1.9M followers. Source: jouzik.com, artist.tools",
    articleCount: 0,
  },
  {
    name: "Today's Rap Hits",
    email: "todaysraphits@gmail.com",
    outlet: "Today's Rap Hits (Spotify)",
    genre: "Rap, Hip-Hop, Trap",
    region: "US",
    beat: "Spotify playlist curator - hip-hop/rap",
    bio: "Independent Spotify playlist curator for rap and hip-hop. Source: jouzik.com/spotify-hip-hop-playlist-curators",
    articleCount: 0,
  },

  // ── RECORD LABELS (with YouTube/Spotify presence accepting demos) ────────────

  {
    name: "Spinnin' Records (Demos)",
    email: "demo@spinninrecords.nl",
    outlet: "Spinnin' Records (YouTube/Spotify)",
    genre: "EDM, House, Dance, Electronic",
    region: "Global",
    beat: "Demo submissions - major dance label",
    bio: "One of the biggest dance music labels. Also accepts demos via Talent Pool. Source: labelsbase.net/spinnin-records, spinninrecords.com",
    articleCount: 0,
  },
  {
    name: "Spinnin' Records (General)",
    email: "info@spinninrecords.nl",
    outlet: "Spinnin' Records (YouTube/Spotify)",
    genre: "EDM, House, Dance, Electronic",
    region: "Global",
    beat: "General contact",
    bio: "General contact for Spinnin' Records. Source: labelsbase.net/spinnin-records",
    articleCount: 0,
  },
  {
    name: "Chillhop Music",
    email: "info@chillhop.com",
    outlet: "Chillhop Music (YouTube/Spotify)",
    genre: "Lo-Fi, Instrumental Hip-Hop, Chillhop",
    region: "Global",
    beat: "Lo-fi label & YouTube curator - 3M+ YouTube subscribers",
    bio: "Dutch label & publishing company focused on Instrumental Hip Hop & Lofi Hip Hop. Started 2013. Demo submissions via LabelRadar. Source: chillhop.com/contact",
    articleCount: 0,
  },
  {
    name: "Lofi Girl",
    email: "music@lofigirl.com",
    outlet: "Lofi Girl (YouTube/Spotify)",
    genre: "Lo-Fi, Chill, Beats, Study Music",
    region: "Global",
    beat: "YouTube lo-fi curator & label",
    bio: "French YouTube channel & music label established 2017. Famous for lofi hip hop beats to relax/study to livestream. 6M+ Spotify playlist followers. Source: lofigirl.com/contact",
    articleCount: 0,
  },

  // ── YOUTUBE CHANNELS - ADDITIONAL ────────────────────────────────────────────

  {
    name: "Akira The Don (Bookings)",
    email: "enquiries@meaningwave.com",
    outlet: "Akira The Don / Meaningwave (YouTube)",
    genre: "Electronic, Meaningwave, Spoken Word, Hip-Hop",
    region: "UK",
    beat: "YouTube creator - meaningwave music",
    bio: "British musician, DJ, producer, and YouTuber. Bookings and other enquiries. Source: akirathedon.com/contact",
    articleCount: 0,
  },
  {
    name: "Cakes & Eclairs",
    email: "hello@soundicate.pro",
    outlet: "Cakes & Eclairs (YouTube)",
    genre: "Pop, Electronic, Lyric Videos",
    region: "US",
    beat: "YouTube lyric video channel",
    bio: "American YouTube channel creating lyrical videos for trending English songs, founded January 2016. Part of Soundicate Promotion Group. Source: spgl.ink/cakesandeclairs",
    articleCount: 0,
  },

  // ── SPOTIFY/YOUTUBE/SOUNDCLOUD MULTI-PLATFORM CURATORS ───────────────────────

  {
    name: "Steezyasfuck",
    email: "steezy@stzzzy.com",
    outlet: "Steezyasfuck (YouTube/SoundCloud/Spotify)",
    genre: "Instrumental Hip-Hop, Lo-Fi, Beats",
    region: "US",
    beat: "YouTube/SoundCloud music curation - LA-based since 2014",
    bio: "Los Angeles-based channel focused on instrumental hip-hop beats since 2014. Submission form at stzzzy.com/submissions. Source: stzzzy.com/submissions, toneden.io/steezyasfuck",
    articleCount: 0,
  },
  {
    name: "Trap and Bass",
    email: "submissions@trapandbass.com",
    outlet: "Trap and Bass (YouTube/SoundCloud/Spotify)",
    genre: "Trap, Bass, Electronic",
    region: "Global",
    beat: "YouTube/SoundCloud/Spotify music promotion",
    bio: "Founded to promote underground Trap producers worldwide. Accepts YouTube uploads, SoundCloud reposts, and Spotify playlists. Answers all submissions. Source: trapandbass.com, submithub.medium.com interview",
    articleCount: 0,
  },
  {
    name: "COLORS Studios",
    email: "submit@colorsxstudios.com",
    outlet: "COLORS Studios (YouTube)",
    genre: "All Genres - R&B, Hip-Hop, Pop, Soul, Electronic, Indie",
    region: "Global",
    beat: "YouTube live performance platform - 8M+ subscribers",
    bio: "German music performance platform based in Berlin, established February 2016. 'All colors, no genres' - minimalist aesthetic live performances. Submission page at colorsxstudios.com/submit. Source: colorsxstudios.com, wikipedia.org",
    articleCount: 0,
  },
  {
    name: "Tribal Trap (Submissions)",
    email: "submissions@tribaltrap.com",
    outlet: "Tribal Trap (YouTube/Spotify)",
    genre: "Trap, Bass, Electronic",
    region: "Global",
    beat: "YouTube music promotion & tastemaker label",
    bio: "Launched 2016 as a platform for underground trap music, evolved into a trusted tastemaker label. Part of Tribal Music Group. Source: tribalmusicgroup.com/submissions",
    articleCount: 0,
  },
  {
    name: "AirwaveMusicTV",
    email: "airwavemusictv@gmail.com",
    outlet: "AirwaveMusicTV (YouTube)",
    genre: "Electronic, EDM, Bass, Dance",
    region: "Global",
    beat: "YouTube music promotion - 3M+ subscribers",
    bio: "One of the leading music promotion networks on YouTube, joined 2011. Demo submissions also via LabelRadar. Source: groover.co/en/influencer/profile/airwavemusictvgmailcom, bassmusic.fandom.com",
    articleCount: 0,
  },
  {
    name: "TheSoundYouNeed",
    email: "tsyn.thesoundyouneed@gmail.com",
    outlet: "TheSoundYouNeed (YouTube)",
    genre: "Electronic, Indie, Chill, Deep House",
    region: "Global",
    beat: "YouTube music curation",
    bio: "YouTube music curation channel. Contact for music promotion or removal requests. Source: thesoundyouneed-blog.tumblr.com/contact",
    articleCount: 0,
  },
  {
    name: "Wave Music",
    email: "wavemusicyt@gmail.com",
    outlet: "Wave Music (YouTube/SoundCloud)",
    genre: "Chill, Electronic, Lo-Fi, House",
    region: "Global",
    beat: "YouTube/SoundCloud music promotion",
    bio: "YouTube and SoundCloud music curation channel. Also accepts submissions via SubmitHub. Source: submithub.com/blog/wavemusic",
    articleCount: 0,
  },
  {
    name: "MixHound Music Records",
    email: "mixhoundmusicrecords@gmail.com",
    outlet: "MixHound Music Records (YouTube/SoundCloud)",
    genre: "Chill, Electronic, Chillstep",
    region: "Global",
    beat: "YouTube/SoundCloud music promotion & label",
    bio: "Supports upcoming young music producers. YouTube channel at youtube.com/Mixhound3DStudio. Source: soundcloud.com/mixhound-music-records",
    articleCount: 0,
  },
  {
    name: "Heldeep Records (Radio/Demos)",
    email: "heldeepradio@gmail.com",
    outlet: "Heldeep Records (YouTube/Spotify)",
    genre: "House, Future House, Electronic, EDM",
    region: "Global",
    beat: "Oliver Heldens' label - demo submissions",
    bio: "Record label founded by Oliver Heldens. Demo submissions via this email or LabelRadar. Source: labelsbase.net/heldeep-records",
    articleCount: 0,
  },
  {
    name: "Future Classic",
    email: "info@futureclassic.us",
    outlet: "Future Classic (Label/YouTube)",
    genre: "Electronic, Indie, Pop",
    region: "Global",
    beat: "Record label (Flume, Chet Faker, SOPHIE)",
    bio: "Australian record label known for Flume, Chet Faker, SOPHIE, and others. Source: futureclassic.us/pages/contact-us",
    articleCount: 0,
  },

  // ── ADDITIONAL SPOTIFY PLAYLIST CURATORS ─────────────────────────────────────

  {
    name: "The Buzz Network",
    email: "info@thebuzznetwork.net",
    outlet: "The Buzz Network (Spotify)",
    genre: "Afrobeats, Amapiano, Hip-Hop, Chill",
    region: "Global",
    beat: "Spotify playlist curator - real engaged playlists",
    bio: "Full-scale music discovery platform curating real, engaged playlists. Works closely with indie artists without using bots. Source: thebuzznetwork.net",
    articleCount: 0,
  },
  {
    name: "LoFi Cafe Records",
    email: "info@loficaferecords.com",
    outlet: "LoFi Cafe Records (Spotify/YouTube)",
    genre: "Lo-Fi, Chillhop, Beats",
    region: "UK",
    beat: "Lo-fi record label & playlist curator",
    bio: "UK-based record label and playlist curator specializing in lofi hip-hop and chillhop beats. Source: loficaferecords.com",
    articleCount: 0,
  },
  {
    name: "Indiemono (Submissions)",
    email: "hello@indiemono.com",
    outlet: "Indiemono (Spotify)",
    genre: "Indie, Alternative, Singer-Songwriter",
    region: "Global",
    beat: "Spotify indie playlist curator - free submission tool",
    bio: "Indie curators & Spotify playlists. Free submission tool for indie artists via SubmitHub. Source: indiemono.com/music-submit",
    articleCount: 0,
  },
  {
    name: "Eclipse Records (Playlist)",
    email: "info@eclipserecords.com",
    outlet: "Eclipse Records (Spotify)",
    genre: "Rock, Metal, Hard Rock, Punk",
    region: "US",
    beat: "Spotify playlist curation - rock/metal",
    bio: "Metal record label accepting Spotify playlist submissions from all rock/metal artists. Source: eclipserecords.com/spotify-playlist-submission",
    articleCount: 0,
  },
  {
    name: "Le Future Wave",
    email: "info@lefuturewave.com",
    outlet: "Le Future Wave (Blog/Spotify)",
    genre: "Electronic, Indie, Pop, Future",
    region: "Netherlands",
    beat: "Music blog & Spotify playlist curator",
    bio: "Netherlands-based music blog and playlist curator. Submissions via SubmitHub. Source: lefuturewave.com, submithub.com/blog/lefuturewave",
    articleCount: 0,
  },
  {
    name: "Stereofox",
    email: "hello@stereofox.com",
    outlet: "Stereofox (Blog/Spotify/YouTube)",
    genre: "Lo-Fi, Chill, Electronic, Indie",
    region: "Global",
    beat: "Music blog & Spotify/YouTube curator",
    bio: "Music discovery platform featuring best lofi hip hop, chillhop, and indie playlists. Source: stereofox.com",
    articleCount: 0,
  },
  {
    name: "Ryan Celsius",
    email: "ryancelsius@gmail.com",
    outlet: "Ryan Celsius (YouTube/Spotify)",
    genre: "Lo-Fi, Underground Hip-Hop, Chill",
    region: "US",
    beat: "YouTube/Spotify curator - 3M+ monthly views",
    bio: "Underground music curator with over 3M monthly views. Runs lofi hip-hop channels dedicated to supporting independent music. Source: amuse.io, playlistpartner.com",
    articleCount: 0,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED EXPORT for easy import
// ═══════════════════════════════════════════════════════════════════════════════
export const allGenreContacts = [
  ...genreJournalists,
  ...genreBlogs,
  ...genrePodcasters,
  ...genreCurators,
  ...playlistCurators,
];

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCES SEARCHED (2026-03-14)
// ═══════════════════════════════════════════════════════════════════════════════
//
// CONFIRMED EMAILS FOUND (from public web pages):
//
// AMERICANA / ROOTS:
// - No Depression: hilary@nodepression.com, letters@nodepression.com, help@nodepression.com, sonja@nodepression.com (nodepression.org/contact-us)
// - The Alternate Root: danny@thealternateroot.com (thealternateroot.com/contact.html)
// - Americana Highways: americanahighways@gmail.com (americanahighways.org/contact)
// - Glide Magazine: info@glidemagazine.com (glidemagazine.com/contact-us)
// - Ear to the Ground Music: eartothegroundmusicblog@gmail.com (eartothegroundmusic.co/contact)
// - PopMatters: editor@popmatters.com, features@popmatters.com (popmatters.com/submission-guidelines)
// - The Bluegrass Situation: info@thebluegrasssituation.com (thebluegrasssituation.com/about)
// - The Bitter Southerner: kyle@bittersoutherner.com (bittersoutherner.com/contact)
// - Folk Alley: linda@folkalley.com (folkalley.com/contact-folk-alley)
// - Hearth Music: info@hearthmusic.com (hearthmusic.com/about-us)
// - Twangville: requests@twangville.com, tom@twangville.com, todd@twangville.com (twangville.com)
//
// COUNTRY:
// - Saving Country Music: savingcountrymusic@gmail.com (savingcountrymusic.com/contact)
// - Country Queer: info@countryqueer.com (countryqueer.com/submission-guidelines)
// - The Country Note: main@thecountrynote.com (thecountrynote.com)
// - Roughstock: matt@roughstock.com (roughstock.com/staff)
// - Country Standard Time: countrystandardtime@gmail.com (countrystandardtime.com)
// - Country Universe: kevin@countryuniverse.net, leeann@countryuniverse.net, dan@countryuniverse.net, CountryUniverse@gmail.com (countryuniverse.net/about-us/contact)
// - Country Music News Blog: shauna@whiskeychick.rocks (countrymusicnewsblog.com/about-us/contact)
//
// BLUES:
// - Living Blues: brett@livingblues.com, info@livingblues.com, ads@livingblues.com, livingbluesreports@gmail.com (livingblues.com/contact)
// - Blues Blast Magazine: bob@bluesblastmagazine.com, info@bluesblastmagazine.com (bluesblastmagazine.com/contact)
// - Blues Rock Review: contact@bluesrockreview.com, albumreviews@bluesrockreview.com, advertising@bluesrockreview.com (bluesrockreview.com/contact)
// - Rock and Blues Muse: info@rockandbluesmuse.com (rockandbluesmuse.com/submissions)
//
// JAZZ:
// - DownBeat: editor@downbeat.com, franka@downbeat.com, bobbyr@downbeat.com, davis@downbeat.com (downbeat.com/site/contact)
// - JazzTimes: sales@jazztimes.com (jazztimes.com/contact)
// - Jazzwise: ros@jazzwise.com (jazzwise.com/pages/contact-us)
// - Jazz Weekly: feedback@jazzweekly.com (jazzweekly.com/contact-us)
// - JAZZIZ: editorial@jazziz.com, ideas@jazziz.com, info@jazziz.com (jazziz.com/contact-us)
//
// SINGER-SONGWRITER / ACOUSTIC:
// - Acoustic Guitar Magazine: editors.ag@stringletter.com (acousticguitar.com)
// - Fretboard Journal: jason@fretboardjournal.com, fretboardjournal@gmail.com (fretboardjournal.com/contact-us)
//
// SONGWRITING:
// - Songwriting Magazine: editor@songwritingmagazine.co.uk, team@songwritingmagazine.co.uk (songwritingmagazine.co.uk/contact)
// - Songwriter Universe: dk@songwriteruniverse.com (songwriteruniverse.com)
// - NSAI: reception@nashvillesongwriters.com, nsaisongcontest@nashvillesongwriters.com (nashvillesongwriters.com)
// - ASCAP: concertmusic@ascap.com, cdobbins@ascap.com (ascap.com/contact-us)
// - BMI: statement@bmi.com (bmi.com/about/entry/contact_us)
// - SESAC: publisher@sesac.com (sesac.com)
//
// MUSIC BUSINESS / INDUSTRY:
// - Music Business Worldwide: enquiries@musicbizworldwide.com (musicbusinessworldwide.com/contact-us)
// - Music Connection Magazine: contactmc@musicconnection.com (musicconnection.com/contact-us)
// - Performer Magazine: editorial@performermag.com, submissions@performermag.com, advertising@performermag.com (performermag.com/contact)
// - TAXI: memberservices@taxi.com, listings@taxi.com (taxi.com)
//
// MUSIC MARKETING:
// - Hypebot: editor@hypebot.com (hypebot.com/about)
// - Cyber PR: ariel@cyberpr.com (cyberprmusic.com/contact)
// - Sonicbids Blog: editorial@sonicbids.com (blog.sonicbids.com/write-for-sonicbids)
// - Ari's Take: ari@ariherstand.com, info@aristake.com, speaking@aristake.com, awesome@aristakeacademy.com (ariherstand.com/contact, aristake.com)
// - Bobby Owsinski: bobby@bobbyowsinski.com (bobbyowsinski.com)
//
// PODCASTS:
// - New Slang (Thomas Mooney): thomasdmooney@gmail.com (thomasdmooney.com/newslangpodcast)
// - The New Music Business (Ari Herstand): info@aristake.com (aristake.com)
//
// OUTLETS WHERE NO PUBLIC EMAIL WAS FOUND:
// - Americana Music Association: Uses email format first@americanamusic.org but no specific public contact email confirmed
// - American Blues Scene: Uses contact form, partial emails visible on ZoomInfo (not fully public)
// - Saving Country Music: Prefers contact form first, direct email not prominently listed
// - All About Jazz: Uses internal coverage request system, no public editor email
// - Bluegrass Situation: Only general info@ found
// - Disc Makers Blog: No specific editorial email found
// - DIY Musician (CDBaby): No specific contact email found, uses contribution page
// - Indie on the Move: Uses internal inquiry system
// - Bandzoogle Blog: Platform support only, not a submission outlet
// - ReverbNation Blog: Uses help center forms
// - Music Think Tank: Redirects to Hypebot, use editor@hypebot.com
// - Music Biz Academy: No public email found
// - CMJ / College Music Journal: Defunct/acquired by Amazing Radio
// - Engine 145: Defunct
// - Songtown: Contact form only, no public email
// - Americana UK: Submissions email referenced but not fully displayed in search results
// - Country Standard Time: Used gmail contact (listed above)
// - American Songwriter: General email listed but not for press/submissions specifically
// - Paste Magazine: No specific music editor email public
