"use server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const validarToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("TokenJwt");
  if (!token) return { ok: false, payload: null };

  try {
    const payload = verify(token.value, process.env.JWT_SECRET);
    return { ok: true, payload, exp: payload.exp ?? null };
  } catch {
    return { ok: false, payload: null };
  }
};
export default validarToken;
