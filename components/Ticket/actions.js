"use server";
import { cookies } from "next/headers";

const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_DB_URL || "";

async function authHeader() {
  const token = (await cookies()).get("TokenJwt")?.value;
  if (!token) throw new Error("No autenticado");
  return { Authorization: `Bearer ${token}` };
}

export async function getTicket(nro) {
  if (!nro || !String(nro).trim()) throw new Error("Nro de proceso inválido");

  const headers = await authHeader();
  const res = await fetch(
    `${BASE}/procesos/${encodeURIComponent(String(nro).trim())}`,
    { headers, cache: "no-store" }
  );

  if (res.status === 404) return null;                

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "No se pudo obtener el ticket");
  }
  return res.json();
}
