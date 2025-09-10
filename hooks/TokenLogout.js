"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function TokenAutoLogout({exp}) {
  useEffect(() => {
    if (!exp) return;

    const expMs = exp * 1000;
    const delay = expMs - Date.now();

    if (delay > 0) {
      const timer = setTimeout(() => {
        redirect("/");
      }, delay);

      return () => clearTimeout(timer);
    } else {
      redirect("/");
    }
  }, [exp]);

  return null;
}
