"use server";

import { cookies } from "next/headers";

const loginActions = async (usuario, contrasena) => {
  try {
    const dbUrl = process.env.NEXT_PUBLIC_DB_URL;
    const res = await fetch(dbUrl + "/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });

    const response = await res.json();

    if (res.ok) {
      const cookieStore = await cookies();
      cookieStore.set("TokenJwt", response.token, {
        maxAge: 60 * process.env.JWT_MIN,
        secure: true,
        // httpOnly: true,
      });
      return response.user.rol;
    } else {
      return response.error;
    }
  } catch (e) {
    console.error(e.message);
  }
};

export default loginActions;
