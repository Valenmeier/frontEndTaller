"use client";
import { useEffect, useState, useRef } from "react";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import style from "./editProduct.module.css";

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

  const inputRef = useRef(null);

  useEffect(() => {
    setNombre(initialNombre ?? "");
    setSeccion(initialSeccion ?? "CARNES");
  }, [initialNombre, initialSeccion]);

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
        <h4 id="edit-user-title" className={style.title}>
          Editar producto
        </h4>

        <div className={style.form}>
          <label className={style.field}>
            <span>Producto</span>
            <input
              ref={inputRef}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={pending}
              className={style.input}
              placeholder="Nombre del producto"
            />
          </label>
          <label className={style.field}>
            <span>Precio</span>
            <input
              ref={inputRef}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={pending}
              className={style.input}
              placeholder="Precio del producto"
            />
          </label>

          <label className={style.field}>
            <span>Seccion</span>
            <div className={style.selectWrapper}>
              <select
                value={seccion}
                onChange={(e) => setSeccion(e.target.value)}
                disabled={pending}
                className={style.select}
              >
                {SECCIONES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

        <div className={style.actions}>
          <button
            className={style.btnCancel}
            disabled={pending}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={style.btnConfirm}
            disabled={pending}
            onClick={handleSave}
          >
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
