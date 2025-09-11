import TokenAutoLogout from "@/hooks/TokenLogout";
import validarToken from "../../security/validarToken.js";
import { getUsuarios } from "./actions.js";
import LogoutButton from "../Buttons/Logout.js";
import UsersClient from "./UserClient/UserClient.js";
import Link from "next/link";
import styles from "./userStylesInicio.module.css";
import Image from "next/image";
import PollRefresher from "../refreshers/PollRefresher.js";



export default async function UserPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ADMIN") return <h1>No autorizado</h1>;

  const usuarios = await getUsuarios();

  return (
    <>
      <PollRefresher intervalMs={6000} />
      <TokenAutoLogout exp={exp} />
      <section className={styles.headerContainer}>
        <Image src="/logodelplata.png" alt="logo" width={250} height={70} />
        <LogoutButton nombre={payload.user} />
        <Link href="/admin/productos">Ir a productos ➤</Link>
      </section>
      <UsersClient initialUsuarios={usuarios} />
    </>
  );
}
