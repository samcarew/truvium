import { z } from "zod";

export const SignalTypeSchema = z.enum([
  "acquisition",   // operator/growth signal
  "brand",         // marketing move worth stealing
  "pattern",       // weird commercial behaviour or emerging market
]);

export type SignalType = z.infer<typeof SignalTypeSchema>;

export const SignalSchema = z.object({
  type: SignalTypeSchema,
  headline: z.string().min(1).max(120),
  body: z.string().min(1).max(600),
  source: z.string().url().optional(),
  sourceLabel: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type Signal = z.infer<typeof SignalSchema>;

export const IssueSchema = z.object({
  issueNumber: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),   // YYYY-MM-DD
  subject: z.string().min(1).max(150),
  preheader: z.string().max(200).optional(),
  signals: z.tuple([SignalSchema, SignalSchema, SignalSchema]),
  footer: z.string().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;

export const SIGNAL_LABELS: Record<SignalType, string> = {
  acquisition: "Acquisition Signal",
  brand:       "Brand Move",
  pattern:     "Market Pattern",
};

export const SIGNAL_DESCRIPTIONS: Record<SignalType, string> = {
  acquisition: "An operator or growth tactic worth watching",
  brand:       "A marketing move worth stealing",
  pattern:     "A weird commercial behaviour or emerging market",
};
