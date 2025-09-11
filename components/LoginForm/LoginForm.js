"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import loginActions from "./actions.js";
import styles from "./loginPage.module.css";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import PollRefresher from "../refreshers/PollRefresher.js";

export default function LoginForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    type: "error",
    title: "",
    message: "",
  });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (!usuario.trim() || !contrasena.trim()) {
          setToast({
            open: true,
            type: "error",
            title: "Datos incompletos",
            message: "Ingresá usuario y contraseña.",
          });
          return;
        }

        const rol = await loginActions(usuario, contrasena);

        switch (rol) {
          case "ADMIN":
            router.push("/admin/usuarios");
            return;
          case "ENCARGADO":
            router.push("/vpp");
            return;
          case "CAJERO":
            router.push("/procesos");
            return;
          default:
            setToast({
              open: true,
              type: "error",
              title: "No se pudo iniciar sesión",
              message: String(rol || "Usuario o contraseña inválidos"),
            });
        }
      } catch (err) {
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: err?.message || "Ocurrió un error. Probá de nuevo.",
        });
      }
    });
  };

  return (
    <>
     <PollRefresher intervalMs={6000} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <Image
          src="/logodelplata.png"
          width={400}
          height={100}
          alt="Logo Del Plata"
          className="imagen"
        />

        <div>
          <label>
            <h1>Usuario:</h1>
            <input
              className={styles.input}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </label>

          <label>
            <h2>Contraseña:</h2>
            <input
              className={styles.input}
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </label>
        </div>

        <button className={styles.button} type="submit" disabled={pending}>
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <StatusToast {...toast} onClose={closeToast} />
    </>
  );
}
