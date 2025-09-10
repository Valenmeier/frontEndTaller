import TokenAutoLogout from "@/hooks/TokenLogout";
import validarToken from "../../security/validarToken";
import { getUsuarios } from "./actions";
import LogoutButton from "../Buttons/Logout";
import UsersClient from "./UserClient/UserClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ADMIN") return <h1>No autorizado</h1>;

  const usuarios = await getUsuarios();

  return (
    <>
      <TokenAutoLogout exp={exp} />
      <h1>Usuarios</h1>
      <Link href="/admin/productos">Ir a productos</Link>
      <LogoutButton nombre={payload.user} />
      <UsersClient initialUsuarios={usuarios} />
    </>
  );
}
