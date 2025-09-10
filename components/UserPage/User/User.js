"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { eliminarUsuario, actualizarUsuario } from "../actions.js";
import ConfirmDialog from "@/components/dialogs/confirmDialog/confirmDialog.js";
import EditUserDialog from "../dialogs/editUserDialog.js";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";

export default function User({ id, nombre, rol }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const confirmDelete = () => {
    startTransition(async () => {
      try {
        await eliminarUsuario(id);
        setShowDelete(false);
        setToast({
          open: true,
          type: "success",
          title: "Eliminado",
          message: `Se eliminó ${nombre}`,
        });
        router.refresh();
      } catch (e) {
        console.error(e);
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo eliminar",
        });
      }
    });
  };

  const saveEdit = (data) => {
    startTransition(async () => {
      try {
        await actualizarUsuario(id, data); // { usuario, rol }
        setShowEdit(false);
        setToast({
          open: true,
          type: "success",
          title: "Guardado",
          message: `Se actualizó ${data.usuario}`,
        });
        router.refresh();
      } catch (e) {
        console.error(e);
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo actualizar",
        });
      }
    });
  };

  return (
    <div>
      <h3>Usuario: {nombre}</h3>
      <h4>Rol: {rol}</h4>
      <div>
        <button disabled={pending} onClick={() => setShowEdit(true)}>
          {pending && showEdit ? "Guardando..." : "Actualizar"}
        </button>
        <button disabled={pending} onClick={() => setShowDelete(true)}>
          {pending && showDelete ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Confirmar eliminación"
        message={`¿Eliminar al usuario: ${nombre}?`}
        pending={pending}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

      <EditUserDialog
        open={showEdit}
        initialNombre={nombre}
        initialRol={rol}
        pending={pending}
        onCancel={() => setShowEdit(false)}
        onSave={saveEdit}
      />

      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
