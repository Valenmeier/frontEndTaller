"use client";
import style from "./confirmDialogStyle.module.css";

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
    <div role="dialog" aria-modal="true" className={style.container} onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()} >
      <div className={style.dialog}>
        {title && <h4>{title}</h4>}
        {message && <p>{message}</p>}
        <div className={style.buttons}>
          <button disabled={pending} onClick={onCancel}>
            {cancelText}
          </button>
          <button disabled={pending} onClick={onConfirm}>
            {pending ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
