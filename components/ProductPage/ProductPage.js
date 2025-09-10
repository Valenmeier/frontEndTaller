import TokenAutoLogout from "@/hooks/TokenLogout";
import validarToken from "../../security/validarToken";
import { getProductos } from "./actions";
import LogoutButton from "../Buttons/Logout";
import ProductsClient from "./ProductClient/ProductClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ADMIN") return <h1>No autorizado</h1>;

  // Traemos TODO una sola vez (sin filtros de back)
  const productos = await getProductos();

  return (
    <>
      <TokenAutoLogout exp={exp} />
      <h1>Productos</h1>
      <Link href="/admin/usuarios">Ir a usuarios</Link>
      <LogoutButton nombre={payload.user} />

      <ProductsClient initialProductos={productos} />
    </>
  );
}
