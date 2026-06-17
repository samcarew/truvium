#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { Issue } from "../types";

const contentDir = path.resolve("content/issues");
fs.mkdirSync(contentDir, { recursive: true });

const existingIssues = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".json"));

const nextNumber =
  existingIssues.reduce((max, f) => {
    const n = parseInt(f.replace("issue-", "").replace(".json", ""), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0) + 1;

const today = format(new Date(), "yyyy-MM-dd");
const filename = `issue-${String(nextNumber).padStart(3, "0")}.json`;

const scaffold: Issue = {
  issueNumber: nextNumber,
  date: today,
  subject: "TODO: Issue subject line",
  preheader: "TODO: One-line preheader",
  signals: [
    {
      type: "acquisition",
      headline: "TODO: Acquisition signal headline",
      body: "TODO: What's the operator or growth tactic? Why does it matter?",
      source: undefined,
      sourceLabel: undefined,
      tags: [],
    },
    {
      type: "brand",
      headline: "TODO: Brand move headline",
      body: "TODO: What did they do and why is it worth stealing?",
      source: undefined,
      sourceLabel: undefined,
      tags: [],
    },
    {
      type: "pattern",
      headline: "TODO: Market pattern headline",
      body: "TODO: What weird commercial behaviour or emerging market is this?",
      source: undefined,
      sourceLabel: undefined,
      tags: [],
    },
  ],
  footer: undefined,
};

const outPath = path.join(contentDir, filename);
fs.writeFileSync(outPath, JSON.stringify(scaffold, null, 2));
console.log(`Created: ${outPath}`);
