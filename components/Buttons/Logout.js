"use client";
import { useState, useTransition } from "react";
import { logout } from "@/security/logout.js";
import ConfirmDialog from "../dialogs/confirmDialog/confirmDialog.js";
import Image from "next/image";
import styles from "./logout.module.css"

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
      <div className={styles.logoutContainer}>
        <h3 onClick={() => setOpen(true)}>{nombre}</h3>
        <Image
          onClick={() => setOpen(true)}
          src="/usericon.svg"
          alt="userMenu"
          width={40}
          height={40}
        />
      </div>
      <ConfirmDialog
        open={open}
        title="Cerrar sesión"
        message={`Seguro que quieres cerrar sesión de ${nombre}?`}
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={doLogout}
      />
    </>
  );
}
