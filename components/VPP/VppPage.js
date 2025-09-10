import TokenAutoLogout from "@/hooks/TokenLogout";
import validarToken from "@/security/validarToken";
import { getProductos } from "../ProductPage/actions";
import LogoutButton from "../Buttons/Logout";
import VppClient from "./VppClient/VppClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VppPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ENCARGADO") return <h1>No autorizado</h1>;

  const productos = await getProductos();

  return (
    <>
      <TokenAutoLogout exp={exp} />
      <h1>VPP</h1>
      <Link href="/procesos">Ir a procesos</Link>
      <LogoutButton nombre={payload.user} />
      <VppClient initialProductos={productos} cajeroONombreEncargado={payload.user} />
    </>
  );
}
