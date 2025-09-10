"use server";

import { cookies } from "next/headers";

const BASE = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_DB_URL || "";

async function authHeader() {
  const token = (await cookies()).get("TokenJwt")?.value;
  if (!token) throw new Error("No autenticado");
  return { Authorization: `Bearer ${token}` };
}


export async function getProcesosAll() {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/procesos`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo obtener procesos");
  return res.json();
}


export async function confirmarProceso(nro) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/procesos/${nro}/confirm`, { method: "PUT", headers });
  if (!res.ok) throw new Error(await res.text().catch(() => "No se pudo confirmar"));
  return res.json().catch(() => ({}));
}

export async function cancelarProceso(nro) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/procesos/${nro}/cancel`, { method: "PUT", headers });
  if (!res.ok) throw new Error(await res.text().catch(() => "No se pudo cancelar"));
  return res.json().catch(() => ({}));
}

export async function getTicket(nro) {
  const headers = await authHeader();
  const res = await fetch(`${BASE}/procesos/${nro}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text().catch(() => "No se pudo obtener el ticket"));
  return res.json();
}
