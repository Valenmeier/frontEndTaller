"use client";
import { useEffect, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

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
    <div role="dialog" aria-modal="true">
      <h4>Añadir usuario</h4>

      <div>
        <input
          placeholder="Ingrese el nombre del usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Ingrese la contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          disabled={pending}
        />
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
