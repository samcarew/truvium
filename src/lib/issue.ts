import { Issue, IssueSchema } from "../types";

export function validateIssue(data: unknown): Issue {
  return IssueSchema.parse(data);
}

export function loadIssue(raw: unknown): Issue {
  return validateIssue(raw);
}
