#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import { loadIssue } from "../lib/issue";
import { renderHTMLEmail, renderPlainText } from "../templates/daily";

const [, , inputFile, format = "html"] = process.argv;

if (!inputFile) {
  console.error("Usage: render <issue.json> [html|text]");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(path.resolve(inputFile), "utf8"));
const issue = loadIssue(raw);

if (format === "text") {
  console.log(renderPlainText(issue));
} else {
  console.log(renderHTMLEmail(issue));
}
