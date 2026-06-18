#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import { loadIssue } from "../lib/issue";
import { sendIssue, Subscriber } from "../lib/sender";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const inputFile = args.find((a) => !a.startsWith("--"));

if (!inputFile) {
  console.error("Usage: send <issue.json> [--dry-run]");
  process.exit(1);
}

const subscribersPath = path.resolve("content/subscribers.json");
if (!fs.existsSync(subscribersPath)) {
  console.error(`No subscribers file found at ${subscribersPath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(path.resolve(inputFile), "utf8"));
const issue = loadIssue(raw);

const subscribers: Subscriber[] = JSON.parse(
  fs.readFileSync(subscribersPath, "utf8")
);

if (subscribers.length === 0) {
  console.error("Subscriber list is empty.");
  process.exit(1);
}

console.log(`Sending issue #${issue.issueNumber}: "${issue.subject}"`);
console.log(`Recipients: ${subscribers.length}`);
if (dryRun) console.log("Mode: dry-run (no emails will be sent)\n");

sendIssue(issue, subscribers, { dryRun })
  .then((results) => {
    const ok = results.filter((r) => !r.error);
    const failed = results.filter((r) => r.error);
    console.log(`\nSent: ${ok.length}  Failed: ${failed.length}`);
    failed.forEach((r) => console.error(`  FAILED ${r.email}: ${r.error}`));
    if (failed.length > 0) process.exit(1);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
