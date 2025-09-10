"use client";
import { useState, useTransition } from "react";
import { logout } from "@/security/logout";
import ConfirmDialog from "../dialogs/confirmDialog/confirmDialog";

export default function LogoutButton({ nombre }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const doLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>{nombre}</button>
      <ConfirmDialog
        open={open}
        title="Cerrar sesión"
        message={`seguro que quieres cerrar sesión de ${nombre}?`}
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={doLogout}
      />
    </>
  );
}
