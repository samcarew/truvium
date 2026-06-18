import { Resend } from "resend";
import { Issue } from "../types";
import { renderHTMLEmail, renderPlainText } from "../templates/daily";

export interface Subscriber {
  email: string;
  name?: string;
}

export interface SendResult {
  email: string;
  id?: string;
  error?: string;
}

export async function sendIssue(
  issue: Issue,
  subscribers: Subscriber[],
  options: { dryRun?: boolean } = {}
): Promise<SendResult[]> {
  const html = renderHTMLEmail(issue);
  const text = renderPlainText(issue);
  const subject = issue.subject;
  const from = process.env.RESEND_FROM ?? "Truvium <hello@truvium.co>";

  if (options.dryRun) {
    console.log(`[dry-run] Would send "${subject}" to ${subscribers.length} subscriber(s)`);
    return subscribers.map((s) => ({ email: s.email, id: "dry-run" }));
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const resend = new Resend(apiKey);

  // Resend batch: max 100 per call
  const BATCH_SIZE = 100;
  const results: SendResult[] = [];

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);

    const { data, error } = await resend.batch.send(
      batch.map((s) => ({
        from,
        to: s.name ? `${s.name} <${s.email}>` : s.email,
        subject,
        html,
        text,
      }))
    );

    if (error) {
      batch.forEach((s) => results.push({ email: s.email, error: error.message }));
    } else {
      data?.data.forEach((d, idx) =>
        results.push({ email: batch[idx].email, id: d.id })
      );
    }
  }

  return results;
}
