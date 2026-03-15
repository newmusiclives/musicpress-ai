import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";
import { expandedSeedContacts, expandedContactCounts } from "./seed-contacts-expanded";
import { radioSeedContacts } from "./seed-radio";
import { blogJournalistSeedContacts } from "./seed-blogs-journalists";
import { curatorPodcasterSeedContacts } from "./seed-curators-podcasters";

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
    // ══════════════════════════════════════════════════════════════════════
    // MAJOR US PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── Rolling Stone ──────────────────────────────────────────────────────
    { name: "Rolling Stone Tips Desk", email: "tips@rollingstone.com", outlet: "Rolling Stone", genre: "Rock, Pop, All Genres", region: "US", beat: "News Tips, Story Ideas", bio: "Rolling Stone editorial tip line for press releases, story ideas, and news tips. Public contact listed on rollingstone.com/contact.", articleCount: 0 },
    { name: "Rolling Stone Letters", email: "letters@rollingstone.com", outlet: "Rolling Stone", genre: "Rock, Pop, All Genres", region: "US", beat: "Letters to the Editor", bio: "Rolling Stone letters desk for reader/industry correspondence. Public contact on rollingstone.com/contact.", articleCount: 0 },
    { name: "Rolling Stone Music", email: "music@rollingstone.com", outlet: "Rolling Stone", genre: "Rock, Pop, All Genres", region: "US", beat: "Music Coverage", bio: "Rolling Stone music department for music-related press inquiries. Public contact on rollingstone.com.", articleCount: 0 },

    // ── Pitchfork ──────────────────────────────────────────────────────────
    { name: "Pitchfork Tips Desk", email: "tips@pitchfork.com", outlet: "Pitchfork", genre: "Indie, Alternative, Experimental", region: "US", beat: "News Tips, Music Submissions", bio: "Pitchfork's public editorial tip line. Best way to reach their team for press and music tips.", articleCount: 0 },
    { name: "Pitchfork General", email: "feedback@pitchfork.com", outlet: "Pitchfork", genre: "Indie, Alternative, Experimental", region: "US", beat: "General Feedback, Corrections", bio: "Pitchfork general feedback and corrections email. Listed on pitchfork.com.", articleCount: 0 },

    // ── Billboard ──────────────────────────────────────────────────────────
    { name: "Billboard Tips Desk", email: "tips@billboard.com", outlet: "Billboard", genre: "Pop, Charts, Industry", region: "US", beat: "News Tips, Industry News", bio: "Billboard tip line for news tips and story ideas. Listed on billboard.com/tip-us.", articleCount: 0 },
    { name: "Billboard News Tips", email: "news_tips@billboard.com", outlet: "Billboard", genre: "Pop, Charts, Industry", region: "US", beat: "Confidential Tips", bio: "Billboard confidential news tips address. Listed on billboard.com/tip-us.", articleCount: 0 },

    // ── NME ────────────────────────────────────────────────────────────────
    { name: "NME Press Office", email: "press@nme.com", outlet: "NME", genre: "Indie, Rock, Pop, Electronic", region: "UK", beat: "Press Inquiries, Music News", bio: "NME press office for press releases and media inquiries. Listed on nme.com/contact.", articleCount: 0 },

    // ── Consequence (of Sound) ─────────────────────────────────────────────
    { name: "Consequence News Desk", email: "news@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "News Tips, Breaking News", bio: "Consequence of Sound news desk for tips and press releases. Listed on consequence.net/contact-us.", articleCount: 0 },
    { name: "Consequence Submissions", email: "submissions@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "Music Submissions", bio: "Consequence of Sound music submission email. Listed on consequence.net/contact-us.", articleCount: 0 },
    { name: "Consequence Editorial", email: "info@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Metal, Alternative, Indie", region: "US", beat: "General Comments, Press", bio: "Consequence of Sound general editorial email. Listed on consequence.net/contact-us.", articleCount: 0 },

    // ── Stereogum ──────────────────────────────────────────────────────────
    { name: "Stereogum Tips", email: "tips@stereogum.com", outlet: "Stereogum", genre: "Indie, Rock, Alternative", region: "US", beat: "News Tips, Music Submissions", bio: "Stereogum tip line for news and music submissions. Listed on stereogum.com/contact.", articleCount: 0 },
    { name: "Stereogum General", email: "info@stereogum.com", outlet: "Stereogum", genre: "Indie, Rock, Alternative", region: "US", beat: "General Inquiries", bio: "Stereogum general inquiries email. Listed on stereogum.com/contact.", articleCount: 0 },

    // ── The FADER ──────────────────────────────────────────────────────────
    { name: "The FADER Editorial", email: "editorial@thefader.com", outlet: "The FADER", genre: "Hip Hop, R&B, Pop, Emerging", region: "US", beat: "Music & Culture Features", bio: "The FADER editorial team email for press and pitches. Publicly referenced submission address.", articleCount: 0 },
    { name: "The FADER Info", email: "info@thefader.com", outlet: "The FADER", genre: "Hip Hop, R&B, Pop, Emerging", region: "US", beat: "General Inquiries", bio: "The FADER general inquiries email. Listed on thefader.com/contact.", articleCount: 0 },

    // ── Complex ────────────────────────────────────────────────────────────
    { name: "Complex Music", email: "music@complex.com", outlet: "Complex", genre: "Hip Hop, Pop, Culture", region: "US", beat: "Music Coverage", bio: "Complex music department email for music-related press inquiries. Listed on complex.com.", articleCount: 0 },

    // ── SPIN ───────────────────────────────────────────────────────────────
    { name: "SPIN Editorial", email: "feedback@spin.com", outlet: "SPIN", genre: "Rock, Indie, Pop, Electronic", region: "US", beat: "Editorial, Feedback", bio: "SPIN magazine editorial feedback and contact. Listed on spin.com/contact.", articleCount: 0 },

    // ── Paste Magazine ─────────────────────────────────────────────────────
    { name: "Paste Magazine Music", email: "music@pastemagazine.com", outlet: "Paste Magazine", genre: "Indie, Folk, Rock, All Genres", region: "US", beat: "Music Coverage, Reviews", bio: "Paste Magazine music department for press inquiries and submissions. Listed on pastemagazine.com/contact.", articleCount: 0 },
    { name: "Paste Magazine General", email: "editorial@pastemagazine.com", outlet: "Paste Magazine", genre: "Indie, Folk, Rock, All Genres", region: "US", beat: "General Editorial", bio: "Paste Magazine general editorial email. Listed on pastemagazine.com/contact.", articleCount: 0 },

    // ── XXL ────────────────────────────────────────────────────────────────
    { name: "XXL Magazine", email: "info@xxlmag.com", outlet: "XXL", genre: "Hip Hop, Rap", region: "US", beat: "Hip Hop Coverage", bio: "XXL Magazine general inquiries for hip hop press and coverage. Listed on xxlmag.com.", articleCount: 0 },

    // ── PopMatters ─────────────────────────────────────────────────────────
    { name: "PopMatters Editorial", email: "editor@popmatters.com", outlet: "PopMatters", genre: "All Genres, Culture", region: "US", beat: "Editorial, Music & Culture Criticism", bio: "PopMatters editorial email. Independent, women/LGBTQ-owned international magazine of cultural criticism. Listed in site metadata.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // UK PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

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
    { name: "Crack Magazine Editorial Team", email: "editorial@crackmagazine.net", outlet: "Crack Magazine", genre: "Electronic, Club, Culture", region: "UK", beat: "Editorial Pitches", bio: "Crack Magazine editorial team for feature pitches. Listed on crackmagazine.net/contact.", articleCount: 0 },

    // ── Loud and Quiet ─────────────────────────────────────────────────────
    { name: "Loud and Quiet Submissions", email: "contribute@loudandquiet.com", outlet: "Loud and Quiet", genre: "Indie, Alternative, Experimental", region: "UK", beat: "Music Submissions, Contributions", bio: "Loud and Quiet bi-monthly independent music magazine. Submission email listed on loudandquiet.com/contact.", articleCount: 0 },
    { name: "Loud and Quiet Editorial", email: "hello@loudandquiet.com", outlet: "Loud and Quiet", genre: "Indie, Alternative, Experimental", region: "UK", beat: "General Inquiries", bio: "Loud and Quiet general contact email. Listed on loudandquiet.com/contact.", articleCount: 0 },

    // ── Dork ───────────────────────────────────────────────────────────────
    { name: "Dork Magazine", email: "hello@readdork.com", outlet: "Dork", genre: "Indie, Pop, Rock", region: "UK", beat: "New Music, Reviews", bio: "Dork Magazine general contact for new music press and features. Listed on readdork.com/contact.", articleCount: 0 },
    { name: "Dork Magazine Editorial", email: "editorial@readdork.com", outlet: "Dork", genre: "Indie, Pop, Rock", region: "UK", beat: "Editorial, Features", bio: "Dork Magazine editorial department for feature pitches and reviews. Listed on readdork.com/contact.", articleCount: 0 },

    // ── Gigwise ────────────────────────────────────────────────────────────
    { name: "Gigwise Editorial", email: "editorial@gigwise.com", outlet: "Gigwise", genre: "Rock, Indie, Pop, Live Music", region: "UK", beat: "Live Music, Reviews, News", bio: "Gigwise editorial for live music coverage, reviews, and news. Listed on gigwise.com/about.", articleCount: 0 },

    // ── Drowned in Sound ──────────────────────────────────────────────────
    { name: "Drowned in Sound", email: "sean@drownedinsound.com", outlet: "Drowned in Sound", genre: "Indie, Alternative, Experimental", region: "UK", beat: "Editor, Reviews", bio: "Sean Adams, founder/editor of Drowned in Sound. Email publicly listed on drownedinsound.com/contact.", articleCount: 0 },

    // ── MusicOMH ──────────────────────────────────────────────────────────
    { name: "MusicOMH Editorial", email: "editorial@musicomh.com", outlet: "MusicOMH", genre: "Indie, Rock, Pop, Classical", region: "UK", beat: "Reviews, Features", bio: "MusicOMH editorial email for music reviews and feature pitches. Listed on musicomh.com/about.", articleCount: 0 },

    // ── The Skinny ────────────────────────────────────────────────────────
    { name: "The Skinny Music", email: "music@theskinny.co.uk", outlet: "The Skinny", genre: "Indie, Electronic, All Genres", region: "UK", beat: "Music Coverage, Reviews", bio: "The Skinny music section for press releases and reviews. Scottish/UK culture magazine. Listed on theskinny.co.uk/contact.", articleCount: 0 },

    // ── The Forty-Five ────────────────────────────────────────────────────
    { name: "The Forty-Five", email: "hello@thefortyfive.com", outlet: "The Forty-Five", genre: "Pop, Indie, Culture", region: "UK", beat: "Music & Culture", bio: "The Forty-Five general contact for music and culture press. Listed on thefortyfive.com.", articleCount: 0 },

    // ── So Young Magazine ─────────────────────────────────────────────────
    { name: "So Young Magazine", email: "info@soyoungmagazine.com", outlet: "So Young Magazine", genre: "Indie, Post-Punk, DIY", region: "UK", beat: "Indie, Post-Punk Coverage", bio: "So Young Magazine contact for indie and post-punk press. Print and online publication. Listed on soyoungmagazine.com.", articleCount: 0 },

    // ── Gold Flake Paint ──────────────────────────────────────────────────
    { name: "Gold Flake Paint", email: "submissions@goldflakepaint.co.uk", outlet: "Gold Flake Paint", genre: "Indie, Folk, Dream Pop", region: "UK", beat: "Music Submissions, Reviews", bio: "Gold Flake Paint music submission email for indie and folk. One of the UK's most respected indie blogs. Listed on goldflakepaint.co.uk.", articleCount: 0 },

    // ── Dazed ──────────────────────────────────────────────────────────────
    { name: "Dazed Music", email: "hello@dazed.studio", outlet: "Dazed", genre: "Culture, Music, Fashion", region: "UK", beat: "Music & Culture", bio: "Dazed general contact for music and culture pitches. Listed on dazeddigital.com/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // US INDIE PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── BrooklynVegan ─────────────────────────────────────────────────────
    { name: "BrooklynVegan Tips", email: "tips@brooklynvegan.com", outlet: "BrooklynVegan", genre: "Indie, Punk, Metal, All Genres", region: "US", beat: "News Tips, Music Submissions", bio: "BrooklynVegan tip line for news and music submissions. Listed on brooklynvegan.com/about.", articleCount: 0 },

    // ── Under the Radar ───────────────────────────────────────────────────
    { name: "Under the Radar", email: "editorial@undertheradarmag.com", outlet: "Under the Radar", genre: "Indie, Alternative", region: "US", beat: "Editorial, Submissions", bio: "Under the Radar Magazine editorial email for press and submissions. Listed on undertheradarmag.com/contact.", articleCount: 0 },

    // ── Treble ─────────────────────────────────────────────────────────────
    { name: "Treble", email: "editor@treblezine.com", outlet: "Treble", genre: "Indie, Rock, Electronic, Metal", region: "US", beat: "Editorial, Reviews", bio: "Treble magazine editor email for press inquiries and reviews. Listed on treblezine.com/about.", articleCount: 0 },

    // ── No Depression ──────────────────────────────────────────────────────
    { name: "No Depression Editorial", email: "editor@nodepression.com", outlet: "No Depression", genre: "Americana, Roots, Folk, Country", region: "US", beat: "Americana, Roots Music", bio: "No Depression editorial email for Americana and roots music press. Listed on nodepression.com/contact.", articleCount: 0 },

    // ── American Songwriter ───────────────────────────────────────────────
    { name: "American Songwriter Editorial", email: "info@americansongwriter.com", outlet: "American Songwriter", genre: "Folk, Country, Singer-Songwriter", region: "US", beat: "Songwriting, Features", bio: "American Songwriter general inquiries for press and submissions. Listed on americansongwriter.com/contact.", articleCount: 0 },

    // ── Saving Country Music ──────────────────────────────────────────────
    { name: "Saving Country Music", email: "trigger@savingcountrymusic.com", outlet: "Saving Country Music", genre: "Country, Americana, Outlaw Country", region: "US", beat: "Country Music Coverage", bio: "Trigger, editor of Saving Country Music. Email listed on savingcountrymusic.com/contact.", articleCount: 0 },

    // ── Glide Magazine ────────────────────────────────────────────────────
    { name: "Glide Magazine", email: "info@glidemagazine.com", outlet: "Glide Magazine", genre: "Jam, Rock, Indie, Blues", region: "US", beat: "Music Reviews, Features", bio: "Glide Magazine contact for music press and reviews. Listed on glidemagazine.com.", articleCount: 0 },

    // ── Atwood Magazine ───────────────────────────────────────────────────
    { name: "Atwood Magazine Editorial", email: "info@atwoodmagazine.com", outlet: "Atwood Magazine", genre: "Indie, Alternative, Pop, Folk", region: "US", beat: "Indie Features, Reviews", bio: "Atwood Magazine general inquiries. Keep pitches to 2-3 sentences with direct music links. Listed on atwoodmagazine.com.", articleCount: 0 },

    // ── Earmilk ───────────────────────────────────────────────────────────
    { name: "Earmilk Business", email: "business@earmilk.com", outlet: "Earmilk", genre: "Electronic, Hip Hop, R&B, Funk", region: "US", beat: "Business Inquiries", bio: "Earmilk business email. Note: music submissions are accepted exclusively through SubmitHub. Listed on earmilk.com/contact-us.", articleCount: 0 },

    // ── Aquarian Weekly ───────────────────────────────────────────────────
    { name: "Aquarian Weekly", email: "editorial@theaquarian.com", outlet: "Aquarian Weekly", genre: "Rock, Indie, Alternative", region: "US", beat: "Music Coverage, Live Reviews", bio: "The Aquarian Weekly editorial contact for music press in the NY/NJ area. Listed on theaquarian.com/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // ELECTRONIC MUSIC PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── Resident Advisor ───────────────────────────────────────────────────
    { name: "Resident Advisor Projects", email: "projects@ra.co", outlet: "Resident Advisor", genre: "Electronic, Techno, House", region: "UK", beat: "Projects, Sustainability", bio: "Resident Advisor project inquiries email. Listed on ra.co/about.", articleCount: 0 },
    { name: "Resident Advisor Editorial", email: "editorial@ra.co", outlet: "Resident Advisor", genre: "Electronic, Techno, House", region: "UK", beat: "Editorial, Reviews", bio: "Resident Advisor editorial department for reviews and features. Listed on ra.co/about.", articleCount: 0 },

    // ── DJ Mag ─────────────────────────────────────────────────────────────
    { name: "DJ Mag Editorial", email: "editorial@djmag.com", outlet: "DJ Mag", genre: "Electronic, House, Techno, Dance", region: "UK", beat: "DJ/Electronic Coverage", bio: "DJ Mag editorial email for electronic music press. Listed on djmag.com/contact.", articleCount: 0 },
    { name: "DJ Mag Music", email: "music@djmag.com", outlet: "DJ Mag", genre: "Electronic, House, Techno, Dance", region: "UK", beat: "Music Submissions", bio: "DJ Mag music submissions email. Listed on djmag.com/contact.", articleCount: 0 },

    // ── Mixmag ─────────────────────────────────────────────────────────────
    { name: "Mixmag Editorial", email: "editorial@mixmag.net", outlet: "Mixmag", genre: "Electronic, Dance, Club", region: "UK", beat: "Electronic Music Coverage", bio: "Mixmag editorial email for electronic and dance music press. Listed on mixmag.net/contact.", articleCount: 0 },

    // ── Dancing Astronaut ─────────────────────────────────────────────────
    { name: "Dancing Astronaut", email: "info@dancingastronaut.com", outlet: "Dancing Astronaut", genre: "EDM, Electronic, Dance", region: "US", beat: "EDM News, Reviews", bio: "Dancing Astronaut contact for EDM and electronic music press. Listed on dancingastronaut.com/contact.", articleCount: 0 },

    // ── EDM.com ────────────────────────────────────────────────────────────
    { name: "EDM.com Editorial", email: "info@edm.com", outlet: "EDM.com", genre: "EDM, Electronic, Dance", region: "US", beat: "EDM News, Music Coverage", bio: "EDM.com general contact for electronic music press. Listed on edm.com/contact.", articleCount: 0 },

    // ── Your EDM ──────────────────────────────────────────────────────────
    { name: "Your EDM", email: "submissions@youredm.com", outlet: "Your EDM", genre: "EDM, Electronic, Dance", region: "US", beat: "Music Submissions", bio: "Your EDM music submission email for electronic music. Listed on youredm.com/about.", articleCount: 0 },

    // ── Run The Trap ──────────────────────────────────────────────────────
    { name: "Run The Trap", email: "info@runthetrap.com", outlet: "Run The Trap", genre: "Trap, EDM, Bass Music", region: "US", beat: "Trap/Bass Music Coverage", bio: "Run The Trap contact for trap and bass music press submissions. Listed on runthetrap.com.", articleCount: 0 },

    // ── This Song Is Sick ─────────────────────────────────────────────────
    { name: "This Song Is Sick Editorial", email: "submission@thissongissick.com", outlet: "This Song Is Sick", genre: "Electronic, Hip-Hop, Indie", region: "US", beat: "Electronic/Hip-Hop Coverage", bio: "This Song Is Sick submission email for electronic and hip-hop music. Listed on thissongissick.com.", articleCount: 0 },

    // ── FACT Magazine ──────────────────────────────────────────────────────
    { name: "FACT Magazine Promos", email: "promos@factmag.com", outlet: "FACT Magazine", genre: "Electronic, Hip Hop, Club", region: "UK", beat: "Music Promos, Submissions", bio: "FACT Magazine promo submissions email for electronic and hip hop music. Publicly listed submission address.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // HIP HOP PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── The Source ─────────────────────────────────────────────────────────
    { name: "The Source Magazine", email: "info@thesource.com", outlet: "The Source", genre: "Hip Hop, Rap, R&B", region: "US", beat: "Hip Hop Coverage", bio: "The Source magazine contact for hip hop press inquiries. Listed on thesource.com.", articleCount: 0 },

    // ── HotNewHipHop ──────────────────────────────────────────────────────
    { name: "HotNewHipHop", email: "submissions@hotnewhiphop.com", outlet: "HotNewHipHop", genre: "Hip Hop, Rap, R&B", region: "US", beat: "Music Submissions", bio: "HotNewHipHop music submission email for hip hop artists. Listed on hotnewhiphop.com.", articleCount: 0 },

    // ── DJBooth ────────────────────────────────────────────────────────────
    { name: "DJBooth Editorial", email: "submissions@djbooth.net", outlet: "DJBooth", genre: "Hip Hop, Rap", region: "US", beat: "Hip Hop Features, Reviews", bio: "DJBooth submission email for hip hop press and features. Listed on djbooth.net.", articleCount: 0 },

    // ── Okayplayer ────────────────────────────────────────────────────────
    { name: "Okayplayer", email: "info@okayplayer.com", outlet: "Okayplayer", genre: "Hip Hop, Soul, R&B, Afrobeat", region: "US", beat: "Music & Culture Coverage", bio: "Okayplayer contact for hip hop, soul, and culture press. Founded by Questlove. Listed on okayplayer.com.", articleCount: 0 },

    // ── AllHipHop ─────────────────────────────────────────────────────────
    { name: "AllHipHop", email: "info@allhiphop.com", outlet: "AllHipHop", genre: "Hip Hop, Rap", region: "US", beat: "Hip Hop News", bio: "AllHipHop general contact for hip hop news and press. Listed on allhiphop.com.", articleCount: 0 },

    // ── Rap-Up ─────────────────────────────────────────────────────────────
    { name: "Rap-Up", email: "info@rap-up.com", outlet: "Rap-Up", genre: "Hip Hop, R&B, Pop", region: "US", beat: "Hip Hop/R&B Coverage", bio: "Rap-Up contact for hip hop and R&B press inquiries. Listed on rap-up.com.", articleCount: 0 },

    // ── 2DopeBoyz ─────────────────────────────────────────────────────────
    { name: "2DopeBoyz Submissions", email: "submissions@2dopeboyz.com", outlet: "2DopeBoyz", genre: "Hip Hop, Rap", region: "US", beat: "Hip Hop Discovery", bio: "2DopeBoyz music submission email. One of hip hop's most influential blogs. Listed on 2dopeboyz.com.", articleCount: 0 },

    // ── Pigeons & Planes ──────────────────────────────────────────────────
    { name: "Pigeons & Planes", email: "submissions@pigeonsandplanes.com", outlet: "Pigeons & Planes", genre: "All Genres, Hip Hop, Pop, Indie", region: "US", beat: "Music Discovery", bio: "Complex Networks music discovery platform. Has broken Billie Eilish, Post Malone. Use subject 'PLAYLIST SUBMISSION'. Public email from X/Twitter.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // LATIN / WORLD MUSIC PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── Remezcla ───────────────────────────────────────────────────────────
    { name: "Remezcla Editorial", email: "info@remezcla.com", outlet: "Remezcla", genre: "Latin, Reggaeton, Culture", region: "US", beat: "Latin Music & Culture", bio: "Remezcla contact for Latin music and culture press inquiries. Listed on remezcla.com/about.", articleCount: 0 },

    // ── Sounds and Colours ────────────────────────────────────────────────
    { name: "Sounds and Colours", email: "info@soundsandcolours.com", outlet: "Sounds and Colours", genre: "Latin, World, Brazilian", region: "UK", beat: "Latin American Music & Culture", bio: "Sounds and Colours contact for Latin American music and culture. Listed on soundsandcolours.com/about.", articleCount: 0 },

    // ── World Music Central ───────────────────────────────────────────────
    { name: "World Music Central", email: "info@worldmusiccentral.org", outlet: "World Music Central", genre: "World, Global, Folk", region: "Global", beat: "World Music Coverage", bio: "World Music Central contact for world music press and reviews. Listed on worldmusiccentral.org/about.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // METAL / PUNK PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── Metal Injection ───────────────────────────────────────────────────
    { name: "Metal Injection", email: "tips@metalinjection.net", outlet: "Metal Injection", genre: "Metal, Heavy, Hardcore", region: "US", beat: "Metal News, Reviews", bio: "Metal Injection tip line for metal news and press releases. Listed on metalinjection.net/contact.", articleCount: 0 },

    // ── MetalSucks ────────────────────────────────────────────────────────
    { name: "MetalSucks Tips", email: "tips@metalsucks.net", outlet: "MetalSucks", genre: "Metal, Heavy, Hardcore", region: "US", beat: "Metal News, Tips", bio: "MetalSucks tip line for metal news and press. Listed on metalsucks.net/contact.", articleCount: 0 },

    // ── Kerrang! ──────────────────────────────────────────────────────────
    { name: "Kerrang! Editorial", email: "feedback@kerrang.com", outlet: "Kerrang!", genre: "Rock, Metal, Punk, Alternative", region: "UK", beat: "Rock/Metal Coverage", bio: "Kerrang! magazine editorial feedback and press contact. Listed on kerrang.com/contact.", articleCount: 0 },

    // ── Revolver ──────────────────────────────────────────────────────────
    { name: "Revolver Magazine", email: "editorial@revolvermag.com", outlet: "Revolver", genre: "Metal, Hard Rock, Heavy", region: "US", beat: "Metal/Hard Rock Coverage", bio: "Revolver Magazine editorial email for metal and hard rock press. Listed on revolvermag.com/contact.", articleCount: 0 },

    // ── Punknews ──────────────────────────────────────────────────────────
    { name: "Punknews", email: "music@punknews.org", outlet: "Punknews", genre: "Punk, Hardcore, Ska", region: "US", beat: "Punk Music Coverage", bio: "Punknews music submission email for punk and hardcore press. Listed on punknews.org/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // COUNTRY / AMERICANA PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════

    // ── The Boot ──────────────────────────────────────────────────────────
    { name: "The Boot", email: "tips@theboot.com", outlet: "The Boot", genre: "Country, Americana", region: "US", beat: "Country Music News", bio: "The Boot tip line for country music news and press. Listed on theboot.com/contact.", articleCount: 0 },

    // ── Taste of Country ──────────────────────────────────────────────────
    { name: "Taste of Country", email: "tips@tasteofcountry.com", outlet: "Taste of Country", genre: "Country", region: "US", beat: "Country Music Coverage", bio: "Taste of Country tip line for country music press. Listed on tasteofcountry.com/contact.", articleCount: 0 },

    // ── Wide Open Country ─────────────────────────────────────────────────
    { name: "Wide Open Country", email: "editorial@wideopencountry.com", outlet: "Wide Open Country", genre: "Country, Americana, Southern", region: "US", beat: "Country Lifestyle & Music", bio: "Wide Open Country editorial contact for country music and lifestyle press. Listed on wideopencountry.com/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // ENTERTAINMENT / CULTURE PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════
    { name: "FLOOD Magazine", email: "info@floodmagazine.com", outlet: "FLOOD Magazine", genre: "Indie, Alternative, Pop", region: "US", beat: "Music Features & Reviews", bio: "FLOOD Magazine editorial. Source: floodmagazine.com/contact.", articleCount: 0 },
    { name: "Alan Sartirana (FLOOD)", email: "alan@floodmagazine.com", outlet: "FLOOD Magazine", genre: "Indie, Alternative, Pop", region: "US", beat: "Partnerships", bio: "FLOOD Magazine partnerships. Source: floodmagazine.com/contact.", articleCount: 0 },
    { name: "Rob Harvilla", email: "rob.harvilla@theringer.com", outlet: "The Ringer", genre: "All Genres, Pop, Rock, Hip Hop", region: "US", beat: "Music Critic", bio: "Staff writer at The Ringer covering music. Previously Spin, Village Voice.", articleCount: 0 },
    { name: "Derrick Rossignol", email: "derrick.rossignol@uproxx.com", outlet: "Uproxx", genre: "Indie, Pop, Hip Hop, Rock", region: "US", beat: "Music News Editor", bio: "Music News Editor at Uproxx.", articleCount: 0 },
    { name: "Paper Magazine Editorial", email: "edit@papermag.com", outlet: "Paper Magazine", genre: "Pop, Hip Hop, Electronic, Culture", region: "US", beat: "Music & Culture", bio: "Paper Magazine editorial. Source: papermag.com.", articleCount: 0 },
    { name: "Interview Magazine", email: "contact@crystalball.media", outlet: "Interview Magazine", genre: "Pop, Rock, Hip Hop, Culture", region: "US", beat: "Artist Interviews", bio: "Interview Magazine (Crystal Ball Media). Source: interviewmagazine.com.", articleCount: 0 },
    { name: "Flaunt Magazine", email: "info@flauntmagazine.com", outlet: "Flaunt Magazine", genre: "Indie, Pop, Hip Hop, Culture", region: "US", beat: "Music & Culture", bio: "Flaunt Magazine. Source: flaunt.com/contact.", articleCount: 0 },
    { name: "James Hutchins (i-D)", email: "james.hutchins@i-d.co.uk", outlet: "i-D Magazine", genre: "Pop, Electronic, Indie, Hip Hop", region: "UK", beat: "Assistant Music Editor", bio: "Assistant Music Editor at i-D Magazine.", articleCount: 0 },
    { name: "Jem Aswad", email: "jaswad@variety.com", outlet: "Variety", genre: "All Genres, Industry", region: "US", beat: "Executive Editor, Music", bio: "Executive Editor of Music at Variety. Source: variety.com.", articleCount: 0 },
    { name: "THR Newsdesk", email: "THRnews@thr.com", outlet: "The Hollywood Reporter", genre: "All Genres, Industry", region: "US", beat: "Music Industry News", bio: "THR editorial newsdesk. Source: hollywoodreporter.com/contact.", articleCount: 0 },
    { name: "AV Club Music", email: "musicpublicists@avclub.com", outlet: "The AV Club", genre: "All Genres", region: "US", beat: "Music Reviews", bio: "AV Club music publicist contact. Source: avclub.com/about.", articleCount: 0 },
    { name: "Consequence Editors", email: "editors@consequence.net", outlet: "Consequence of Sound", genre: "Rock, Indie, Alternative", region: "US", beat: "Editorial Pitches", bio: "Consequence editorial pitches. Source: consequence.net/contact-us.", articleCount: 0 },
    { name: "Hyperallergic Tips", email: "tips@hyperallergic.com", outlet: "Hyperallergic", genre: "Experimental, Art Music", region: "US", beat: "Arts & Music", bio: "Hyperallergic tips. Source: hyperallergic.com/contact.", articleCount: 0 },
    { name: "Hyperallergic General", email: "hello@hyperallergic.com", outlet: "Hyperallergic", genre: "Experimental, Art Music", region: "US", beat: "Arts & Culture", bio: "Hyperallergic general. Source: hyperallergic.com/contact.", articleCount: 0 },
    { name: "Highsnobiety Music", email: "advertising@highsnobiety.com", outlet: "Highsnobiety", genre: "Hip Hop, Electronic, Pop", region: "Global", beat: "Music & Culture", bio: "Highsnobiety. Source: company.highsnobiety.com/contact.", articleCount: 0 },
    { name: "Hypebeast Editorial", email: "info@hypebeast.com", outlet: "Hypebeast", genre: "Hip Hop, R&B, Pop", region: "Global", beat: "Music & Culture", bio: "Hypebeast. Source: hypebeast.com/contact.", articleCount: 0 },
    { name: "Deadline Editors", email: "editors@deadline.com", outlet: "Deadline", genre: "All Genres, Industry", region: "US", beat: "Entertainment News", bio: "Deadline editorial. Source: deadline.com.", articleCount: 0 },
    { name: "Entertainment Weekly", email: "letters@ew.com", outlet: "Entertainment Weekly", genre: "All Genres, Pop", region: "US", beat: "Music Features", bio: "EW editorial. Source: ew.com.", articleCount: 0 },
    { name: "Dazed Partnerships", email: "partnerships@dazedmedia.com", outlet: "Dazed", genre: "Indie, Electronic, Hip Hop", region: "UK", beat: "Music & Culture", bio: "Dazed Media partnerships. Source: dazeddigital.com/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // REGIONAL MUSIC CRITICS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Nashville Scene Music", email: "strageser@nashvillescene.com", outlet: "Nashville Scene", genre: "Country, Americana, Indie", region: "US", beat: "Music & Listings Editor", bio: "Nashville Scene music editor. Source: nashvillescene.com/site/contact.", articleCount: 0 },
    { name: "Michael Rietmulder", email: "mrietmulder@seattletimes.com", outlet: "Seattle Times", genre: "All Genres", region: "US", beat: "Music Critic", bio: "Seattle Times music critic. Source: seattletimes.com/newsroom-staff.", articleCount: 0 },
    { name: "Chris Riemenschneider", email: "chrisr@startribune.com", outlet: "Minneapolis Star Tribune", genre: "All Genres", region: "US", beat: "Music Critic", bio: "Star Tribune music critic. Source: Muck Rack.", articleCount: 0 },
    { name: "Zoë Madonna", email: "madonna@globe.com", outlet: "Boston Globe", genre: "All Genres", region: "US", beat: "Music Critic", bio: "Boston Globe music critic.", articleCount: 0 },
    { name: "Tony Paris", email: "tony.paris@creativeloafing.com", outlet: "Creative Loafing", genre: "All Genres", region: "US", beat: "Music Editor", bio: "Creative Loafing music editor. Source: creativeloafing.com.", articleCount: 0 },
    { name: "Kirsten Grant", email: "kirsten.grant@telegraph.co.uk", outlet: "The Telegraph", genre: "All Genres", region: "UK", beat: "Reviews Editor", bio: "Telegraph reviews editor covering music. Source: X/Twitter.", articleCount: 0 },
    { name: "Portland Mercury", email: "calendar@portlandmercury.com", outlet: "Portland Mercury", genre: "Indie, Rock, All Genres", region: "US", beat: "Music Events", bio: "Portland Mercury events. Source: portlandmercury.com.", articleCount: 0 },
    { name: "SF Chronicle Editor", email: "editor@sfchronicle.com", outlet: "SF Chronicle", genre: "All Genres", region: "US", beat: "Music Reviews", bio: "SF Chronicle editorial. Source: sfchronicle.zendesk.com.", articleCount: 0 },
    { name: "Irish Times", email: "services@irishtimes.com", outlet: "Irish Times", genre: "All Genres", region: "IE", beat: "Music & Culture", bio: "Irish Times. Source: irishtimes.com.", articleCount: 0 },
    { name: "Evening Standard", email: "syndication@standard.co.uk", outlet: "Evening Standard", genre: "All Genres", region: "UK", beat: "Arts & Music", bio: "Evening Standard. Source: standard.co.uk.", articleCount: 0 },
    { name: "Andrew Parks (Self-Titled)", email: "andrew@self-titledmag.com", outlet: "Self-Titled Magazine", genre: "Underground, Experimental, Electronic", region: "US", beat: "Editor", bio: "Self-Titled Magazine editor. Source: self-titledmag.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // INDUSTRY / BUSINESS PRESS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Hypebot", email: "tips@hypebot.com", outlet: "Hypebot", genre: "Industry, All Genres", region: "US", beat: "Music Industry News", bio: "Hypebot tip line for music industry news and tech. Listed on hypebot.com/contact.", articleCount: 0 },

    // ── Digital Music News ────────────────────────────────────────────────
    { name: "Digital Music News", email: "tips@digitalmusicnews.com", outlet: "Digital Music News", genre: "Industry, All Genres", region: "US", beat: "Digital Music Industry", bio: "Digital Music News tip line. Listed on digitalmusicnews.com/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // AMERICANA / ROOTS / SINGER-SONGWRITER
    // ══════════════════════════════════════════════════════════════════════
    { name: "Hilary Saunders", email: "hilary@nodepression.com", outlet: "No Depression", genre: "Americana, Roots, Folk, Singer-Songwriter", region: "US", beat: "Managing Editor", bio: "No Depression managing editor. Source: nodepression.com.", articleCount: 0 },
    { name: "No Depression Letters", email: "letters@nodepression.com", outlet: "No Depression", genre: "Americana, Roots, Folk", region: "US", beat: "Editorial Tips", bio: "No Depression editorial. Source: nodepression.com.", articleCount: 0 },
    { name: "No Depression Help", email: "help@nodepression.com", outlet: "No Depression", genre: "Americana, Roots, Folk", region: "US", beat: "General Inquiries", bio: "No Depression general. Source: nodepression.com.", articleCount: 0 },
    { name: "Sonja Nelson (No Depression)", email: "sonja@nodepression.com", outlet: "No Depression", genre: "Americana, Roots, Folk", region: "US", beat: "Advertising", bio: "No Depression advertising. Source: nodepression.com.", articleCount: 0 },
    { name: "Danny McCloskey", email: "danny@thealternateroot.com", outlet: "The Alternate Root", genre: "Americana, Roots, Folk, Singer-Songwriter", region: "US", beat: "Editor / A&R", bio: "The Alternate Root editor. Source: thealternateroot.com.", articleCount: 0 },
    { name: "Americana Highways", email: "americanahighways@gmail.com", outlet: "Americana Highways", genre: "Americana, Roots, Folk, Country", region: "US", beat: "Album Reviews", bio: "Americana Highways blog. Public email.", articleCount: 0 },
    { name: "Ear to the Ground Music", email: "eartothegroundmusicblog@gmail.com", outlet: "Ear to the Ground Music", genre: "Folk, Indie, Roots, Singer-Songwriter", region: "US", beat: "Emerging Artists", bio: "Ear to the Ground Music blog. Public email.", articleCount: 0 },
    { name: "PopMatters Features", email: "features@popmatters.com", outlet: "PopMatters", genre: "All Genres", region: "US", beat: "Feature Pitches", bio: "PopMatters features. Source: popmatters.com.", articleCount: 0 },
    { name: "Acoustic Guitar Magazine", email: "editors.ag@stringletter.com", outlet: "Acoustic Guitar Magazine", genre: "Acoustic, Singer-Songwriter, Folk", region: "US", beat: "Editorial & Reviews", bio: "Acoustic Guitar Magazine. Source: acousticguitar.com.", articleCount: 0 },
    { name: "Jason Verlinde (Fretboard Journal)", email: "jason@fretboardjournal.com", outlet: "Fretboard Journal", genre: "Acoustic, Guitar, Singer-Songwriter", region: "US", beat: "Editor", bio: "Fretboard Journal editor. Source: fretboardjournal.com.", articleCount: 0 },
    { name: "Fretboard Journal", email: "fretboardjournal@gmail.com", outlet: "Fretboard Journal", genre: "Acoustic, Guitar, Singer-Songwriter", region: "US", beat: "General", bio: "Fretboard Journal. Public email.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // COUNTRY / ALT-COUNTRY
    // ══════════════════════════════════════════════════════════════════════
    { name: "Country Queer", email: "info@countryqueer.com", outlet: "Country Queer", genre: "Country, Americana, Alt-Country, LGBTQ+", region: "US", beat: "LGBTQ+ Country Music", bio: "Country Queer. Source: countryqueer.com.", articleCount: 0 },
    { name: "The Country Note", email: "main@thecountrynote.com", outlet: "The Country Note", genre: "Country, Americana", region: "US", beat: "Country News & Reviews", bio: "The Country Note. Source: thecountrynote.com.", articleCount: 0 },
    { name: "Matt Bjorke (Roughstock)", email: "matt@roughstock.com", outlet: "Roughstock", genre: "Country, Americana", region: "US", beat: "Editor", bio: "Roughstock editor. Source: roughstock.com.", articleCount: 0 },
    { name: "Jeffrey B. Remz", email: "countrystandardtime@gmail.com", outlet: "Country Standard Time", genre: "Country, Bluegrass, Americana", region: "US", beat: "Editor & Publisher", bio: "Country Standard Time editor. Public email.", articleCount: 0 },
    { name: "Kevin J. Coyne", email: "kevin@countryuniverse.net", outlet: "Country Universe", genre: "Country, Americana", region: "US", beat: "Editor", bio: "Country Universe editor. Source: countryuniverse.net.", articleCount: 0 },
    { name: "Country Universe General", email: "CountryUniverse@gmail.com", outlet: "Country Universe", genre: "Country, Americana", region: "US", beat: "General", bio: "Country Universe. Public email.", articleCount: 0 },
    { name: "Country Music News Blog", email: "shauna@whiskeychick.rocks", outlet: "Country Music News Blog", genre: "Country", region: "US", beat: "Country News", bio: "Country music news blog. Public email.", articleCount: 0 },
    { name: "Saving Country Music Alt", email: "savingcountrymusic@gmail.com", outlet: "Saving Country Music", genre: "Country, Alt-Country, Outlaw", region: "US", beat: "Reviews & Commentary", bio: "Saving Country Music. Public email.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // BLUES
    // ══════════════════════════════════════════════════════════════════════
    { name: "Brett Bonner (Living Blues)", email: "brett@livingblues.com", outlet: "Living Blues Magazine", genre: "Blues", region: "US", beat: "Editor", bio: "Living Blues editor. Source: livingblues.com.", articleCount: 0 },
    { name: "Living Blues Info", email: "info@livingblues.com", outlet: "Living Blues Magazine", genre: "Blues", region: "US", beat: "General", bio: "Living Blues. Source: livingblues.com.", articleCount: 0 },
    { name: "Living Blues Radio", email: "livingbluesreports@gmail.com", outlet: "Living Blues Magazine", genre: "Blues", region: "US", beat: "Radio Charts", bio: "Living Blues radio charts. Public email.", articleCount: 0 },
    { name: "Bob Kieser (Blues Blast)", email: "bob@bluesblastmagazine.com", outlet: "Blues Blast Magazine", genre: "Blues", region: "US", beat: "Editor & Publisher", bio: "Blues Blast editor. Source: bluesblastmagazine.com.", articleCount: 0 },
    { name: "Blues Blast Info", email: "info@bluesblastmagazine.com", outlet: "Blues Blast Magazine", genre: "Blues", region: "US", beat: "General", bio: "Blues Blast. Source: bluesblastmagazine.com.", articleCount: 0 },
    { name: "Blues Rock Review", email: "contact@bluesrockreview.com", outlet: "Blues Rock Review", genre: "Blues, Blues Rock", region: "US", beat: "General", bio: "Blues Rock Review. Source: bluesrockreview.com.", articleCount: 0 },
    { name: "Blues Rock Review Albums", email: "albumreviews@bluesrockreview.com", outlet: "Blues Rock Review", genre: "Blues, Blues Rock", region: "US", beat: "Album Submissions", bio: "Blues Rock Review album submissions. Source: bluesrockreview.com.", articleCount: 0 },
    { name: "Rock and Blues Muse", email: "info@rockandbluesmuse.com", outlet: "Rock and Blues Muse", genre: "Blues, Blues Rock, Rock, Roots", region: "US", beat: "Reviews & Interviews", bio: "Rock and Blues Muse. Source: rockandbluesmuse.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // JAZZ
    // ══════════════════════════════════════════════════════════════════════
    { name: "DownBeat Editor", email: "editor@downbeat.com", outlet: "DownBeat Magazine", genre: "Jazz", region: "US", beat: "Editorial", bio: "DownBeat. Source: downbeat.com.", articleCount: 0 },
    { name: "Frank Alkyer (DownBeat)", email: "franka@downbeat.com", outlet: "DownBeat Magazine", genre: "Jazz", region: "US", beat: "Publisher", bio: "DownBeat publisher. Source: downbeat.com.", articleCount: 0 },
    { name: "Bobby Reed (DownBeat)", email: "bobbyr@downbeat.com", outlet: "DownBeat Magazine", genre: "Jazz", region: "US", beat: "Managing Editor", bio: "DownBeat managing editor. Source: downbeat.com.", articleCount: 0 },
    { name: "Davis Inman (DownBeat)", email: "davis@downbeat.com", outlet: "DownBeat Magazine", genre: "Jazz", region: "US", beat: "Associate Editor", bio: "DownBeat associate editor. Source: downbeat.com.", articleCount: 0 },
    { name: "JazzTimes Sales", email: "sales@jazztimes.com", outlet: "JazzTimes", genre: "Jazz", region: "US", beat: "Business", bio: "JazzTimes. Source: jazztimes.com.", articleCount: 0 },
    { name: "Jazzwise Editorial", email: "ros@jazzwise.com", outlet: "Jazzwise", genre: "Jazz", region: "UK", beat: "Editorial", bio: "Jazzwise UK jazz magazine. Source: jazzwise.com.", articleCount: 0 },
    { name: "George W. Harris (Jazz Weekly)", email: "feedback@jazzweekly.com", outlet: "Jazz Weekly", genre: "Jazz, Avant-Garde", region: "US", beat: "Editor", bio: "Jazz Weekly editor. Source: jazzweekly.com.", articleCount: 0 },
    { name: "JAZZIZ Editorial", email: "editorial@jazziz.com", outlet: "JAZZIZ Magazine", genre: "Jazz", region: "US", beat: "Music Submissions", bio: "JAZZIZ submissions. Source: jazziz.com.", articleCount: 0 },
    { name: "JAZZIZ Ideas", email: "ideas@jazziz.com", outlet: "JAZZIZ Magazine", genre: "Jazz", region: "US", beat: "Commentary", bio: "JAZZIZ commentary. Source: jazziz.com.", articleCount: 0 },
    { name: "JAZZIZ Info", email: "info@jazziz.com", outlet: "JAZZIZ Magazine", genre: "Jazz", region: "US", beat: "General", bio: "JAZZIZ. Source: jazziz.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // SONGWRITING
    // ══════════════════════════════════════════════════════════════════════
    { name: "Songwriting Magazine Editor", email: "editor@songwritingmagazine.co.uk", outlet: "Songwriting Magazine", genre: "Songwriting, All Genres", region: "UK", beat: "Editor", bio: "Songwriting Magazine. Source: songwritingmagazine.co.uk.", articleCount: 0 },
    { name: "Songwriting Magazine Team", email: "team@songwritingmagazine.co.uk", outlet: "Songwriting Magazine", genre: "Songwriting, All Genres", region: "UK", beat: "General", bio: "Songwriting Magazine. Source: songwritingmagazine.co.uk.", articleCount: 0 },
    { name: "Dale Kawashima", email: "dk@songwriteruniverse.com", outlet: "Songwriter Universe", genre: "Songwriting, All Genres", region: "US", beat: "Founder & Editor", bio: "Songwriter Universe founder. Source: songwriteruniverse.com.", articleCount: 0 },
    { name: "NSAI Reception", email: "reception@nashvillesongwriters.com", outlet: "Nashville Songwriters Assoc.", genre: "Songwriting, Country", region: "US", beat: "General", bio: "NSAI. Source: nashvillesongwriters.com.", articleCount: 0 },
    { name: "NSAI Song Contest", email: "nsaisongcontest@nashvillesongwriters.com", outlet: "Nashville Songwriters Assoc.", genre: "Songwriting, Country", region: "US", beat: "Song Contest", bio: "NSAI contest. Source: nashvillesongwriters.com.", articleCount: 0 },
    { name: "ASCAP Concert Music", email: "concertmusic@ascap.com", outlet: "ASCAP", genre: "Songwriting, All Genres", region: "US", beat: "Concert Music", bio: "ASCAP. Source: ascap.com.", articleCount: 0 },
    { name: "SESAC Publisher Relations", email: "publisher@sesac.com", outlet: "SESAC", genre: "Songwriting, All Genres", region: "US", beat: "Publisher Relations", bio: "SESAC. Source: sesac.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // MUSIC BUSINESS / MARKETING
    // ══════════════════════════════════════════════════════════════════════
    { name: "Hypebot Editor", email: "editor@hypebot.com", outlet: "Hypebot", genre: "Industry, Marketing", region: "US", beat: "Editor", bio: "Hypebot editor. Source: hypebot.com.", articleCount: 0 },
    { name: "Music Connection Magazine", email: "contactmc@musicconnection.com", outlet: "Music Connection Magazine", genre: "Industry, All Genres", region: "US", beat: "Editorial", bio: "Music Connection. Source: musicconnection.com.", articleCount: 0 },
    { name: "Performer Magazine Editorial", email: "editorial@performermag.com", outlet: "Performer Magazine", genre: "Indie, All Genres, DIY", region: "US", beat: "Editorial", bio: "Performer Magazine. Source: performermag.com.", articleCount: 0 },
    { name: "Performer Magazine Submissions", email: "submissions@performermag.com", outlet: "Performer Magazine", genre: "Indie, All Genres, DIY", region: "US", beat: "Submissions", bio: "Performer Magazine. Source: performermag.com.", articleCount: 0 },
    { name: "TAXI Member Services", email: "memberservices@taxi.com", outlet: "TAXI", genre: "All Genres, Sync", region: "US", beat: "Member Services", bio: "TAXI. Source: taxi.com.", articleCount: 0 },
    { name: "TAXI A&R Listings", email: "listings@taxi.com", outlet: "TAXI", genre: "All Genres, Sync", region: "US", beat: "A&R Listings", bio: "TAXI. Source: taxi.com.", articleCount: 0 },
    { name: "Ariel Hyatt (Cyber PR)", email: "ariel@cyberpr.com", outlet: "Cyber PR", genre: "Music Marketing, All Genres", region: "US", beat: "Founder", bio: "Cyber PR founder. Source: cyberpr.com.", articleCount: 0 },
    { name: "Sonicbids Blog", email: "editorial@sonicbids.com", outlet: "Sonicbids", genre: "Industry, Marketing, DIY", region: "US", beat: "Blog Contributions", bio: "Sonicbids. Source: sonicbids.com.", articleCount: 0 },
    { name: "Ari Herstand", email: "ari@ariherstand.com", outlet: "Ari's Take", genre: "Music Business, Marketing", region: "US", beat: "Founder", bio: "Ari's Take founder. Source: aristake.com.", articleCount: 0 },
    { name: "Ari's Take Info", email: "info@aristake.com", outlet: "Ari's Take", genre: "Music Business, Marketing", region: "US", beat: "Podcast Inquiries", bio: "Ari's Take. Source: aristake.com.", articleCount: 0 },
    { name: "Bobby Owsinski", email: "bobby@bobbyowsinski.com", outlet: "Bobby Owsinski / Music 3.0", genre: "Music Production, Business", region: "US", beat: "Author, Producer", bio: "Bobby Owsinski 24 books on music. Source: bobbyowsinski.com.", articleCount: 0 },

    // ── Music Business Worldwide ──────────────────────────────────────────
    { name: "Music Business Worldwide", email: "info@musicbusinessworldwide.com", outlet: "Music Business Worldwide", genre: "Industry, All Genres", region: "UK", beat: "Music Business News", bio: "Music Business Worldwide contact for industry news and press. Listed on musicbusinessworldwide.com/contact.", articleCount: 0 },
  ];

  const curators = [
    // ══════════════════════════════════════════════════════════════════════
    // SPOTIFY PLAYLIST CURATORS & SUBMISSION PLATFORMS
    // ══════════════════════════════════════════════════════════════════════

    // ── Indiemono ──────────────────────────────────────────────────────────
    { name: "Indiemono", email: "info@indiemono.com", outlet: "Indiemono Playlists", genre: "Indie, Alternative, Chill, Electronic", region: "Global", beat: "Indie Discovery, Chill", bio: "Independent Spotify playlist curator since 2011 with 100K+ followers. Free submission tool at indiemono.com. Based in Spain.", articleCount: 0 },

    // ── Obscure Sound ──────────────────────────────────────────────────────
    { name: "Mike Mineo (Obscure Sound)", email: "obscuresoundmail@gmail.com", outlet: "Obscure Sound", genre: "Indie, Rock, Electronic", region: "US", beat: "Indie Discovery, Playlists", bio: "Founder and editor of Obscure Sound since 2006. Also curates Spotify playlists. Use subject 'Obscure Sound Submission'. Listed on obscuresound.com/about/contact.", articleCount: 0 },

    // ── For The Love of Bands ──────────────────────────────────────────────
    { name: "For The Love of Bands", email: "info@fortheloveofbands.com", outlet: "For The Love of Bands", genre: "Indie, Folk, Alternative", region: "Global", beat: "Indie Playlists, Blog, Podcast", bio: "Indie music blog, Spotify playlist curator, and podcast. Use their official submission form for best results. Listed on fortheloveofbands.com.", articleCount: 0 },

    // ── Bolting Bits ───────────────────────────────────────────────────────
    { name: "Bolting Bits", email: "contact@boltingbits.com", outlet: "Bolting Bits", genre: "House, Techno, Jazz, Electronic", region: "Global", beat: "Electronic, Jazz Playlists", bio: "Music blog and playlist curator focused on house, techno, and jazz. Submission email publicly listed.", articleCount: 0 },

    // ── The Alternative ────────────────────────────────────────────────────
    { name: "The Alternative", email: "TheAltSubmissions@gmail.com", outlet: "The Alternative", genre: "Indie, Alternative, Emo, Punk", region: "US", beat: "Indie, Alternative Discovery", bio: "Music blog and playlist curator covering indie, alternative, emo, and punk. Public submission email.", articleCount: 0 },

    // ── Underground Hip Hop Blog ───────────────────────────────────────────
    { name: "Underground Hip Hop Blog", email: "UGHHBLOG@GMAIL.COM", outlet: "Underground Hip Hop Blog", genre: "Hip Hop, Rap", region: "US", beat: "Underground Hip Hop Playlists", bio: "Underground hip hop blog and playlist curator. Email for music consideration and advertising. Listed on undergroundhiphopblog.com/contact.", articleCount: 0 },

    // ── Tune Curator ───────────────────────────────────────────────────────
    { name: "Tune", email: "tunesubmissions@gmail.com", outlet: "Tune", genre: "Indie, Alternative, Experimental", region: "Global", beat: "Indie, Alternative Playlists", bio: "Independent Spotify playlist curator accepting indie, alternative, and experimental music submissions.", articleCount: 0 },

    // ── Gorilla vs Bear ───────────────────────────────────────────────────
    { name: "Chris (Gorilla vs Bear)", email: "chris@gorillavsbear.net", outlet: "Gorilla vs Bear", genre: "Indie, Alternative, Electronic", region: "US", beat: "Indie Discovery, Playlists", bio: "Founder/Editor of Gorilla vs. Bear, Texas-based indie music blog and playlist curator. Listed on gorillavsbear.net/contact.", articleCount: 0 },

    // ── KEXP Music Submissions ─────────────────────────────────────────────
    { name: "KEXP Music Department", email: "md@kexp.org", outlet: "KEXP", genre: "All Genres, Indie, World", region: "US", beat: "Radio Playlist, Music Discovery", bio: "KEXP Seattle public radio music department. Submit music for airplay and playlist consideration. Listed on kexp.org/about/submission-guidelines.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // SUBMISSION PLATFORMS (General Contact Emails)
    // ══════════════════════════════════════════════════════════════════════

    // ── SubmitHub ──────────────────────────────────────────────────────────
    { name: "SubmitHub", email: "jason@submithub.com", outlet: "SubmitHub", genre: "All Genres", region: "Global", beat: "Playlist Submission Platform", bio: "Jason Grishkoff, founder of SubmitHub. Platform connecting artists with playlist curators and bloggers. Listed on submithub.com.", articleCount: 0 },

    // ── Soundplate ────────────────────────────────────────────────────────
    { name: "Soundplate", email: "info@soundplate.com", outlet: "Soundplate", genre: "All Genres", region: "Global", beat: "Playlist Directory & Submission", bio: "Soundplate playlist directory and submission platform. Lists thousands of Spotify playlists. Listed on soundplate.com/contact.", articleCount: 0 },

    // ── MusoSoup ──────────────────────────────────────────────────────────
    { name: "MusoSoup", email: "hello@musosoup.com", outlet: "MusoSoup", genre: "All Genres", region: "Global", beat: "Music PR Platform", bio: "MusoSoup music promotion platform connecting artists with blogs, playlists, and podcasts. Listed on musosoup.com/contact.", articleCount: 0 },

    // ── Daily Playlists ───────────────────────────────────────────────────
    { name: "Daily Playlists", email: "info@dailyplaylists.com", outlet: "Daily Playlists", genre: "All Genres", region: "Global", beat: "Spotify Playlist Curation", bio: "Daily Playlists Spotify curation service. Listed on dailyplaylists.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // YOUTUBE MUSIC CHANNELS / CURATORS
    // ══════════════════════════════════════════════════════════════════════

    // ── Mr Suicide Sheep ──────────────────────────────────────────────────
    { name: "MrSuicideSheep", email: "sheepsubmissions@gmail.com", outlet: "MrSuicideSheep", genre: "Chill, Electronic, Ambient", region: "Global", beat: "Chill/Electronic Music Curation", bio: "MrSuicideSheep YouTube channel with 15M+ subscribers. Curates chill and electronic music. Submission email publicly listed.", articleCount: 0 },

    // ── Majestic Casual ───────────────────────────────────────────────────
    { name: "Majestic Casual", email: "info@majesticcasual.com", outlet: "Majestic Casual", genre: "Chill, Electronic, Hip Hop", region: "Global", beat: "Chill/Electronic Curation", bio: "Majestic Casual YouTube channel and label. Contact for submissions and inquiries. Listed on majesticcasual.com.", articleCount: 0 },

    // ── Proximity ─────────────────────────────────────────────────────────
    { name: "Proximity", email: "submissions@proximity.net", outlet: "Proximity", genre: "EDM, Future Bass, Electronic", region: "US", beat: "EDM Curation, Promotion", bio: "Proximity YouTube channel with millions of subscribers. EDM and electronic music curation. Listed on proximity.net.", articleCount: 0 },

    // ── Trap Nation ────────────────────────────────────────────────────────
    { name: "Trap Nation", email: "submissions@alltrapnation.com", outlet: "Trap Nation", genre: "Trap, EDM, Bass", region: "US", beat: "Trap/EDM Curation", bio: "Trap Nation YouTube channel with 30M+ subscribers. One of the largest electronic music YouTube channels. Submission email listed.", articleCount: 0 },

    // ── CloudKid ──────────────────────────────────────────────────────────
    { name: "CloudKid", email: "submissions@cloudkid.com", outlet: "CloudKid", genre: "Electronic, Chill, Indie", region: "Global", beat: "Electronic Music Curation", bio: "CloudKid YouTube music channel curating electronic and chill music. Submission email listed on cloudkid.com.", articleCount: 0 },

    // ── The Vibe Guide ────────────────────────────────────────────────────
    { name: "The Vibe Guide", email: "submissions@thevibeguide.com", outlet: "The Vibe Guide", genre: "Tropical, House, Chill", region: "Global", beat: "Tropical/Chill Curation", bio: "The Vibe Guide YouTube channel curating tropical house and chill music. Listed on thevibeguide.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // INDEPENDENT BLOG/PLAYLIST CURATORS
    // ══════════════════════════════════════════════════════════════════════

    // ── Indie Shuffle ─────────────────────────────────────────────────────
    { name: "Indie Shuffle", email: "submit@indieshuffle.com", outlet: "Indie Shuffle", genre: "Indie, Electronic, Pop", region: "Global", beat: "Indie Music Discovery", bio: "Indie Shuffle music discovery platform and playlist curator. Submission email listed on indieshuffle.com/contact.", articleCount: 0 },

    // ── Stereostickman ────────────────────────────────────────────────────
    { name: "Stereostickman", email: "info@stereostickman.com", outlet: "Stereostickman", genre: "Indie, Pop, Rock, Electronic", region: "UK", beat: "Music Reviews, Playlists", bio: "Independent music blog and playlist curator. Contact listed on stereostickman.com/contact.", articleCount: 0 },

    // ── Music Crowns ──────────────────────────────────────────────────────
    { name: "Music Crowns", email: "info@musiccrowns.org", outlet: "Music Crowns", genre: "Indie, Pop, Electronic", region: "UK", beat: "Music Discovery, Playlists", bio: "Music Crowns independent music platform and playlist curator. Listed on musiccrowns.org/contact.", articleCount: 0 },

    // ── Neon Music ────────────────────────────────────────────────────────
    { name: "Neon Music", email: "info@neonmusic.co.uk", outlet: "Neon Music", genre: "Pop, Indie, Dance", region: "UK", beat: "Pop/Indie Playlists", bio: "Neon Music UK-based music blog and playlist curator. Listed on neonmusic.co.uk/contact.", articleCount: 0 },

    // ── Le Future Wave ────────────────────────────────────────────────────
    { name: "Le Future Wave", email: "info@lefuturewave.com", outlet: "Le Future Wave", genre: "Indie, Electronic, R&B", region: "Global", beat: "Future Music Discovery", bio: "Le Future Wave music blog and playlist curator for indie, electronic, and R&B. Listed on lefuturewave.com/contact.", articleCount: 0 },

    // ── Chill Filtr ───────────────────────────────────────────────────────
    { name: "Chill Filtr", email: "info@chillfiltr.com", outlet: "Chill Filtr", genre: "Chill, Lo-Fi, Ambient", region: "Global", beat: "Chill/Lo-Fi Playlists", bio: "Chill Filtr playlist curator specializing in chill, lo-fi, and ambient music. Listed on chillfiltr.com.", articleCount: 0 },

    // ── Two Story Melody ──────────────────────────────────────────────────
    { name: "Two Story Melody", email: "info@twostorymelody.com", outlet: "Two Story Melody", genre: "Indie, Folk, Singer-Songwriter", region: "US", beat: "Indie/Folk Playlists & Blog", bio: "Two Story Melody indie music blog and Spotify playlist curator. Listed on twostorymelody.com.", articleCount: 0 },

    // ── Alfitude ──────────────────────────────────────────────────────────
    { name: "Alfitude", email: "alfitude@gmail.com", outlet: "Alfitude", genre: "Indie, Pop, Alternative", region: "Global", beat: "Indie Pop Playlists", bio: "Alfitude independent Spotify playlist curator for indie and pop music. Public submission email.", articleCount: 0 },

    // ── The DJ List ───────────────────────────────────────────────────────
    { name: "The DJ List", email: "info@thedjlist.com", outlet: "The DJ List", genre: "Electronic, House, Techno", region: "Global", beat: "DJ/Electronic Playlists", bio: "The DJ List electronic music directory and playlist platform. Listed on thedjlist.com.", articleCount: 0 },
    { name: "Howard Zhu", email: "howardzhumusic@gmail.com", outlet: "Independent Curator", genre: "Indie, Alternative, Dream Pop", region: "US", beat: "Indie Spotify Playlists", bio: "Independent Spotify playlist curator. Public submission email.", articleCount: 0 },
    { name: "Music Promotion USA", email: "submit@musicpromotionusa.com", outlet: "Music Promotion USA", genre: "All Genres", region: "US", beat: "Spotify Playlist Submissions", bio: "Curated Spotify playlist submission service. Listed on musicpromotionusa.com.", articleCount: 0 },
    { name: "Artist Union", email: "info@theartistunion.com", outlet: "The Artist Union", genre: "All Genres", region: "Global", beat: "SoundCloud Repost Network", bio: "The Artist Union SoundCloud repost platform. Listed on theartistunion.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // ADDITIONAL CURATORS — Spotify, YouTube, SoundCloud
    // ══════════════════════════════════════════════════════════════════════
    { name: "Spotify New Music Friday", email: "newmusicfriday@spotify.com", outlet: "Spotify Editorial", genre: "All Genres", region: "Global", beat: "Spotify Playlist", bio: "Spotify New Music Friday editorial playlist.", articleCount: 0 },
    { name: "Alex Rainbird Music", email: "alexrainbirdmusic@gmail.com", outlet: "Alex Rainbird Music", genre: "Indie, Folk, Acoustic", region: "UK", beat: "YouTube Indie Curator", bio: "Alex Rainbird Music YouTube channel with 1M+ subscribers. Public submission email.", articleCount: 0 },
    { name: "Koala Control", email: "koalacontrolmusic@gmail.com", outlet: "Koala Control", genre: "Chill, Indie, Electronic", region: "Global", beat: "YouTube Chill Curator", bio: "Koala Control YouTube chill music channel. Public email.", articleCount: 0 },
    { name: "Fluidified", email: "fluidified@gmail.com", outlet: "Fluidified", genre: "Chill, Lo-Fi, Electronic", region: "Global", beat: "YouTube Chill Curator", bio: "Fluidified YouTube chill/electronic channel. Public email.", articleCount: 0 },
    { name: "The Sound You Need", email: "thesoundyouneed@gmail.com", outlet: "The Sound You Need", genre: "Indie, Electronic, Chill", region: "Global", beat: "YouTube Music Curator", bio: "TSYN YouTube music curation channel. Public email.", articleCount: 0 },
    { name: "Cakes & Eclairs", email: "cakesandeclairs@gmail.com", outlet: "Cakes & Eclairs", genre: "Indie, Folk, Pop", region: "Global", beat: "Spotify/YouTube Curator", bio: "Cakes & Eclairs indie music curator. Public email.", articleCount: 0 },
    { name: "Wave Music", email: "submissions@wavemusic.co", outlet: "Wave Music", genre: "Electronic, Future Bass", region: "US", beat: "Electronic Curator", bio: "Wave Music electronic music curator. Listed on wavemusic.co.", articleCount: 0 },
    { name: "Selected.", email: "submissions@selectedbase.com", outlet: "Selected.", genre: "House, Deep House, Electronic", region: "UK", beat: "House Music Curator", bio: "Selected YouTube channel for house music. Listed on selectedbase.com.", articleCount: 0 },
    { name: "Chill Nation", email: "submissions@chillnation.com", outlet: "Chill Nation", genre: "Chill, Electronic, Pop", region: "US", beat: "Chill Music Curator", bio: "Chill Nation YouTube channel 7M+ subscribers. Listed on chillnation.com.", articleCount: 0 },
    { name: "Bass Nation", email: "submissions@bassnation.co", outlet: "Bass Nation", genre: "Bass, Dubstep, Trap", region: "US", beat: "Bass Music Curator", bio: "Bass Nation YouTube channel. Listed on bassnation.co.", articleCount: 0 },
    { name: "xKito Music", email: "xkitomusic@gmail.com", outlet: "xKito Music", genre: "Electronic, Future Bass, Melodic", region: "Global", beat: "Electronic Curator", bio: "xKito Music YouTube channel 2M+ subscribers. Public email.", articleCount: 0 },
    { name: "SuicideSheeep", email: "sheeppromotions@gmail.com", outlet: "SuicideSheep Promotions", genre: "Chill, Electronic", region: "Global", beat: "Music Promotions", bio: "MrSuicideSheep promotions email. Public email.", articleCount: 0 },
    { name: "R&B Season", email: "rnbseason@gmail.com", outlet: "R&B Season", genre: "R&B, Soul", region: "US", beat: "R&B Playlist Curator", bio: "R&B Season Spotify and YouTube curator. Public email.", articleCount: 0 },
    { name: "Country Thang Daily", email: "info@countrythangdaily.com", outlet: "Country Thang Daily", genre: "Country", region: "US", beat: "Country Playlist & Blog", bio: "Country Thang Daily country music platform. Listed on countrythangdaily.com.", articleCount: 0 },
    { name: "Metal Injection Playlist", email: "playlist@metalinjection.net", outlet: "Metal Injection", genre: "Metal", region: "US", beat: "Metal Playlist Curation", bio: "Metal Injection Spotify playlist submissions. Listed on metalinjection.net.", articleCount: 0 },
    { name: "Jazz Café", email: "info@thejazzcafe.co.uk", outlet: "Jazz Café", genre: "Jazz, Soul, World", region: "UK", beat: "Jazz/Soul Curation", bio: "Jazz Café London venue and curator. Listed on thejazzcafe.co.uk.", articleCount: 0 },
    { name: "Chillhop Music", email: "info@chillhop.com", outlet: "Chillhop Music", genre: "Lo-Fi, Chill, Hip Hop", region: "NL", beat: "Lo-Fi/Chill Curator & Label", bio: "Chillhop Music label and Spotify curator. Listed on chillhop.com.", articleCount: 0 },
    { name: "College Music", email: "submissions@clgmusic.com", outlet: "College Music", genre: "Indie, Pop, Electronic", region: "US", beat: "YouTube Music Curator", bio: "College Music YouTube channel 1M+ subscribers. Listed on clgmusic.com.", articleCount: 0 },
    { name: "Aux London", email: "info@auxlondon.com", outlet: "Aux London", genre: "Grime, UK Rap, R&B", region: "UK", beat: "UK Urban Curator", bio: "Aux London UK urban music platform. Listed on auxlondon.com.", articleCount: 0 },
    { name: "GRM Daily", email: "info@grmdaily.com", outlet: "GRM Daily", genre: "Grime, UK Rap, Drill", region: "UK", beat: "UK Rap/Grime Curator", bio: "GRM Daily UK's biggest urban music platform. Listed on grmdaily.com.", articleCount: 0 },
    { name: "Link Up TV", email: "info@linkuptv.co.uk", outlet: "Link Up TV", genre: "UK Rap, Grime, Drill", region: "UK", beat: "UK Rap Platform", bio: "Link Up TV UK urban music platform. Listed on linkuptv.co.uk.", articleCount: 0 },
    { name: "Folk Alley", email: "music@folkalley.com", outlet: "Folk Alley", genre: "Folk, Americana, Roots", region: "US", beat: "Folk Music Radio & Curator", bio: "Folk Alley WKSU folk music stream. Listed on folkalley.com.", articleCount: 0 },
    { name: "Reggae Vibes", email: "info@reggaevibes.com", outlet: "Reggae Vibes", genre: "Reggae, Dancehall, Dub", region: "Global", beat: "Reggae Music Curator", bio: "Reggae Vibes reggae music blog and curator. Listed on reggaevibes.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // NEW CURATORS — YouTube, SoundCloud, Platform
    // ══════════════════════════════════════════════════════════════════════
    { name: "NoCopyrightSounds", email: "hello@nocopyrightsounds.co.uk", outlet: "NCS", genre: "EDM, Electronic, Dance, Bass", region: "UK", beat: "Royalty-Free Electronic", bio: "NCS YouTube channel and label. Source: ncs.io/contact.", articleCount: 0 },
    { name: "Trap Nation (Andre)", email: "andre@nations.io", outlet: "Trap Nation", genre: "Trap, EDM, Hip Hop, Chill", region: "Global", beat: "YouTube Trap Curator", bio: "A&R for Trap Nation. Source: labelsbase.net.", articleCount: 0 },
    { name: "ThePrimeThanatos", email: "primethanatos@outlook.com", outlet: "ThePrimeThanatos", genre: "Synthwave, Retrowave, Cyberpunk", region: "Global", beat: "YouTube Synthwave Curator", bio: "YouTube synthwave/retrowave channel. Source: patreon.com.", articleCount: 0 },
    { name: "Promoting Sounds", email: "promotingsounds@gmail.com", outlet: "Promoting Sounds", genre: "EDM, Trap, Future Bass, Chill", region: "Global", beat: "SoundCloud/YouTube Curator", bio: "Music promotion channel. Source: bigcartel contact.", articleCount: 0 },
    { name: "Amazon Music Submissions", email: "music-submissions@amazon.com", outlet: "Amazon Music", genre: "All Genres", region: "Global", beat: "Amazon Music Playlists", bio: "Amazon Music playlist submissions. Source: multiple public sources.", articleCount: 0 },
    { name: "Musicto Curators", email: "submit@musicto.com", outlet: "Musicto", genre: "All Genres", region: "Global", beat: "Spotify & Apple Music Playlists", bio: "Independent playlist community 500+ playlists. Source: musicto.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // YOUTUBE MUSIC CHANNELS & LABELS
    // ══════════════════════════════════════════════════════════════════════
    { name: "MrSuicideSheep Demos", email: "demo@mrsuicidesheep.com", outlet: "MrSuicideSheep (YouTube)", genre: "Electronic, Chill, Alternative", region: "Global", beat: "YouTube Curator 15M+ subs", bio: "Source: mrsuicidesheep.com.", articleCount: 0 },
    { name: "MrSuicideSheep Contact", email: "contact@mrsuicidesheep.com", outlet: "MrSuicideSheep (YouTube)", genre: "Electronic, Chill, Alternative", region: "Global", beat: "General", bio: "Source: mrsuicidesheep.com.", articleCount: 0 },
    { name: "Seeking Blue Records", email: "info@seeking.blue", outlet: "Seeking Blue Records", genre: "Electronic, Indie-Electronic", region: "Global", beat: "Label from MrSuicideSheep", bio: "Source: seeking.blue/contact.", articleCount: 0 },
    { name: "Proximity (Blake)", email: "blake@prxmusic.com", outlet: "Proximity (YouTube)", genre: "Electronic, Future Bass, Dance", region: "US", beat: "YouTube Curator", bio: "Source: facebook.com/proximity.", articleCount: 0 },
    { name: "House Nation", email: "isac.jivhed@nations.io", outlet: "House Nation (YouTube)", genre: "House, Deep House, Dance", region: "Global", beat: "YouTube House Music", bio: "Part of Nations network. Source: labelradar.com.", articleCount: 0 },
    { name: "Trap City", email: "officialtrapcity@gmail.com", outlet: "Trap City (YouTube)", genre: "Trap, Future Bass, EDM", region: "Global", beat: "YouTube 14M+ subs", bio: "Source: labelsbase.net.", articleCount: 0 },
    { name: "MrRevillz Submissions", email: "info@mrrevillz.com", outlet: "MrRevillz (YouTube)", genre: "House, Dance, Electronic", region: "UK", beat: "YouTube Curator & Label", bio: "Source: mrrevillz.com.", articleCount: 0 },
    { name: "MrRevillz Business", email: "ashley@mrrevillz.com", outlet: "MrRevillz (YouTube)", genre: "House, Dance, Electronic", region: "UK", beat: "Business", bio: "Source: mrrevillz.com.", articleCount: 0 },
    { name: "IndieAir", email: "indieairsubmissions@gmail.com", outlet: "IndieAir (YouTube)", genre: "Alternative, Indie Rock, Indie Pop", region: "US", beat: "YouTube 1.4M subs", bio: "Public email.", articleCount: 0 },
    { name: "Bandit Tunes", email: "bandittunespromotions@gmail.com", outlet: "Bandit Tunes (YouTube)", genre: "Indie, Electronic, Chill", region: "Global", beat: "YouTube Curator", bio: "Public email.", articleCount: 0 },
    { name: "Monstercat Press", email: "press@monstercat.com", outlet: "Monstercat (YouTube/Label)", genre: "Electronic, EDM, Dubstep, DnB", region: "Global", beat: "Press 7.5M+ subs", bio: "Source: monstercat.com.", articleCount: 0 },
    { name: "Selected. Demos", email: "inbox@selectedbase.com", outlet: "Selected. (YouTube)", genre: "House, Deep House, Dance", region: "Global", beat: "YouTube/Label Berlin", bio: "Source: selectedbase.com.", articleCount: 0 },
    { name: "Selected. General", email: "info@selectedbase.com", outlet: "Selected. (YouTube)", genre: "House, Deep House, Dance", region: "Global", beat: "General", bio: "Source: soundcloud.com/selectedbase.", articleCount: 0 },
    { name: "La Belle Musique", email: "rubin@labellemusique.co", outlet: "La Belle Musique (YouTube)", genre: "Chill, Electronic, Indie, Pop", region: "Global", beat: "YouTube Curator", bio: "Source: groover.co.", articleCount: 0 },
    { name: "Majestic Casual (Nick)", email: "nick@majesticcasual.com", outlet: "Majestic Casual (YouTube)", genre: "Chill, Electronic, Indie, R&B", region: "Global", beat: "YouTube 4.3M subs", bio: "Source: majesticcasual.com.", articleCount: 0 },
    { name: "The Vibe Guide Alt", email: "info@thevibeguide.net", outlet: "The Vibe Guide (YouTube)", genre: "House, Dance, Electronic", region: "US", beat: "YouTube Lyric Videos", bio: "Source: thevibeguide.net.", articleCount: 0 },
    { name: "ElectroPose Submissions", email: "submission@electro-pose.com", outlet: "ElectroPose (YouTube)", genre: "Deep House, Nu Disco, Lounge", region: "Global", beat: "YouTube Curator", bio: "Source: electro-pose.com.", articleCount: 0 },
    { name: "ElectroPose Business", email: "contact@electro-pose.com", outlet: "ElectroPose (YouTube)", genre: "Deep House, Nu Disco, Lounge", region: "Global", beat: "Business", bio: "Source: electro-pose.com.", articleCount: 0 },
    { name: "Koala Kontrol", email: "koalakontrol@gmail.com", outlet: "Koala Kontrol (YouTube)", genre: "Indie Electronic, Alternative", region: "Global", beat: "YouTube 1.4M subs", bio: "Source: koalakontrol.com.", articleCount: 0 },
    { name: "CloudKid Hello", email: "hello@cloudkid.com", outlet: "CloudKid (YouTube)", genre: "Chill, Indie, Electronic", region: "Global", beat: "YouTube 4.7M subs", bio: "Source: cloudkid.com.", articleCount: 0 },
    { name: "CloudKid Sync", email: "sync@cldkid.com", outlet: "CloudKid (YouTube)", genre: "Chill, Indie, Electronic", region: "Global", beat: "Sync & Licensing", bio: "Source: soundcloud.com/cloudkid.", articleCount: 0 },
    { name: "Fluidified Contact", email: "contact@fluidified.com", outlet: "Fluidified (YouTube)", genre: "Chill, Electronic, Deep House", region: "Global", beat: "YouTube 850K subs", bio: "Public email.", articleCount: 0 },
    { name: "MrDeepSense", email: "contact@mrdeepsense.com", outlet: "MrDeepSense (YouTube)", genre: "Deep House, Nu Disco, House", region: "Global", beat: "YouTube Curator", bio: "Source: mrdeepsense.com.", articleCount: 0 },
    { name: "Nik Cooper", email: "info@nikcooper.com", outlet: "Nik Cooper Music (YouTube)", genre: "Electronic, EDM, House", region: "Global", beat: "YouTube 880K subs", bio: "Source: nikcooper.com.", articleCount: 0 },
    { name: "SwagyTracks", email: "swagytracks@gmail.com", outlet: "SwagyTracks (YouTube)", genre: "Hip Hop, Indie Hip Hop, R&B", region: "Global", beat: "YouTube Hip Hop Curator", bio: "Public email.", articleCount: 0 },
    { name: "Run The Trap Submit", email: "rttsubmit@gmail.com", outlet: "Run The Trap (YouTube)", genre: "Trap, EDM, Hip Hop, Bass", region: "US", beat: "Blog/YouTube Submissions", bio: "Source: runthetrap.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // SOUNDCLOUD REPOST NETWORKS
    // ══════════════════════════════════════════════════════════════════════
    { name: "HMWL PR", email: "pr@hmwl.org", outlet: "House Music With Love", genre: "Deep House, Afro House, Melodic House", region: "Global", beat: "SoundCloud 200+ channels 12M followers", bio: "Source: hmwl.org.", articleCount: 0 },
    { name: "HMWL Demos", email: "demos@hmwl.org", outlet: "House Music With Love", genre: "Deep House, Afro House, Melodic House", region: "Global", beat: "Demo Submissions", bio: "Source: housemusicwithlove.com.", articleCount: 0 },
    { name: "GANGSTER BASS", email: "gangsterbassofficial@gmail.com", outlet: "GANGSTER BASS (SoundCloud)", genre: "Trap, Bass, Hip Hop", region: "Global", beat: "SoundCloud/YouTube", bio: "Public email.", articleCount: 0 },
    { name: "GANGSTER TRAP", email: "pnwsgrp@gmail.com", outlet: "GANGSTER TRAP (SoundCloud)", genre: "Trap, Hip Hop", region: "Global", beat: "SoundCloud/YouTube", bio: "Public email.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // SPOTIFY PLAYLIST CURATORS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Promoting Sounds Spotify", email: "promotingsoundsspotify@gmail.com", outlet: "Promoting Sounds (Spotify)", genre: "Rap, Hip Hop, Trap, Lo-Fi", region: "Global", beat: "Spotify 20 playlists 1.9M followers", bio: "Source: jouzik.com.", articleCount: 0 },
    { name: "Today's Rap Hits", email: "todaysraphits@gmail.com", outlet: "Today's Rap Hits (Spotify)", genre: "Rap, Hip Hop, Trap", region: "US", beat: "Spotify Hip Hop Curator", bio: "Source: jouzik.com.", articleCount: 0 },
    { name: "The Buzz Network", email: "info@thebuzznetwork.net", outlet: "The Buzz Network (Spotify)", genre: "Afrobeats, Amapiano, Hip Hop", region: "Global", beat: "Spotify Curator", bio: "Source: thebuzznetwork.net.", articleCount: 0 },
    { name: "LoFi Cafe Records", email: "info@loficaferecords.com", outlet: "LoFi Cafe Records (Spotify)", genre: "Lo-Fi, Chillhop, Beats", region: "UK", beat: "Lo-Fi Label & Curator", bio: "Source: loficaferecords.com.", articleCount: 0 },
    { name: "Indiemono Hello", email: "hello@indiemono.com", outlet: "Indiemono (Spotify)", genre: "Indie, Alternative, Singer-Songwriter", region: "Global", beat: "Spotify Indie Curator", bio: "Source: indiemono.com.", articleCount: 0 },
    { name: "Eclipse Records Playlist", email: "info@eclipserecords.com", outlet: "Eclipse Records (Spotify)", genre: "Rock, Metal, Hard Rock, Punk", region: "US", beat: "Spotify Rock/Metal Curator", bio: "Source: eclipserecords.com.", articleCount: 0 },
    { name: "Stereofox", email: "hello@stereofox.com", outlet: "Stereofox (Spotify/YouTube)", genre: "Lo-Fi, Chill, Electronic, Indie", region: "Global", beat: "Music Discovery Platform", bio: "Source: stereofox.com.", articleCount: 0 },
    { name: "Ryan Celsius", email: "ryancelsius@gmail.com", outlet: "Ryan Celsius (YouTube/Spotify)", genre: "Lo-Fi, Underground Hip Hop", region: "US", beat: "Curator 3M+ monthly views", bio: "Public email.", articleCount: 0 },
    { name: "LoFi Fruits / Strange Fruits", email: "lofi@strangefruits.net", outlet: "LoFi Fruits (Spotify)", genre: "Lo-Fi, Chill, Deep House", region: "Global", beat: "Spotify 7.3M followers #1 indie curator", bio: "Source: strangefruits.net.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // LABELS WITH YOUTUBE/SPOTIFY PRESENCE
    // ══════════════════════════════════════════════════════════════════════
    { name: "Spinnin' Records Demos", email: "demo@spinninrecords.nl", outlet: "Spinnin' Records", genre: "EDM, House, Dance", region: "Global", beat: "Demo Submissions", bio: "Source: spinninrecords.nl.", articleCount: 0 },
    { name: "Spinnin' Records Info", email: "info@spinninrecords.nl", outlet: "Spinnin' Records", genre: "EDM, House, Dance", region: "Global", beat: "General", bio: "Source: spinninrecords.nl.", articleCount: 0 },
    { name: "Lofi Girl Music", email: "music@lofigirl.com", outlet: "Lofi Girl (YouTube)", genre: "Lo-Fi, Chill, Beats", region: "Global", beat: "YouTube Lo-Fi 6M+ subs", bio: "Source: lofigirl.com.", articleCount: 0 },
    { name: "Meaningwave/Akira The Don", email: "enquiries@meaningwave.com", outlet: "Akira The Don (YouTube)", genre: "Electronic, Meaningwave, Hip Hop", region: "UK", beat: "YouTube Creator", bio: "Source: akirathedon.com.", articleCount: 0 },
    { name: "Cakes & Eclairs Alt", email: "hello@soundicate.pro", outlet: "Cakes & Eclairs (YouTube)", genre: "Pop, Electronic, Lyric Videos", region: "US", beat: "YouTube Lyric Videos", bio: "Source: soundicate.pro.", articleCount: 0 },
    { name: "Steezyasfuck", email: "steezy@stzzzy.com", outlet: "Steezyasfuck (YouTube)", genre: "Lo-Fi, Instrumental Hip Hop", region: "US", beat: "YouTube/SC Curator LA", bio: "Source: stzzzy.com.", articleCount: 0 },
    { name: "Trap and Bass", email: "submissions@trapandbass.com", outlet: "Trap and Bass (YouTube)", genre: "Trap, Bass, Electronic", region: "Global", beat: "YouTube/SC/Spotify", bio: "Source: trapandbass.com.", articleCount: 0 },
    { name: "COLORS Studios", email: "submit@colorsxstudios.com", outlet: "COLORS Studios (YouTube)", genre: "All Genres, R&B, Hip Hop, Pop", region: "Global", beat: "YouTube 8M+ subs Berlin", bio: "Source: colorsxstudios.com.", articleCount: 0 },
    { name: "Tribal Trap", email: "submissions@tribaltrap.com", outlet: "Tribal Trap (YouTube)", genre: "Trap, Bass, Electronic", region: "Global", beat: "YouTube/Spotify Label", bio: "Source: tribaltrap.com.", articleCount: 0 },
    { name: "AirwaveMusicTV", email: "airwavemusictv@gmail.com", outlet: "AirwaveMusicTV (YouTube)", genre: "Electronic, EDM, Bass", region: "Global", beat: "YouTube 3M+ subs", bio: "Public email.", articleCount: 0 },
    { name: "TheSoundYouNeed", email: "tsyn.thesoundyouneed@gmail.com", outlet: "TheSoundYouNeed (YouTube)", genre: "Electronic, Indie, Chill", region: "Global", beat: "YouTube Curator", bio: "Public email.", articleCount: 0 },
    { name: "Wave Music YT", email: "wavemusicyt@gmail.com", outlet: "Wave Music (YouTube)", genre: "Chill, Electronic, Lo-Fi", region: "Global", beat: "YouTube/SC Curator", bio: "Public email.", articleCount: 0 },
    { name: "MixHound Music", email: "mixhoundmusicrecords@gmail.com", outlet: "MixHound (YouTube)", genre: "Chill, Electronic, Chillstep", region: "Global", beat: "YouTube/SC Curator & Label", bio: "Public email.", articleCount: 0 },
    { name: "Heldeep Records", email: "heldeepradio@gmail.com", outlet: "Heldeep Records", genre: "House, Future House, EDM", region: "Global", beat: "Oliver Heldens Label", bio: "Source: labelsbase.net.", articleCount: 0 },
    { name: "Future Classic", email: "info@futureclassic.us", outlet: "Future Classic", genre: "Electronic, Indie, Pop", region: "Global", beat: "Label (Flume, Chet Faker)", bio: "Source: futureclassic.us.", articleCount: 0 },
    { name: "Lowly", email: "hello@lowly.io", outlet: "Lowly (YouTube/Spotify)", genre: "Electronic, Indie Electronic", region: "US", beat: "Label from Trap Nation", bio: "Source: lowly.io.", articleCount: 0 },
    { name: "UKF Demos", email: "demos@ukf.com", outlet: "UKF (YouTube)", genre: "Dubstep, DnB, Bass, UKG", region: "UK", beat: "YouTube 6.1M subs", bio: "Source: ukf.com.", articleCount: 0 },
    { name: "Heldeep General", email: "info@oliverheldens.com", outlet: "Heldeep Records", genre: "House, Future House, EDM", region: "Global", beat: "General", bio: "Source: labelsbase.net.", articleCount: 0 },
    { name: "Aux London Alt", email: "hello@auxlondon.com", outlet: "Aux London (SC/Spotify)", genre: "Deep House, Melodic House", region: "UK", beat: "Online Magazine & Curator", bio: "Source: auxlondon.com.", articleCount: 0 },
  ];

  const blogs = [
    // ══════════════════════════════════════════════════════════════════════
    // INDIE / ALTERNATIVE BLOGS
    // ══════════════════════════════════════════════════════════════════════

    // ── Atwood Magazine ────────────────────────────────────────────────────
    { name: "Mitch Mosk (Atwood Magazine)", email: "mitch@atwoodmagazine.com", outlet: "Atwood Magazine", genre: "Indie, Alternative, Pop, Folk", region: "US", beat: "Indie Features, Reviews", bio: "Editor at Atwood Magazine. Keep pitches to 2-3 sentences with direct music links. Listed on atwoodmagazine.com/pitching-us.", articleCount: 0 },

    // ── Gorilla vs Bear ────────────────────────────────────────────────────
    { name: "Gorilla vs Bear Editorial", email: "chrismc99@gmail.com", outlet: "Gorilla vs Bear", genre: "Indie, Alternative, Electronic", region: "US", beat: "Indie Discovery", bio: "Founder Chris's public email for Gorilla vs Bear, the Texas-based indie music blog. Listed on gorillavsbear.net/contact.", articleCount: 0 },

    // ── Everything Is Noise ────────────────────────────────────────────────
    { name: "Toni 'Inter' Meese", email: "inter@everythingisnoise.net", outlet: "Everything Is Noise", genre: "Metal, Progressive, Experimental, Hip Hop", region: "Global", beat: "Press Inquiries, Submissions", bio: "Editor at Everything Is Noise covering metal, progressive, ambient, hip-hop, and experimental. Listed on everythingisnoise.net/contact.", articleCount: 0 },

    // ── The Wild Honey Pie ────────────────────────────────────────────────
    { name: "The Wild Honey Pie", email: "info@thewildhoneypie.com", outlet: "The Wild Honey Pie", genre: "Indie, Folk, Pop", region: "US", beat: "Indie Discovery, Sessions", bio: "The Wild Honey Pie indie music blog and session series. Contact listed on thewildhoneypie.com.", articleCount: 0 },

    // ── Ones To Watch ─────────────────────────────────────────────────────
    { name: "Ones To Watch", email: "info@onestowatch.com", outlet: "Ones To Watch", genre: "Indie, Pop, Hip Hop", region: "US", beat: "Emerging Artist Discovery", bio: "Ones To Watch (Live Nation) emerging artist platform. Contact listed on onestowatch.com.", articleCount: 0 },

    // ── Wonderland Magazine ───────────────────────────────────────────────
    { name: "Wonderland Magazine", email: "info@wonderlandmagazine.com", outlet: "Wonderland Magazine", genre: "Pop, Culture, Fashion", region: "UK", beat: "Music & Culture", bio: "Wonderland Magazine contact for music and culture features. Listed on wonderlandmagazine.com.", articleCount: 0 },

    // ── DIY Magazine Blog ─────────────────────────────────────────────────
    { name: "DIY Magazine Music", email: "music@diymag.com", outlet: "DIY Magazine", genre: "Indie, Rock, Pop", region: "UK", beat: "Music Blog, New Releases", bio: "DIY Magazine music section for new music coverage. Listed on diymag.com/contacts.", articleCount: 0 },

    // ── Clash Music Blog ──────────────────────────────────────────────────
    { name: "Clash Music Blog", email: "music@clashmusic.com", outlet: "Clash Magazine", genre: "Rock, Pop, Electronic, Indie", region: "UK", beat: "Music Blog Features", bio: "Clash Magazine music blog for new releases and features. Listed on clashmusic.com.", articleCount: 0 },

    // ── The 405 ────────────────────────────────────────────────────────────
    { name: "The 405", email: "info@thefourohfive.com", outlet: "The 405", genre: "Indie, Electronic, Pop", region: "UK", beat: "Music Discovery, Reviews", bio: "The 405 music blog for indie and electronic music discovery. Listed on thefourohfive.com.", articleCount: 0 },

    // ── When The Horn Blows ───────────────────────────────────────────────
    { name: "When The Horn Blows", email: "info@whenthehornblows.com", outlet: "When The Horn Blows", genre: "Hip Hop, R&B, Soul", region: "US", beat: "Hip Hop/R&B Blog", bio: "When The Horn Blows hip hop and R&B music blog. Contact listed on site.", articleCount: 0 },

    // ── Exclaim! ──────────────────────────────────────────────────────────
    { name: "Exclaim! Magazine", email: "editorial@exclaim.ca", outlet: "Exclaim!", genre: "Indie, Punk, Metal, Electronic", region: "CA", beat: "Canadian Music Coverage", bio: "Exclaim! Canadian music magazine editorial contact. Listed on exclaim.ca/contact.", articleCount: 0 },

    // ── Austin Chronicle Music ────────────────────────────────────────────
    { name: "Austin Chronicle Music", email: "music@austinchronicle.com", outlet: "Austin Chronicle", genre: "All Genres, Live Music", region: "US", beat: "Austin Music Scene", bio: "Austin Chronicle music section for local and touring artist coverage. Listed on austinchronicle.com/contact.", articleCount: 0 },

    // ── LA Weekly Music ───────────────────────────────────────────────────
    { name: "LA Weekly Music", email: "music@laweekly.com", outlet: "LA Weekly", genre: "All Genres", region: "US", beat: "LA Music Scene", bio: "LA Weekly music section for Los Angeles music coverage. Listed on laweekly.com/contact.", articleCount: 0 },

    // ── Chicago Reader Music ──────────────────────────────────────────────
    { name: "Chicago Reader Music", email: "music@chicagoreader.com", outlet: "Chicago Reader", genre: "All Genres", region: "US", beat: "Chicago Music Scene", bio: "Chicago Reader music section for Chicago music coverage. Listed on chicagoreader.com/contact.", articleCount: 0 },

    // ── Afropunk ──────────────────────────────────────────────────────────
    { name: "Afropunk", email: "info@afropunk.com", outlet: "Afropunk", genre: "Punk, Hip Hop, R&B, Alternative", region: "US", beat: "Black Alternative Culture", bio: "Afropunk general contact for music and culture press. Listed on afropunk.com.", articleCount: 0 },

    // ── Magnetic Magazine ─────────────────────────────────────────────────
    { name: "Magnetic Magazine", email: "info@magneticmag.com", outlet: "Magnetic Magazine", genre: "Electronic, House, Techno", region: "US", beat: "Electronic Music Blog", bio: "Magnetic Magazine contact for electronic music press. Listed on magneticmag.com.", articleCount: 0 },

    // ── Electronic Beats ──────────────────────────────────────────────────
    { name: "Electronic Beats", email: "info@electronicbeats.net", outlet: "Electronic Beats", genre: "Electronic, Techno, Experimental", region: "DE", beat: "Electronic Music & Culture", bio: "Electronic Beats (Telekom) electronic music and culture platform. Listed on electronicbeats.net.", articleCount: 0 },

    // ── Angry Metal Guy ───────────────────────────────────────────────────
    { name: "Angry Metal Guy", email: "angrymetalguy@gmail.com", outlet: "Angry Metal Guy", genre: "Metal, Progressive, Heavy", region: "Global", beat: "Metal Reviews", bio: "Angry Metal Guy metal music blog. One of the most respected metal review sites. Public email listed on angrymetalguy.com.", articleCount: 0 },

    // ── Heavy Blog Is Heavy ───────────────────────────────────────────────
    { name: "Heavy Blog Is Heavy", email: "heavyblog@gmail.com", outlet: "Heavy Blog Is Heavy", genre: "Metal, Progressive, Hardcore", region: "US", beat: "Heavy Music Blog", bio: "Heavy Blog Is Heavy progressive and heavy music blog. Contact listed on heavyblogisheavy.com/contact.", articleCount: 0 },

    // ── Dead Press! ───────────────────────────────────────────────────────
    { name: "Dead Press!", email: "editorial@deadpress.co.uk", outlet: "Dead Press!", genre: "Rock, Metal, Punk, Alternative", region: "UK", beat: "Rock/Metal Reviews", bio: "Dead Press! UK-based rock and metal music blog. Listed on deadpress.co.uk/about.", articleCount: 0 },

    // ── The PRP ───────────────────────────────────────────────────────────
    { name: "The PRP", email: "tips@theprp.com", outlet: "The PRP", genre: "Metal, Hardcore, Post-Hardcore", region: "US", beat: "Heavy Music News", bio: "The PRP heavy music news and reviews. Listed on theprp.com/contact.", articleCount: 0 },

    // ── Invisible Oranges ─────────────────────────────────────────────────
    { name: "Invisible Oranges", email: "submissions@invisibleoranges.com", outlet: "Invisible Oranges", genre: "Metal, Experimental, Heavy", region: "US", beat: "Metal Reviews, Features", bio: "Invisible Oranges metal and heavy music blog. Part of Townsquare Media. Listed on invisibleoranges.com.", articleCount: 0 },

    // ── Whiskey Riff ──────────────────────────────────────────────────────
    { name: "Whiskey Riff", email: "tips@whiskeyriff.com", outlet: "Whiskey Riff", genre: "Country, Americana, Southern Rock", region: "US", beat: "Country Music & Lifestyle", bio: "Whiskey Riff country music and lifestyle blog. Listed on whiskeyriff.com/contact.", articleCount: 0 },

    // ── Roughstock ────────────────────────────────────────────────────────
    { name: "Roughstock", email: "info@roughstock.com", outlet: "Roughstock", genre: "Country", region: "US", beat: "Country Music Reviews", bio: "Roughstock country music review site. Listed on roughstock.com/contact.", articleCount: 0 },

    // ── The Country Note ──────────────────────────────────────────────────
    { name: "The Country Note", email: "info@thecountrynote.com", outlet: "The Country Note", genre: "Country, Americana", region: "US", beat: "Country Music Blog", bio: "The Country Note country and Americana music blog. Listed on thecountrynote.com/contact.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // ADDITIONAL INDIE / ALT BLOGS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Impose Magazine", email: "info@imposemagazine.com", outlet: "Impose Magazine", genre: "Indie, Experimental, Noise", region: "US", beat: "Indie Reviews", bio: "Impose Magazine contact. Listed on imposemagazine.com.", articleCount: 0 },
    { name: "The Revue", email: "submit@therevue.ca", outlet: "The Revue", genre: "Indie, Folk, Singer-Songwriter", region: "CA", beat: "Indie Blog", bio: "The Revue Canadian indie music blog. Listed on therevue.ca.", articleCount: 0 },
    { name: "Nialler9", email: "niall@nialler9.com", outlet: "Nialler9", genre: "Indie, Electronic, Pop", region: "IE", beat: "Irish Music Blog", bio: "Nialler9 Irish indie music blog. Listed on nialler9.com.", articleCount: 0 },
    { name: "The Burning Ear", email: "info@theburningear.com", outlet: "The Burning Ear", genre: "Indie, Electronic, Chill", region: "US", beat: "Music Discovery", bio: "The Burning Ear music blog. Listed on theburningear.com.", articleCount: 0 },
    { name: "Hillydilly", email: "info@hillydilly.com", outlet: "Hillydilly", genre: "Indie, Electronic, Pop", region: "US", beat: "Music Discovery", bio: "Hillydilly music discovery blog. Listed on hillydilly.com.", articleCount: 0 },
    { name: "Picky Magazine", email: "hello@pickymagazine.com", outlet: "Picky Magazine", genre: "Indie, Pop, Electronic", region: "UK", beat: "New Music", bio: "Picky Magazine UK new music blog. Listed on pickymagazine.com.", articleCount: 0 },
    { name: "Cultura", email: "editorial@culturamag.com", outlet: "Cultura Magazine", genre: "Latin, Urban, Reggaeton", region: "US", beat: "Latin Urban Music", bio: "Cultura Magazine Latin music coverage. Listed on culturamag.com.", articleCount: 0 },
    { name: "Lyrical Lemonade", email: "info@lyricallemonade.com", outlet: "Lyrical Lemonade", genre: "Hip Hop, Rap, Pop", region: "US", beat: "Hip Hop, Music Videos", bio: "Lyrical Lemonade music/video platform founded by Cole Bennett. Listed on lyricallemonade.com.", articleCount: 0 },
    { name: "Dummy Mag", email: "info@dummymag.com", outlet: "Dummy Mag", genre: "Electronic, Club, Experimental", region: "UK", beat: "Electronic Music & Culture", bio: "Dummy Magazine UK electronic music publication. Listed on dummymag.com.", articleCount: 0 },
    { name: "The Vinyl Factory", email: "info@thevinylfactory.com", outlet: "The Vinyl Factory", genre: "All Genres, Vinyl, Art", region: "UK", beat: "Vinyl, Music & Art", bio: "The Vinyl Factory music and vinyl culture. Listed on thevinylfactory.com.", articleCount: 0 },
    { name: "Tiny Mix Tapes", email: "info@tinymixtapes.com", outlet: "Tiny Mix Tapes", genre: "Experimental, Ambient, Noise", region: "US", beat: "Experimental Music", bio: "Tiny Mix Tapes experimental music blog. Listed on tinymixtapes.com.", articleCount: 0 },
    { name: "Northern Transmissions", email: "submissions@northerntransmissions.com", outlet: "Northern Transmissions", genre: "Indie, Rock, Electronic", region: "CA", beat: "Indie Music Reviews", bio: "Northern Transmissions indie music blog. Listed on northerntransmissions.com.", articleCount: 0 },
    { name: "Post-Trash", email: "posttrashmusic@gmail.com", outlet: "Post-Trash", genre: "Punk, Noise, DIY", region: "US", beat: "DIY/Punk Coverage", bio: "Post-Trash DIY music blog. Public email.", articleCount: 0 },
    { name: "The Grey Estates", email: "thegreyestates@gmail.com", outlet: "The Grey Estates", genre: "Indie, Emo, Alternative", region: "US", beat: "Indie/Emo Blog", bio: "The Grey Estates indie and emo music blog. Public email.", articleCount: 0 },
    { name: "Beats Per Minute", email: "editor@beatsperminute.com", outlet: "Beats Per Minute", genre: "Indie, Electronic, Experimental", region: "US", beat: "Music Reviews", bio: "Beats Per Minute music review site. Listed on beatsperminute.com.", articleCount: 0 },
    { name: "Line of Best Fit Submissions", email: "submissions@thelineofbestfit.com", outlet: "The Line of Best Fit", genre: "Indie, Alternative", region: "UK", beat: "Music Submissions", bio: "The Line of Best Fit submission email. Listed on thelineofbestfit.com/contact.", articleCount: 0 },
    { name: "Clash Submissions", email: "submissions@clashmusic.com", outlet: "Clash Magazine", genre: "All Genres", region: "UK", beat: "Music Submissions", bio: "Clash Magazine submissions. Listed on clashmusic.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // ELECTRONIC / DANCE BLOGS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Stoney Roads", email: "info@stoneyroads.com", outlet: "Stoney Roads", genre: "Electronic, Dance, House", region: "AU", beat: "Australian Electronic", bio: "Stoney Roads Australian electronic music blog. Listed on stoneyroads.com.", articleCount: 0 },
    { name: "Deep House Amsterdam", email: "info@deephouseamsterdam.com", outlet: "Deep House Amsterdam", genre: "Deep House, Electronic", region: "NL", beat: "Deep House Curation", bio: "Deep House Amsterdam music blog and label. Listed on deephouseamsterdam.com.", articleCount: 0 },
    { name: "Nest HQ", email: "info@nesthq.com", outlet: "Nest HQ", genre: "Bass, Electronic, Trap", region: "US", beat: "Bass Music", bio: "Nest HQ (Skrillex's OWSLA) bass music platform. Listed on nesthq.com.", articleCount: 0 },
    { name: "Do Androids Dance", email: "info@doandroidsdance.com", outlet: "Do Androids Dance", genre: "EDM, Electronic, Dance", region: "US", beat: "EDM Blog", bio: "Do Androids Dance EDM blog. Listed on doandroidsdance.com.", articleCount: 0 },
    { name: "Data Transmission", email: "info@datatransmission.co", outlet: "Data Transmission", genre: "House, Techno, Electronic", region: "UK", beat: "Dance Music", bio: "Data Transmission UK dance music platform. Listed on datatransmission.co.", articleCount: 0 },
    { name: "Magnetic Magazine Submissions", email: "submissions@magneticmag.com", outlet: "Magnetic Magazine", genre: "Electronic, House", region: "US", beat: "Electronic Submissions", bio: "Magnetic Magazine submissions. Listed on magneticmag.com.", articleCount: 0 },
    { name: "EDM Sauce", email: "info@edmsauce.com", outlet: "EDM Sauce", genre: "EDM, Electronic, Festival", region: "US", beat: "EDM News & Reviews", bio: "EDM Sauce electronic music blog. Listed on edmsauce.com.", articleCount: 0 },
    { name: "We Rave You", email: "info@weraveyou.com", outlet: "We Rave You", genre: "EDM, House, Trance", region: "NL", beat: "EDM Blog & Curation", bio: "We Rave You EDM blog and Spotify curator. Listed on weraveyou.com.", articleCount: 0 },
    { name: "Tsugi Magazine", email: "redaction@tsugi.fr", outlet: "Tsugi", genre: "Electronic, Techno, Club", region: "FR", beat: "French Electronic Press", bio: "Tsugi French electronic music magazine. Listed on tsugi.fr.", articleCount: 0 },
    { name: "Inverted Audio", email: "info@invertedaudio.com", outlet: "Inverted Audio", genre: "Electronic, Ambient, Experimental", region: "UK", beat: "Electronic Reviews", bio: "Inverted Audio electronic music blog. Listed on invertedaudio.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // HIP HOP / R&B BLOGS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Soulection", email: "info@soulection.com", outlet: "Soulection", genre: "R&B, Soul, Future Beats", region: "US", beat: "Future Soul Curation", bio: "Soulection record label and radio show. Listed on soulection.com.", articleCount: 0 },
    { name: "Ones To Watch Hip Hop", email: "hiphop@onestowatch.com", outlet: "Ones To Watch", genre: "Hip Hop, Rap", region: "US", beat: "Emerging Hip Hop", bio: "Ones To Watch hip hop section. Listed on onestowatch.com.", articleCount: 0 },
    { name: "Mass Appeal", email: "info@massappeal.com", outlet: "Mass Appeal", genre: "Hip Hop, Culture", region: "US", beat: "Hip Hop & Culture", bio: "Mass Appeal Records/Media. Listed on massappeal.com.", articleCount: 0 },
    { name: "Noisey", email: "noisey@vice.com", outlet: "Noisey (Vice)", genre: "Hip Hop, Rock, All Genres", region: "US", beat: "Music Coverage", bio: "Noisey (Vice Media) music vertical. Listed on vice.com.", articleCount: 0 },
    { name: "Rap Season", email: "submissions@rapseason.com", outlet: "Rap Season", genre: "Hip Hop, Rap", region: "US", beat: "Hip Hop Blog", bio: "Rap Season hip hop blog. Listed on rapseason.com.", articleCount: 0 },
    { name: "Rated R&B", email: "info@ratedrnb.com", outlet: "Rated R&B", genre: "R&B, Soul", region: "US", beat: "R&B Coverage", bio: "Rated R&B dedicated R&B music blog. Listed on ratedrnb.com.", articleCount: 0 },
    { name: "Soul Bounce", email: "info@soulbounce.com", outlet: "Soul Bounce", genre: "R&B, Soul, Neo-Soul", region: "US", beat: "Soul Music Blog", bio: "Soul Bounce soul and R&B music blog. Listed on soulbounce.com.", articleCount: 0 },
    { name: "The Rap Fest", email: "info@therapfest.com", outlet: "The Rap Fest", genre: "Hip Hop, Rap", region: "US", beat: "Hip Hop Festival & Blog", bio: "The Rap Fest hip hop platform. Listed on therapfest.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // METAL / ROCK / PUNK BLOGS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Stereogum Metal", email: "metal@stereogum.com", outlet: "Stereogum", genre: "Metal, Heavy", region: "US", beat: "Metal Coverage", bio: "Stereogum metal section. Listed on stereogum.com.", articleCount: 0 },
    { name: "No Clean Singing", email: "submissions@nocleansinging.com", outlet: "No Clean Singing", genre: "Metal, Death Metal, Black Metal", region: "US", beat: "Extreme Metal Blog", bio: "No Clean Singing extreme metal blog. Listed on nocleansinging.com.", articleCount: 0 },
    { name: "The Obelisk", email: "theobelisk@gmail.com", outlet: "The Obelisk", genre: "Doom, Stoner, Heavy Rock", region: "US", beat: "Doom/Stoner Metal", bio: "The Obelisk doom and stoner metal blog. Public email.", articleCount: 0 },
    { name: "Decibel Magazine", email: "editorial@decibelmagazine.com", outlet: "Decibel Magazine", genre: "Metal, Extreme Metal", region: "US", beat: "Metal Magazine", bio: "Decibel Magazine editorial. Listed on decibelmagazine.com.", articleCount: 0 },
    { name: "Metal Hammer", email: "metalhammer@futurenet.com", outlet: "Metal Hammer", genre: "Metal, Rock, Punk", region: "UK", beat: "Metal Coverage", bio: "Metal Hammer magazine. Listed on loudersound.com/metal-hammer.", articleCount: 0 },
    { name: "Blabbermouth", email: "tips@blabbermouth.net", outlet: "Blabbermouth", genre: "Metal, Hard Rock", region: "US", beat: "Metal News", bio: "Blabbermouth metal news site. Listed on blabbermouth.net.", articleCount: 0 },
    { name: "Consequence Heavy", email: "heavy@consequence.net", outlet: "Consequence of Sound", genre: "Metal, Hard Rock, Punk", region: "US", beat: "Heavy Music", bio: "Consequence of Sound heavy music section. Listed on consequence.net.", articleCount: 0 },
    { name: "Pure Grain Audio", email: "info@puregrainaudio.com", outlet: "Pure Grain Audio", genre: "Rock, Metal, Punk", region: "CA", beat: "Rock/Metal Blog", bio: "Pure Grain Audio rock and metal blog. Listed on puregrainaudio.com.", articleCount: 0 },
    { name: "New Noise Magazine", email: "info@newnoisemagazine.com", outlet: "New Noise Magazine", genre: "Punk, Hardcore, Metal", region: "US", beat: "Punk/Hardcore Magazine", bio: "New Noise Magazine punk and hardcore. Listed on newnoisemagazine.com.", articleCount: 0 },
    { name: "Distorted Sound", email: "info@distortedsoundmag.com", outlet: "Distorted Sound", genre: "Metal, Prog, Rock", region: "UK", beat: "Metal Reviews", bio: "Distorted Sound UK metal magazine. Listed on distortedsoundmag.com.", articleCount: 0 },
    { name: "Rock Sound", email: "editorial@rocksound.tv", outlet: "Rock Sound", genre: "Rock, Pop Punk, Emo, Metal", region: "UK", beat: "Rock Magazine", bio: "Rock Sound UK rock magazine. Listed on rocksound.tv.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // INTERNATIONAL PUBLICATIONS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Music Feeds", email: "editorial@musicfeeds.com.au", outlet: "Music Feeds", genre: "All Genres", region: "AU", beat: "Australian Music", bio: "Music Feeds Australian music publication. Listed on musicfeeds.com.au.", articleCount: 0 },
    { name: "FBi Radio", email: "music@fbiradio.com", outlet: "FBi Radio", genre: "All Genres, Indie", region: "AU", beat: "Sydney Community Radio", bio: "FBi Radio Sydney community radio. Listed on fbiradio.com.", articleCount: 0 },
    { name: "Triple J Unearthed", email: "unearthed@abc.net.au", outlet: "Triple J Unearthed", genre: "All Genres", region: "AU", beat: "Australian New Music", bio: "Triple J Unearthed new music platform. Listed on abc.net.au/triplejunearthed.", articleCount: 0 },
    { name: "The Music (AU)", email: "editorial@themusic.com.au", outlet: "The Music", genre: "All Genres", region: "AU", beat: "Australian Music News", bio: "The Music Australian music publication. Listed on themusic.com.au.", articleCount: 0 },
    { name: "Music In Africa", email: "info@musicinafrica.net", outlet: "Music In Africa", genre: "African Music, World", region: "AF", beat: "African Music", bio: "Music In Africa pan-African music platform. Listed on musicinafrica.net.", articleCount: 0 },
    { name: "OkAfrica", email: "info@okayafrica.com", outlet: "OkayAfrica", genre: "Afrobeats, African Music", region: "US", beat: "African Music & Culture", bio: "OkayAfrica African music and culture. Listed on okayafrica.com.", articleCount: 0 },
    { name: "The Japan Times Music", email: "music@japantimes.co.jp", outlet: "Japan Times", genre: "J-Pop, All Genres", region: "JP", beat: "Japanese Music", bio: "Japan Times music section. Listed on japantimes.co.jp.", articleCount: 0 },
    { name: "K-Pop Herald", email: "kpop@heraldcorp.com", outlet: "Korea Herald", genre: "K-Pop, Korean Music", region: "KR", beat: "K-Pop Coverage", bio: "Korea Herald K-Pop section. Listed on koreaherald.com.", articleCount: 0 },
    { name: "Remezcla Music", email: "music@remezcla.com", outlet: "Remezcla", genre: "Latin, Reggaeton, Latin Pop", region: "US", beat: "Latin Music", bio: "Remezcla music section. Listed on remezcla.com.", articleCount: 0 },
    { name: "Grimy Goods", email: "info@grimygoods.com", outlet: "Grimy Goods", genre: "Indie, Rock, Electronic", region: "US", beat: "LA Music Blog", bio: "Grimy Goods LA music blog. Listed on grimygoods.com.", articleCount: 0 },
    { name: "Do512", email: "music@do512.com", outlet: "Do512", genre: "All Genres", region: "US", beat: "Austin Music Scene", bio: "Do512 Austin music and events. Listed on do512.com.", articleCount: 0 },
    { name: "OhMyRockness", email: "info@ohmyrockness.com", outlet: "Oh My Rockness", genre: "Indie, Rock, Live Music", region: "US", beat: "NYC/LA Shows", bio: "Oh My Rockness concert listing and blog. Listed on ohmyrockness.com.", articleCount: 0 },
    { name: "Bandsintown Editorial", email: "press@bandsintown.com", outlet: "Bandsintown", genre: "All Genres, Live Music", region: "US", beat: "Live Music Platform", bio: "Bandsintown press contact. Listed on bandsintown.com.", articleCount: 0 },
    { name: "Songkick Press", email: "press@songkick.com", outlet: "Songkick", genre: "All Genres, Live Music", region: "UK", beat: "Concert Discovery", bio: "Songkick press contact. Listed on songkick.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // COLLEGE RADIO & COMMUNITY STATIONS
    // ══════════════════════════════════════════════════════════════════════
    { name: "WFMU Music Director", email: "md@wfmu.org", outlet: "WFMU", genre: "All Genres, Freeform", region: "US", beat: "Freeform Radio", bio: "WFMU freeform radio music director. Listed on wfmu.org.", articleCount: 0 },
    { name: "WMBR Music Director", email: "music@wmbr.org", outlet: "WMBR (MIT)", genre: "All Genres", region: "US", beat: "MIT College Radio", bio: "WMBR MIT college radio music director. Listed on wmbr.org.", articleCount: 0 },
    { name: "KCRW Music", email: "music@kcrw.org", outlet: "KCRW", genre: "All Genres, Indie", region: "US", beat: "LA Public Radio", bio: "KCRW music department for airplay submissions. Listed on kcrw.org.", articleCount: 0 },
    { name: "KUTX Music Director", email: "md@kutx.org", outlet: "KUTX", genre: "All Genres", region: "US", beat: "Austin Public Radio", bio: "KUTX Austin public radio music director. Listed on kutx.org.", articleCount: 0 },
    { name: "WXPN Music Director", email: "music@wxpn.org", outlet: "WXPN", genre: "Indie, Folk, AAA", region: "US", beat: "Philly Public Radio", bio: "WXPN Philadelphia public radio music dept. Listed on wxpn.org.", articleCount: 0 },
    { name: "WUNC Music", email: "music@wunc.org", outlet: "WUNC", genre: "All Genres", region: "US", beat: "NC Public Radio", bio: "WUNC North Carolina public radio. Listed on wunc.org.", articleCount: 0 },
    { name: "WERS Music Director", email: "md@wers.org", outlet: "WERS (Emerson)", genre: "All Genres", region: "US", beat: "Boston College Radio", bio: "WERS Emerson College radio. Listed on wers.org.", articleCount: 0 },
    { name: "CHIRP Radio", email: "music@chirpradio.org", outlet: "CHIRP Radio", genre: "Indie, All Genres", region: "US", beat: "Chicago Community Radio", bio: "CHIRP Radio Chicago community radio. Listed on chirpradio.org.", articleCount: 0 },
    { name: "CKUT Radio", email: "music@ckut.ca", outlet: "CKUT (McGill)", genre: "All Genres", region: "CA", beat: "Montreal College Radio", bio: "CKUT McGill University radio. Listed on ckut.ca.", articleCount: 0 },
    { name: "CITR Radio", email: "music@citr.ca", outlet: "CiTR (UBC)", genre: "All Genres", region: "CA", beat: "Vancouver College Radio", bio: "CiTR UBC campus radio. Listed on citr.ca.", articleCount: 0 },
    { name: "BBC Radio 6 Music", email: "6music@bbc.co.uk", outlet: "BBC Radio 6 Music", genre: "Indie, Alternative, All Genres", region: "UK", beat: "UK Alternative Radio", bio: "BBC Radio 6 Music contact. Listed on bbc.co.uk/6music.", articleCount: 0 },
    { name: "Amazing Radio", email: "music@amazingradio.com", outlet: "Amazing Radio", genre: "Indie, All Genres", region: "UK", beat: "UK Indie Radio", bio: "Amazing Radio indie music station. Listed on amazingradio.com.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // AMERICANA / ROOTS / BLUES / COUNTRY BLOGS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Twangville Requests", email: "requests@twangville.com", outlet: "Twangville", genre: "Alt-Country, Americana, Folk, Blues", region: "US", beat: "Review Requests", bio: "Twangville review requests. Source: twangville.com.", articleCount: 0 },
    { name: "Twangville (Tom)", email: "tom@twangville.com", outlet: "Twangville", genre: "Alt-Country, Americana, Folk, Blues", region: "US", beat: "General", bio: "Twangville. Source: twangville.com.", articleCount: 0 },
    { name: "The Bluegrass Situation", email: "info@thebluegrasssituation.com", outlet: "The Bluegrass Situation", genre: "Bluegrass, Americana, Roots, Folk", region: "US", beat: "General & Submissions", bio: "The Bluegrass Situation. Source: thebluegrasssituation.com.", articleCount: 0 },
    { name: "The Bitter Southerner", email: "kyle@bittersoutherner.com", outlet: "The Bitter Southerner", genre: "Americana, Roots, Southern Culture", region: "US", beat: "Editorial & Press", bio: "The Bitter Southerner. Source: bittersoutherner.com.", articleCount: 0 },
    { name: "Linda Fahey (Folk Alley)", email: "linda@folkalley.com", outlet: "Folk Alley", genre: "Folk, Acoustic, Singer-Songwriter", region: "US", beat: "Music Director", bio: "Folk Alley music director. Source: folkalley.com.", articleCount: 0 },
    { name: "Hearth Music", email: "info@hearthmusic.com", outlet: "Hearth Music", genre: "Roots, Americana, World, Folk", region: "US", beat: "Booking & Submissions", bio: "Hearth Music. Source: hearthmusic.com.", articleCount: 0 },
    { name: "Blues Rock Review Ads", email: "advertising@bluesrockreview.com", outlet: "Blues Rock Review", genre: "Blues, Blues Rock", region: "US", beat: "Advertising", bio: "Blues Rock Review. Source: bluesrockreview.com.", articleCount: 0 },
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
    { name: "Andrew Morgan (Song Exploder Booking)", email: "andrew@groundcontroltouring.com", outlet: "Song Exploder / Ground Control Touring", genre: "All Genres", region: "US", beat: "Event Booking, Speaking", bio: "Booking agent for Song Exploder events. Listed on songexploder.net/about.", articleCount: 0 },

    // ══════════════════════════════════════════════════════════════════════
    // ADDITIONAL PODCASTERS
    // ══════════════════════════════════════════════════════════════════════
    { name: "Broken Record", email: "brokenrecordpodcast@gmail.com", outlet: "Broken Record", genre: "All Genres", region: "US", beat: "Artist Interviews", bio: "Broken Record with Rick Rubin, Malcolm Gladwell. Public email.", articleCount: 0 },
    { name: "Tape Notes", email: "hello@tapenotes.co.uk", outlet: "Tape Notes", genre: "All Genres", region: "UK", beat: "Album Making-Of", bio: "Tape Notes podcast about how albums are made. Listed on tapenotes.co.uk.", articleCount: 0 },
    { name: "Turning The Tables (NPR)", email: "turningthetables@npr.org", outlet: "NPR Turning The Tables", genre: "All Genres", region: "US", beat: "Music History & Discovery", bio: "NPR music podcast. Listed on npr.org.", articleCount: 0 },
    { name: "Louder Than A Riot (NPR)", email: "louderthanariot@npr.org", outlet: "NPR Louder Than A Riot", genre: "Hip Hop", region: "US", beat: "Hip Hop & Criminal Justice", bio: "NPR hip hop podcast. Listed on npr.org.", articleCount: 0 },
    { name: "Bandcamp Weekly", email: "editorial@bandcamp.com", outlet: "Bandcamp", genre: "All Genres, Indie", region: "US", beat: "Indie Music Podcast", bio: "Bandcamp Weekly podcast and editorial. Listed on bandcamp.com.", articleCount: 0 },
    { name: "Music Ally Podcast", email: "podcast@musically.com", outlet: "Music Ally", genre: "Industry", region: "UK", beat: "Music Industry Podcast", bio: "Music Ally industry podcast. Listed on musically.com.", articleCount: 0 },
    { name: "DIY Musician Podcast", email: "podcast@cdbaby.com", outlet: "CD Baby", genre: "All Genres, Indie", region: "US", beat: "DIY Music Advice", bio: "CD Baby DIY Musician Podcast. Listed on cdbaby.com.", articleCount: 0 },
    { name: "Music Industry Blueprint", email: "info@musicindustryblueprint.com", outlet: "Music Industry Blueprint", genre: "Industry", region: "US", beat: "Music Business Podcast", bio: "Music Industry Blueprint podcast. Listed on musicindustryblueprint.com.", articleCount: 0 },
    { name: "Noisegate Podcast", email: "hello@noisegate.com.au", outlet: "Noisegate", genre: "All Genres", region: "AU", beat: "Australian Music Podcast", bio: "Noisegate Australian music podcast. Listed on noisegate.com.au.", articleCount: 0 },
    { name: "The What Podcast", email: "thewhatpodcast@gmail.com", outlet: "The What Podcast", genre: "Jam, Rock, Festival", region: "US", beat: "Festival/Jam Podcast", bio: "The What Podcast festival and jam music. Public email.", articleCount: 0 },
    { name: "Kreative Kontrol", email: "vish@vishkhanna.com", outlet: "Kreative Kontrol", genre: "Indie, Rock, All Genres", region: "CA", beat: "Canadian Music Podcast", bio: "Kreative Kontrol with Vish Khanna. Listed on vishkhanna.com.", articleCount: 0 },
    { name: "A Waste of Time with ItsTheReal", email: "itsthereal@gmail.com", outlet: "ItsTheReal", genre: "Hip Hop, Comedy", region: "US", beat: "Hip Hop Interviews", bio: "ItsTheReal hip hop comedy podcast. Public email.", articleCount: 0 },
    { name: "Ongoing History of New Music", email: "alan@ajournalofmusicalthings.com", outlet: "Ongoing History", genre: "Alternative, Rock", region: "CA", beat: "Alt Rock History", bio: "Alan Cross Ongoing History podcast. Listed on ajournalofmusicalthings.com.", articleCount: 0 },
    { name: "Questlove Supreme", email: "questlovesupreme@gmail.com", outlet: "Questlove Supreme", genre: "All Genres, Soul, Hip Hop", region: "US", beat: "Music Interviews", bio: "Questlove Supreme podcast on iHeart. Public email.", articleCount: 0 },
    { name: "Popcast (NY Times)", email: "popcast@nytimes.com", outlet: "NY Times Popcast", genre: "Pop, All Genres", region: "US", beat: "Pop Music Analysis", bio: "NY Times Popcast music podcast. Listed on nytimes.com.", articleCount: 0 },
    { name: "Heat Rocks", email: "heatrockspod@gmail.com", outlet: "Heat Rocks", genre: "All Genres", region: "US", beat: "Album Deep Dives", bio: "Heat Rocks podcast album discussions. Public email.", articleCount: 0 },
    { name: "Punch Up The Jam", email: "punchupthejam@gmail.com", outlet: "Punch Up The Jam", genre: "Pop, All Genres", region: "US", beat: "Song Reimaginations", bio: "Punch Up The Jam music comedy podcast. Public email.", articleCount: 0 },
    { name: "No Dogs in Space", email: "nodogscast@gmail.com", outlet: "No Dogs in Space", genre: "Punk, Post-Punk, Alternative", region: "US", beat: "Music History", bio: "No Dogs in Space punk history podcast. Public email.", articleCount: 0 },
    { name: "Strong Songs", email: "strongsongspodcast@gmail.com", outlet: "Strong Songs", genre: "All Genres", region: "US", beat: "Song Analysis", bio: "Strong Songs music analysis podcast with Kirk Hamilton. Public email.", articleCount: 0 },
    { name: "Mic The Snare", email: "micthesnare@gmail.com", outlet: "Mic The Snare", genre: "All Genres", region: "US", beat: "Music Reviews, Deep Dives", bio: "Mic The Snare YouTube music review channel. Public email.", articleCount: 0 },
    { name: "Thomas D. Mooney", email: "thomasdmooney@gmail.com", outlet: "New Slang Podcast", genre: "Americana, Country, Folk, Singer-Songwriter", region: "US", beat: "Songwriter Interviews", bio: "New Slang Podcast host. Public email.", articleCount: 0 },
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

  // ─── Expanded Seed Contacts ─────────────────────────────────────────────
  console.log(`Seeding ${expandedContactCounts.total} expanded contacts (${expandedContactCounts.radio} radio, ${expandedContactCounts.journalist} journalist, ${expandedContactCounts.curator} curator, ${expandedContactCounts.podcaster} podcaster, ${expandedContactCounts.blog} blog)...`);

  let expandedUpserted = 0;
  for (const contact of expandedSeedContacts) {
    try {
      await prisma.contact.upsert({
        where: { id: contact.id },
        update: {
          name: contact.name,
          outlet: contact.outlet,
          type: contact.type,
          genre: contact.genre,
          region: contact.region,
          beat: contact.beat,
          bio: contact.bio,
          website: contact.website,
          articleCount: contact.articleCount,
        },
        create: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          outlet: contact.outlet,
          type: contact.type,
          genre: contact.genre,
          region: contact.region,
          beat: contact.beat,
          bio: contact.bio,
          website: contact.website,
          verified: contact.verified,
          articleCount: contact.articleCount,
        },
      });
      expandedUpserted++;
    } catch (err) {
      // skip duplicates or errors silently
    }
  }

  console.log(`Upserted ${expandedUpserted} expanded contacts`);

  // ─── Batch 2 Seed Contacts (Radio, Blogs, Journalists, Curators, Podcasters) ──
  const batch2Contacts = [
    ...radioSeedContacts,
    ...blogJournalistSeedContacts,
    ...curatorPodcasterSeedContacts,
  ];
  console.log(`Seeding ${batch2Contacts.length} batch 2 contacts (${radioSeedContacts.length} radio, ${blogJournalistSeedContacts.length} blogs+journalists, ${curatorPodcasterSeedContacts.length} curators+podcasters)...`);

  let batch2Upserted = 0;
  for (const contact of batch2Contacts) {
    try {
      await prisma.contact.upsert({
        where: { id: contact.id },
        update: {
          name: contact.name,
          outlet: contact.outlet,
          type: contact.type,
          genre: contact.genre,
          region: contact.region,
          beat: contact.beat,
          bio: contact.bio,
          website: contact.website,
          articleCount: contact.articleCount,
        },
        create: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          outlet: contact.outlet,
          type: contact.type,
          genre: contact.genre,
          region: contact.region,
          beat: contact.beat,
          bio: contact.bio,
          website: contact.website,
          verified: contact.verified,
          articleCount: contact.articleCount,
        },
      });
      batch2Upserted++;
    } catch (err) {
      // skip duplicates
    }
  }

  console.log(`Upserted ${batch2Upserted} batch 2 contacts`);

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

  // ─── Restore crawled contacts from backup (if available) ───────────────────
  const backupPath = path.resolve(__dirname, "contacts-backup.json");
  if (fs.existsSync(backupPath)) {
    console.log("Found contacts-backup.json — restoring crawled contacts...");
    const backupContacts = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
    let restored = 0;
    for (const c of backupContacts) {
      try {
        const exists = await prisma.contact.findUnique({ where: { id: c.id } });
        if (exists) continue;
        await prisma.contact.create({
          data: {
            id: c.id,
            name: c.name,
            email: c.email,
            outlet: c.outlet,
            type: c.type,
            genre: c.genre || null,
            region: c.region || null,
            beat: c.beat || null,
            phone: c.phone || null,
            twitter: c.twitter || null,
            instagram: c.instagram || null,
            linkedin: c.linkedin || null,
            website: c.website || null,
            bio: c.bio || null,
            avatarUrl: c.avatarUrl || null,
            verified: Boolean(c.verified),
            articleCount: Number(c.articleCount) || 0,
          },
        });
        restored++;
      } catch (err) {
        // skip duplicates or errors
        if (restored === 0 && c === backupContacts[0]) {
          console.log(`  First contact restore error: ${err}`);
        }
      }
    }
    console.log(`Restored ${restored} contacts from backup (${backupContacts.length} in file)`);
  } else {
    console.log("No contacts-backup.json found — run 'npm run crawl' to populate crawled contacts");
  }

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
