"use client";
import { useEffect, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

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
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    setNombre(initialNombre ?? "");
    setRol(initialRol ?? "CAJERO");
  }, [initialNombre, initialRol]);

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
    <div role="dialog" aria-modal="true">
      <h4>Editar usuario</h4>

      <div>
        <label>
          Nombre:
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={pending}
          />
        </label>
      </div>

      <div>
        <label>
          Rol:
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            disabled={pending}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <button disabled={pending} onClick={onCancel}>Cancelar</button>
        <button disabled={pending} onClick={handleSave}>
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
