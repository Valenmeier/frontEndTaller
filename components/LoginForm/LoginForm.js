"use client";

import { useState } from "react";
import loginActions from "./actions";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const probarInicio = await loginActions(usuario, contrasena);

    switch (probarInicio) {
      case "ADMIN":
        redirect("/admin/usuarios");
      case "ENCARGADO":
        redirect("/vpp");

      case "CAJERO":
        redirect("/procesos");
      default:
        setMensaje(probarInicio);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={usuario} onChange={(e) => setUsuario(e.target.value)} />
      <input
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
