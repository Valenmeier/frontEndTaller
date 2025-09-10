"use client";

import { useMemo, useState } from "react";
import AddUser from "../User/AddUser";
import User from "../User/User";

const ROLES = ["ALL", "ADMIN", "ENCARGADO", "CAJERO"];

export default function UsersClient({ initialUsuarios = [] }) {
  const [rol, setRol] = useState("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return initialUsuarios
      .filter((u) => (rol === "ALL" ? true : u.rol === rol))
      .filter((u) => (query ? (u.usuario || "").toLowerCase().includes(query) : true))
      .sort((a, b) => a.usuario.localeCompare(b.usuario));
  }, [initialUsuarios, rol, q]);

  return (
    <div>
      <div>
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <input
          placeholder="Buscar usuario"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <h3>No hay usuarios</h3>
      ) : (
        filtered.map((u) => (
          <User
            key={u.id ?? u.usuario}
            id={u.id}
            nombre={u.usuario}
            rol={u.rol}
          />
        ))
      )}

      <AddUser />
    </div>
  );
}
