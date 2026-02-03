"use client";

import { useEffect, useRef, useState } from "react";

export default function PendingWatcher() {
  const [pending, setPending] = useState<number>(0);
  const prev = useRef<number>(0);
  const notifiedOnce = useRef(false);

  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const res = await fetch("/api/admin/strategy-analyses/pending-count", {
          cache: "no-store"
        });
        if (!res.ok) return;

        const json = await res.json();
        const next = Number(json.pending ?? 0);

        if (!alive) return;

        // Notification logic (only when pending increases)
        if (next > prev.current) {
          // Ask permission only once per tab session
          if (!notifiedOnce.current && "Notification" in window) {
            notifiedOnce.current = true;
            if (Notification.permission === "default") {
              try {
                await Notification.requestPermission();
              } catch {}
            }
          }

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Strategy Analysis submitted", {
              body: `Pending requests: ${next}`
            });
          }
        }

        prev.current = next;
        setPending(next);

        // Update tab title
        document.title = next > 0
          ? `(${next}) Strategy Analysis Queue`
          : "Strategy Analysis Queue";
      } catch {
        // ignore
      }
    }

    // initial + interval
    tick();
    const id = setInterval(tick, 30_000);

    return () => {
      alive = false;
      clearInterval(id);
      document.title = "Strategy Analysis Queue";
    };
  }, []);

  // Optional small visual indicator on page
  return (
    <div style={{ marginTop: 8, color: "#555", fontSize: 13 }}>
      Pending: <strong>{pending}</strong> (auto-checks every 30s)
    </div>
  );
}
