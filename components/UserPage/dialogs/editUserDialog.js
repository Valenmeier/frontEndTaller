"use client";
import { useEffect, useRef, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import style from "./editUser.module.css";

const ROLES = ["ADMIN", "ENCARGADO", "CAJERO"];

export default function EditUserDialog({
  open,
  initialNombre = "",
  initialRol = "CAJERO",
  pending = false,
  onSave,
  onCancel,
}) {
  const [nombre, setNombre] = useState(initialNombre);
  const [rol, setRol] = useState(initialRol);
  
  const [toast, setToast] = useState({
    open: false,
    type: "error",
    title: "Datos inválidos",
    message: "",
  });

  const inputRef = useRef(null);

  useEffect(() => {
    setNombre(initialNombre ?? "");
    setRol(initialRol ?? "CAJERO");
  }, [initialNombre, initialRol]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  if (!open) return null;

  const handleSave = () => {
    const trimmed = (nombre || "").trim();
    if (!trimmed) {
      setToast({ open: true, type: "error", title: "Datos inválidos", message: "El nombre no puede estar vacío" });
      return;
    }
    if (!ROLES.includes(rol)) {
      setToast({ open: true, type: "error", title: "Datos inválidos", message: "Rol inválido" });
      return;
    }
    onSave({ usuario: trimmed, rol });
  };

  return (
    <div
      className={style.modalOverlay}
      onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()} 
    >
      <div
        className={style.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
      >
        <h4 id="edit-user-title" className={style.title}>Editar usuario</h4>

        <div className={style.form}>
          <label className={style.field}>
            <span>Nombre</span>
            <input
              ref={inputRef}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={pending}
              className={style.input}
              placeholder="Nombre de usuario"
            />
          </label>

          <label className={style.field}>
            <span>Rol</span>
            <div className={style.selectWrapper}>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                disabled={pending}
                className={style.select}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className={style.actions}>
          <button className={style.btnCancel} disabled={pending} onClick={onCancel}>Cancelar</button>
          <button className={style.btnConfirm} disabled={pending} onClick={handleSave}>
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
