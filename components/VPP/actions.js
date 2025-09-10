"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_DB_URL || "";

async function authHeader() {
  const token = (await cookies()).get("TokenJwt")?.value;
  if (!token) throw new Error("No autenticado");
  return { Authorization: `Bearer ${token}` };
}

export async function crearProceso({ productoId, pesoKg }) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/procesos`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ productoId, pesoKg }),
    cache: "no-store",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "No se pudo crear el proceso");
  }
  // Si tenés caché/tag para procesos:
  try { revalidateTag("procesos"); } catch (_) {}
  return res.json(); 
}
