import { Issue, Signal, SIGNAL_LABELS } from "../types";

const SIGNAL_COLORS: Record<string, string> = {
  acquisition: "#0057FF",
  brand:       "#FF4500",
  pattern:     "#00A67E",
};

function renderSignal(signal: Signal, index: number): string {
  const label = SIGNAL_LABELS[signal.type];
  const color = SIGNAL_COLORS[signal.type];
  const source = signal.source
    ? `<p style="margin:8px 0 0;font-size:12px;color:#888;">
         Source: <a href="${signal.source}" style="color:#888;">${signal.sourceLabel ?? signal.source}</a>
       </p>`
    : "";

  return `
    <tr>
      <td style="padding:24px 0 0;">
        <span style="display:inline-block;background:${color};color:#fff;font-size:11px;font-weight:700;
                     letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border-radius:3px;">
          ${index + 1} — ${label}
        </span>
        <h2 style="margin:12px 0 8px;font-size:20px;font-weight:700;line-height:1.3;color:#111;">
          ${signal.headline}
        </h2>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#333;">
          ${signal.body}
        </p>
        ${source}
      </td>
    </tr>
    <tr>
      <td style="padding:20px 0 0;">
        <hr style="border:none;border-top:1px solid #eee;margin:0;" />
      </td>
    </tr>`;
}

export function renderHTMLEmail(issue: Issue): string {
  const signalRows = issue.signals.map((s, i) => renderSignal(s, i)).join("\n");
  const footer = issue.footer ?? "You're receiving this because you signed up for Truvium.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${issue.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:6px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#111;padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">TRUVIUM</span>
                  </td>
                  <td align="right">
                    <span style="color:#888;font-size:12px;">Issue #${issue.issueNumber} · ${issue.date}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subject / preheader -->
          <tr>
            <td style="padding:28px 32px 8px;">
              <h1 style="margin:0;font-size:26px;font-weight:800;line-height:1.25;color:#111;">
                ${issue.subject}
              </h1>
              ${issue.preheader ? `<p style="margin:10px 0 0;font-size:15px;color:#666;">${issue.preheader}</p>` : ""}
            </td>
          </tr>

          <!-- Signals -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${signalRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#999;line-height:1.5;">
                ${footer}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderPlainText(issue: Issue): string {
  const divider = "─".repeat(60);
  const signals = issue.signals.map((s, i) => {
    const label = SIGNAL_LABELS[s.type];
    const source = s.source ? `\nSource: ${s.source}` : "";
    return `${i + 1}. ${label.toUpperCase()}\n${s.headline}\n\n${s.body}${source}`;
  }).join(`\n\n${divider}\n\n`);

  return [
    `TRUVIUM — Issue #${issue.issueNumber} · ${issue.date}`,
    divider,
    issue.subject,
    issue.preheader ?? "",
    "",
    divider,
    "",
    signals,
    "",
    divider,
    issue.footer ?? "You're receiving this because you signed up for Truvium.",
  ].join("\n");
}
