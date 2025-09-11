import TokenAutoLogout from "@/hooks/TokenLogout.js";
import validarToken from "@/security/validarToken.js";
import { getProductos } from "../ProductPage/actions.js";
import VppClient from "./VppClient/VppClient.js";
import PollRefresher from "../refreshers/PollRefresher.js";


export default async function VppPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ENCARGADO") return <h1>No autorizado</h1>;

  const productos = await getProductos();

  return (
    <>
      <PollRefresher intervalMs={6000} />
      <TokenAutoLogout exp={exp} />
      <VppClient
        payload={payload}
        initialProductos={productos}
        cajeroONombreEncargado={payload.user}
      />
    </>
  );
}
