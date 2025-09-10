import validarToken from "@/security/validarToken";
import TokenAutoLogout from "@/hooks/TokenLogout";
import { getProcesosAll } from "./actions";
import ProcesosClient from "./ProcessClientes/ProcesosClientes";
import LogoutButton from "../Buttons/Logout";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProcesosPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || !["ENCARGADO", "CAJERO"].includes(payload.rol))
    return <h1>No autorizado</h1>;

  const procesos = await getProcesosAll();

  return (
    <>
      <TokenAutoLogout exp={exp} />
      <h1>Procesos</h1>
       {payload.rol == "ENCARGADO" ? (
              <Link href="/vpp">Ir a vpp</Link>
            ) : (
              ""
            )}
      <LogoutButton nombre={payload.user}></LogoutButton>

      <ProcesosClient initialProcesos={procesos} rol={payload.rol} />
    </>
  );
}
