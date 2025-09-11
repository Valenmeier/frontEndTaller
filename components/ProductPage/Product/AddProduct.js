"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearProducto } from "../actions.js";
import AddProductDialog from "../dialogs/addProductDialog.js";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import styles from "../dialogs/modal.module.css";

export default function AddProductButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const handleSave = (data) => {
    startTransition(async () => {
      try {
        await crearProducto(data);
        setOpen(false);
        setToast({
          open: true,
          type: "success",
          title: "Producto creado",
          message: `Se creó ${data.nombre}`,
        });
        router.refresh();
      } catch (e) {
        console.error(e);
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo agregar Producto",
        });
      }
    });
  };

  return (
    <>
      <button
        className={styles.addUserFab}
        disabled={pending}
        onClick={() => setOpen(true)}
      >
        {pending ? "Agregando..." : "Agregar Producto"}
      </button>

      <AddProductDialog
        open={open}
        pending={pending}
        onCancel={() => setOpen(false)}
        onSave={handleSave}
      />

      <StatusToast {...toast} onClose={closeToast} />
    </>
  );
}
