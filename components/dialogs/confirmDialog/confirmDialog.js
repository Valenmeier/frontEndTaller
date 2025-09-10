"use client";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  pending = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true">
      {title && <h4>{title}</h4>}
      {message && <p>{message}</p>}
      <div>
        <button disabled={pending} onClick={onCancel}>{cancelText}</button>
        <button disabled={pending} onClick={onConfirm}>
          {pending ? "Procesando..." : confirmText}
        </button>
      </div>
    </div>
  );
}
