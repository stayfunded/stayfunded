"use client";

import { useMemo, useState } from "react";

export default function editor({
  id,
  initialText,
  email,
  firm,
  phase,
  intakeJson,
  screenshotUrls
}: {
  id: string;
  initialText: string;
  email: string;
  firm: string;
  phase: string;
  intakeJson: any;
  screenshotUrls: string[];
}) {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<null | "subject" | "body" | "both" | "packet">(null);

  const subject = useMemo(() => {
    const f = firm?.trim() || "your prop firm";
    const p = phase?.trim() || "phase";
    return `Strategy Analysis for your ${f} ${p} account`;
  }, [firm, phase]);

  const body = useMemo(() => {
    const f = firm?.trim() || "your prop firm";
    const p = phase?.trim() || "this phase";

    return `Hi,

I reviewed your Strategy Analysis request for your ${f} account in the ${p} phase.

This review looks at how the way you plan to trade interacts with the firm’s rules and the structure of this phase. It does not evaluate performance, predict outcomes, or recommend trades — it focuses on where strategies like this tend to quietly fail under real prop firm constraints.

———

${text || "[PASTE_FULL_STRATEGY_ANALYSIS_HERE]"}

———

What to do with this analysis:

This explains why this type of account structure tends to break — even when traders feel they’re executing well.

StayFunded exists to help traders apply this kind of rule-aware thinking across real prop firm accounts, with phase-specific playbooks and daily operating guidance designed around how prop firms actually evaluate accounts.

If you want to use this analysis inside a full system to manage and pass future prop firm accounts, create an account here:
https://stayfunded.io/signup

If you have questions about the analysis itself, reply directly.

— Ron
Founder, StayFunded
`;
  }, [firm, phase, text]);

  const intakePacket = useMemo(() => {
    const safeIntake = intakeJson ?? {};
    return `Firm: ${firm}
Phase: ${phase}
Email: ${email}

Intake JSON:
${JSON.stringify(safeIntake, null, 2)}

Screenshots:
${(screenshotUrls?.length ? screenshotUrls : ["(none)"]).map((u, i) => `${i + 1}) ${u}`).join("\n")}
`;
  }, [email, firm, phase, intakeJson, screenshotUrls]);

  async function save() {
    setSaving(true);

    const res = await fetch(`/api/admin/strategy-analyses/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysisText: text })
    });

    setSaving(false);

    if (!res.ok) {
      alert("Save failed.");
      return;
    }

    alert("Saved + marked sent.");
    window.location.reload();
  }

  async function copyToClipboard(value: string, which: "subject" | "body" | "both" | "packet") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      alert("Copy failed. Your browser may be blocking clipboard access.");
    }
  }

  return (
    <>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the full Strategy Analysis here…"
        style={{
          width: "100%",
          minHeight: 320,
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
          fontFamily: "inherit",
          fontSize: 14,
          lineHeight: 1.5
        }}
      />

      <button
        onClick={save}
        disabled={saving}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          fontWeight: 700,
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: "pointer"
        }}
      >
        {saving ? "Saving…" : "Save + Mark Sent"}
      </button>

      <hr style={{ margin: "24px 0" }} />

      <h3 style={{ margin: "0 0 8px 0" }}>Copy Intake Packet</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => copyToClipboard(intakePacket, "packet")}
          style={{
            padding: "8px 12px",
            fontWeight: 700,
            borderRadius: 8,
            border: "1px solid #ddd",
            cursor: "pointer"
          }}
        >
          {copied === "packet" ? "Copied" : "Copy Intake (Firm/Phase + JSON + Screenshots)"}
        </button>
      </div>

      <label style={{ fontSize: 13 }}>
        Packet preview
        <textarea
          readOnly
          value={intakePacket}
          rows={10}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            fontFamily: "inherit",
            fontSize: 13,
            lineHeight: 1.4,
            marginTop: 6
          }}
        />
      </label>

      <hr style={{ margin: "24px 0" }} />

      <h3 style={{ margin: "0 0 8px 0" }}>Copy Email</h3>

      <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
        To: <strong>{email}</strong>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ fontSize: 13 }}>
          Subject
          <input
            readOnly
            value={subject}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontFamily: "inherit",
              fontSize: 14
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => copyToClipboard(subject, "subject")}
            style={{
              padding: "8px 12px",
              fontWeight: 700,
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            {copied === "subject" ? "Copied" : "Copy Subject"}
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(body, "body")}
            style={{
              padding: "8px 12px",
              fontWeight: 700,
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            {copied === "body" ? "Copied" : "Copy Body"}
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(`${subject}\n\n${body}`, "both")}
            style={{
              padding: "8px 12px",
              fontWeight: 700,
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            {copied === "both" ? "Copied" : "Copy Subject + Body"}
          </button>
        </div>

        <label style={{ fontSize: 13 }}>
          Email body
          <textarea
            readOnly
            value={body}
            rows={14}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: 1.5
            }}
          />
        </label>
      </div>
    </>
  );
}
