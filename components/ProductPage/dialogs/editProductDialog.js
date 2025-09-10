"use client";
import { useEffect, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

const SECCIONES = ["CARNES", "FRUTAS", "VERDURAS", "FIAMBRES", "PANADERIA"];

export default function EditProductDialog({
  open,
  initialNombre = "",
  initialSeccion = "CARNES",
  initialPrice = "",
  pending = false,
  onSave,
  onCancel,
}) {
  const [nombre, setNombre] = useState(initialNombre);
  const [price, setPrice] = useState(initialPrice);
  const [seccion, setSeccion] = useState(initialSeccion);

  const [toast, setToast] = useState({
    open: false,
    type: "error",
    title: "Datos inválidos",
    message: "",
  });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  useEffect(() => {
    setNombre(initialNombre ?? "");
    setSeccion(initialSeccion ?? "CARNES");
  }, [initialNombre, initialSeccion]);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = (nombre || "").trim();
    const trimmedPrice = price;
    if (!trimmed) {
      setToast({
        open: true,
        type: "error",
        title: "Datos inválidos",
        message: "El nombre no puede estar vacío",
      });
      return;
    }
    if (!SECCIONES.includes(seccion)) {
      setToast({
        open: true,
        type: "error",
        title: "Datos inválidos",
        message: "Seccion inválida",
      });
      return;
    }
    if (!trimmedPrice) {
      setToast({
        open: true,
        type: "error",
        title: "Datos inválidos",
        message: "El precio no puede estar vacío",
      });
      return;
    }
    onSave({ nombre: trimmed, precioKg: trimmedPrice, seccion });
  };

  return (
    <div seccion="dialog" aria-modal="true">
      <h4>Editar usuario</h4>

      <div>
        <label>
          Nombre:
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={pending}
            placeholder="ingrese el nuevo nombre"
          />
        </label>
      </div>
      <div>
        <label>
          Precio:
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={pending}
            placeholder="ingrese el nuevo precio"
          />
        </label>
      </div>
      <div>
        <label>
          Seccion:
          <select
            value={seccion}
            onChange={(e) => setSeccion(e.target.value)}
            disabled={pending}
          >
            {SECCIONES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <button disabled={pending} onClick={onCancel}>
          Cancelar
        </button>
        <button disabled={pending} onClick={handleSave}>
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
