"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_DB_URL || "";

async function authHeader() {
  const token = (await cookies()).get("TokenJwt")?.value;
  if (!token) throw new Error("No autenticado");
  return { Authorization: `Bearer ${token}` };
}

export async function getProductos(seccion) {
  const headers = await authHeader();
  const qs =
    seccion && seccion.trim()
      ? `?seccion=${encodeURIComponent(seccion.trim())}`
      : "";
  const res = await fetch(`${BASE}/productos${qs}`, {
    headers,
    cache: "no-store",
    next: { tags: ["productos"] },
  });
  if (!res.ok) {
    throw new Error(
      `Error al obtener productos: ${await res.text().catch(() => "")}`
    );
  }
  return res.json();
}

export async function crearProducto(data) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/productos`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo crear producto");
  revalidateTag("productos");
  return res.json();
}

export async function actualizarProducto(id, data) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/productos/${id}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo actualizar producto");
  revalidateTag("productos");
  return res.json();
}

export async function eliminarProducto(id) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/productos/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("No se pudo eliminar producto");
  revalidateTag("productos");
  return res.text();
}
