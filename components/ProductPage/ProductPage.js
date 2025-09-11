import TokenAutoLogout from "@/hooks/TokenLogout.js";
import validarToken from "../../security/validarToken.js";
import { getProductos } from "./actions.js";
import LogoutButton from "../Buttons/Logout.js";
import ProductsClient from "./ProductClient/ProductClient.js";
import Link from "next/link";
import styles from "./productStylesInicio.module.css";
import Image from "next/image";
import PollRefresher from "../refreshers/PollRefresher.js";



export default async function ProductPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ADMIN") return <h1>No autorizado</h1>;

  const productos = await getProductos();

  return (
    <>
      <PollRefresher intervalMs={6000} />
      <TokenAutoLogout exp={exp} />
      <section className={styles.headerContainer}>
        <Image src="/logodelplata.png" alt="logo" width={250} height={70} />
        <LogoutButton nombre={payload.user} />
        <Link href="/admin/usuarios">Ir a usuarios ➤</Link>
      </section>
      <ProductsClient initialProductos={productos} />
    </>
  );
}
