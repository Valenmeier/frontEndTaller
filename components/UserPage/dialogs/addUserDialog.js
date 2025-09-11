"use client";
import { useEffect, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import styles from "./modal.module.css";

const ROLES = ["ADMIN", "ENCARGADO", "CAJERO"];

export default function AddUserDialog({
  open,
  initialNombre = "",
  initialRol = "ADMIN",
  initialContrasena = "",
  pending = false,
  onSave,
  onCancel,
}) {
  const [nombre, setNombre] = useState(initialNombre);
  const [contrasena, setContrasena] = useState(initialContrasena);
  const [rol, setRol] = useState(initialRol);

  const [toast, setToast] = useState({
    open: false,
    type: "error",
    title: "Datos inválidos",
    message: "",
  });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    setNombre(initialNombre ?? "");
    setRol(initialRol ?? "");
    setContrasena(initialContrasena ?? "");
  }, [initialNombre, initialRol, initialContrasena]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !pending && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = (nombre || "").trim();
    if (!trimmed) {
      setToast({ open: true, type: "error", title: "Datos inválidos", message: "El nombre no puede estar vacío" });
      return;
    }
    const trimmedPass = (contrasena || "").trim();
    if (!trimmedPass) {
      setToast({ open: true, type: "error", title: "Datos inválidos", message: "La contraseña no puede estar vacía" });
      return;
    }
    if (!ROLES.includes(rol)) {
      setToast({ open: true, type: "error", title: "Datos inválidos", message: "Rol inválido" });
      return;
    }
    onSave({ usuario: trimmed, contrasena: trimmedPass, rol });
  };

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
      onClick={() => !pending && onCancel?.()}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h4 id="add-user-title" className={styles.title}>Añadir usuario</h4>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (!pending) handleSave();
          }}
        >
          <label className={styles.field}>
            <span>Nombre: </span>
            <input
              className={styles.input}
              placeholder="Ingrese el nombre del usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={pending}
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span>Contraseña: </span>
            <input
              className={styles.input}
              type="password"
              placeholder="Ingrese la contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={pending}
            />
          </label>

          <label className={styles.field}>
            <span>Rol:</span>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                disabled={pending}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnCancel}
              disabled={pending}
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnConfirm}
              disabled={pending}
            >
              {pending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>

        <StatusToast {...toast} onClose={closeToast} />
      </div>
    </div>
  );
}
