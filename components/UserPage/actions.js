"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_DB_URL || "";

async function authHeader() {
  const token = (await cookies()).get("TokenJwt")?.value;
  if (!token) throw new Error("No autenticado");
  return { Authorization: `Bearer ${token}` };
}

export async function getUsuarios() {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/usuarios`, {
    headers,
    cache: "no-store",
    next: { tags: ["usuarios"] }, 
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function crearUsuario(data) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/usuarios`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo crear usuario");
  revalidateTag("usuarios");
  return res.json();
}

export async function actualizarUsuario(id, data) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/usuarios/${id}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo actualizar usuario");
  revalidateTag("usuarios");
  return res.json();
}

export async function eliminarUsuario(id) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/usuarios/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("No se pudo eliminar usuario");
  revalidateTag("usuarios");
  return res.text();
}
