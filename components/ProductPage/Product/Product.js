"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { eliminarProducto, actualizarProducto } from "../actions.js";
import ConfirmDialog from "@/components/dialogs/confirmDialog/confirmDialog.js";
import EditProductDialog from "../dialogs/editProductDialog.js";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";

export default function Product({ id, nombre, price, seccion }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [toast, setToast] = useState({ open: false, type: "info", title: "", message: "" });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const confirmDelete = () => {
    startTransition(async () => {
      try {
        await eliminarProducto(id);
        setShowDelete(false);
        setToast({ open: true, type: "success", title: "Desactivado", message: `Se desactivó ${nombre}` });
        router.refresh();
      } catch (e) {
        console.error(e);
        const msg = e?.message || "No se pudo desactivar";
        setToast({ open: true, type: "error", title: "Error", message: msg });
      }
    });
  };

  const saveEdit = (data) => {
    startTransition(async () => {
      try {
        await actualizarProducto(id, data);
        setShowEdit(false);
        setToast({ open: true, type: "success", title: "Guardado", message: `Se actualizó: ${data.nombre}` });
        router.refresh();
      } catch (e) {
        console.error(e);
        setToast({ open: true, type: "error", title: "Error", message: e?.message || "No se pudo actualizar" });
      }
    });
  };

  return (
    <div>
      <h3>Producto: {nombre}</h3>
      <h4>Precio: {price}</h4>
      <h4>Sección: {seccion}</h4>
      <div>
        <button disabled={pending} onClick={() => setShowEdit(true)}>
          {pending && showEdit ? "Guardando..." : "Actualizar"}
        </button>
        <button disabled={pending} onClick={() => setShowDelete(true)}>
          {pending && showDelete ? "Desactivando..." : "Desactivar"}
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Confirmar desactivación"
        message={`¿Desactivar el producto: ${nombre}?`}
        pending={pending}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

      <EditProductDialog
        open={showEdit}
        initialNombre={nombre}
        initialPrice={price}
        pending={pending}
        onCancel={() => setShowEdit(false)}
        onSave={saveEdit}
      />

      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
