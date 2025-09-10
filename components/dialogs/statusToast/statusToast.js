"use client";
import { useEffect } from "react";

export default function StatusToast({
  open,
  type = "info",         
  title,
  message,
  duration = 2500,        
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose?.(), duration);
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(id); document.removeEventListener("keydown", onKey); };
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      style={{
        position: "fixed", right: 16, bottom: 16, zIndex: 1000,
        background: "#fff", border: "1px solid #ddd", padding: 12, maxWidth: 360
      }}
    >
      {title && <strong>{title}</strong>}
      {message && <div>{message}</div>}
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <button onClick={() => onClose?.()} aria-label="Cerrar">Cerrar</button>
      </div>
    </div>
  );
}
