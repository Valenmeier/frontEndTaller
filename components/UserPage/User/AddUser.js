"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearUsuario } from "../actions";
import AddUserDialog from "../dialogs/addUserDialog";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

export default function AddUserButton() {
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
        await crearUsuario(data);
        setOpen(false);
        setToast({
          open: true,
          type: "success",
          title: "Usuario creado",
          message: `Se creó ${data.usuario}`,
        });
        router.refresh();
      } catch (e) {
        console.error(e);
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo agregar usuario",
        });
      }
    });
  };

  return (
    <>
      <button disabled={pending} onClick={() => setOpen(true)}>
        {pending ? "Agregando..." : "Agregar usuario"}
      </button>

      <AddUserDialog
        open={open}
        pending={pending}
        onCancel={() => setOpen(false)}
        onSave={handleSave}
      />

      <StatusToast {...toast} onClose={closeToast} />
    </>
  );
}
