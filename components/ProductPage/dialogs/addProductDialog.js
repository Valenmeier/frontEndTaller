"use client";
import { useEffect, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

const SECCIONES = ["CARNES", "FRUTAS", "VERDURAS", "FIAMBRES", "PANADERIA"];

export default function AddProductDialog({
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
    setSeccion(initialSeccion ?? "");
    setPrice(initialPrice ?? "");
  }, [initialNombre, initialSeccion, initialPrice]);

  if (!open) return null;

  const handleSave = () => {
    const trimmed = (nombre || "").trim();
    if (!trimmed) {
      setToast({
        open: true,
        type: "error",
        title: "Datos inválidos",
        message: "El nombre no puede estar vacío",
      });
      return;
    }
    const trimmedPrice = price
    if (!trimmedPrice) {
      setToast({
        open: true,
        type: "error",
        title: "Datos inválidos",
        message: "El precio no puede estar vacio",
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

    onSave({ nombre: trimmed, precioKg: trimmedPrice, seccion });
  };

  return (
    <div role="dialog" aria-modal="true">
      <h4>Añadir Producto</h4>

      <div>
        <input
          placeholder="Ingrese el nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Ingrese el precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <label>
          Sección:
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
