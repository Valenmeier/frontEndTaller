"use client";

import { useState } from "react";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const cancelarCarga = (e) => {
    e.preventDefault;
  };
  const enviarLogin = async () => {
    try {
      const dbUrl = process.env.NEXT_PUBLIC_DB_URL;
      const data = await fetch(dbUrl + "/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          contrasena,
        }),
      });
      const response = await data.json();
      console.log("respuesta" + response.user);
      console.log("respuesta" + response.token);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <form action={cancelarCarga}>
        <h1>Usuario</h1>
        <input
          type="text"
          placeholder="Ingrese su usuario"
          onChange={(e) => setUsuario(e.target.value)}
          required
          autoComplete="username"
        />
        <h2>Contraseña</h2>
        <input
          type="password"
          placeholder="Ingrese su contraseña"
          onChange={(e) => setContrasena(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error ? <h2>Error al ingresar usuario:{mensaje}</h2> : ""}
        <button onClick={enviarLogin}>Ingresar</button>
      </form>
    </>
  );
};

export default LoginForm;
