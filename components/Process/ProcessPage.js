import validarToken from "@/security/validarToken.js";
import TokenAutoLogout from "@/hooks/TokenLogout.js";
import { getProcesosAll } from "./actions";
import ProcesosClient from "./ProcessClientes/ProcesosClientes.js";
import LogoutButton from "../Buttons/Logout.js";
import Link from "next/link";
import styles from "./processStylesInicio.module.css";
import Image from "next/image";
import PollRefresher from "../refreshers/PollRefresher.js";



export default async function ProcesosPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || !["ENCARGADO", "CAJERO"].includes(payload.rol))
    return <h1>No autorizado</h1>;

  const procesos = await getProcesosAll();

  return (
    <>
      <PollRefresher ms={6000}/>
      <TokenAutoLogout exp={exp} />
      <section className={styles.headerContainer}>
        <Image src="/logodelplata.png" alt="logo" width={250} height={70} />
        {payload.rol == "ENCARGADO" ? <Link href="/vpp">Ir a vpp</Link> : ""}
        <LogoutButton nombre={payload.user} />
      </section>

      <ProcesosClient initialProcesos={procesos} rol={payload.rol} />
    </>
  );
}
