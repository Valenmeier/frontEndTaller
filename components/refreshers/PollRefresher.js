"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PollRefresher({ intervalMs = 15000 }) {
  const router = useRouter();

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") {
        router.refresh(); 
      }
    };

    const id = setInterval(tick, intervalMs);
    const onVisible = () => router.refresh();

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, intervalMs]);

  return null;
}
