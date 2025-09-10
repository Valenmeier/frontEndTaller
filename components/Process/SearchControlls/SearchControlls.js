// app/procesos/SearchControlls/SearchControlls.jsx
"use client";

import { useEffect, useRef } from "react";

export default function SearchControls({ initialEstado = "ALL", initialQuery = "" }) {
  const formRef = useRef(null);

  // auto-submit cuando cambia el select
  const onEstadoChange = () => {
    if (formRef.current) formRef.current.requestSubmit();
  };

  return (
    <form ref={formRef} action="/procesos" method="GET">
      <select
        name="estado"
        defaultValue={initialEstado}
        onChange={onEstadoChange}
      >
        <option value="ALL">Estado</option>
        <option value="PROCESANDO">PROCESANDO</option>
        <option value="FINALIZADO">FINALIZADO</option>
        <option value="CANCELADO">CANCELADO</option>
      </select>

      <input
        name="q"
        placeholder="Buscar Proceso"
        defaultValue={initialQuery}
      />

      <button type="submit">Buscar</button>
    </form>
  );
}
