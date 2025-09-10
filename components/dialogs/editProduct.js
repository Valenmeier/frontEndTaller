"use client";
import { useState } from "react";

export default function EditUserDialog({
  open,
  initialNombre = "",
  initialPrice,
  pending = false,
  onSave,
  onCancel,
}) {
  const [nombre, setNombre] = useState(initialNombre);
  const [precio, setPrecio] = useState(initialPrice);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = (nombre || "").trim();
    if (!trimmed) return alert("El nombre no puede estar vacío");
    onSave({ usuario: trimmed, rol });
  };

  return (
    <div role="dialog" aria-modal="true">
      <h4>Editar productos</h4>

      <div>
        <label>
          Producto:
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={pending}
          />
        </label>
      </div>

      <div>
        <label>
          Precio:
          <input
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            disabled={pending}
          />
        </label>
      </div>

      <div>
        <button disabled={pending} onClick={onCancel}>
          Cancelar
        </button>
        <button disabled={pending} onClick={handleSave}>
          {pending ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </div>
  );
}
