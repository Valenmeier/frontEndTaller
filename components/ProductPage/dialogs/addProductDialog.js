"use client";
import { useEffect, useState } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import styles from "./modal.module.css";

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
    const trimmedPrice = price;
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
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
      onClick={() => !pending && onCancel?.()}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h4 id="add-product-title" className={styles.title}>
          Añadir Producto
        </h4>

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
              placeholder="Ingrese el nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={pending}
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span>Precio: </span>
            <input
              className={styles.input}
              type="number"
              placeholder="Ingrese el precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={pending}
            />
          </label>

          <label className={styles.field}>
            <span>Seccion:</span>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
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
