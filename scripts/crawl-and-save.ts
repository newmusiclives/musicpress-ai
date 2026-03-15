/**
 * Standalone crawl script — runs the contact crawler pipeline,
 * imports contacts into the database, and saves a JSON backup
 * so contacts survive database resets.
 *
 * Usage:  npx tsx -r tsconfig-paths/register scripts/crawl-and-save.ts
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { runCrawlPipeline } from "@/lib/contact-crawler";

const prisma = new PrismaClient();

async function main() {
  console.log("=== TrueFans PRESS — Contact Crawler ===\n");

  const beforeCount = await prisma.contact.count();
  console.log(`Contacts in DB before crawl: ${beforeCount}\n`);
  console.log("Starting crawl pipeline (all sources)...\n");

  const result = await runCrawlPipeline("all", (msg: string) => {
    console.log(msg);
  });

  console.log("\n=== Crawl Complete ===");
  console.log(`Blogs discovered: ${result.blogsDiscovered}`);
  console.log(`Emails extracted: ${result.emailsExtracted}`);
  console.log(`Contacts imported: ${result.contactsImported}`);
  console.log(`Errors: ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log("\nFirst 10 errors:");
    result.errors.slice(0, 10).forEach((e: string) => console.log(`  - ${e}`));
  }

  // Export ALL contacts from DB to a backup JSON
  const allContacts = await prisma.contact.findMany({
    orderBy: { createdAt: "asc" },
  });

  const backupPath = path.resolve(__dirname, "../prisma/contacts-backup.json");
  fs.writeFileSync(backupPath, JSON.stringify(allContacts, null, 2));
  console.log(`\nSaved ${allContacts.length} total contacts to prisma/contacts-backup.json`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Crawl failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
