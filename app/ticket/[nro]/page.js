import validarToken from "@/security/validarToken.js";
import TokenAutoLogout from "@/hooks/TokenLogout.js";
import { getTicket } from "@/components/Ticket/actions.js";
import TicketClient from "@/components/Ticket/TicketClient.js";

export default async function Page({ params: paramsPromise }) {
  const { ok, payload, exp } = await validarToken();
  if (!ok || !["ENCARGADO", "CAJERO"].includes(payload.rol)) {
    return <h1>No autorizado</h1>;
  }

  const { nro } = await paramsPromise;
  if (!nro) return <h1>Falta nro de proceso</h1>;

  const ticket = await getTicket(nro);

  return (
    <>
      <TokenAutoLogout exp={exp} />
      {ticket ? (
        <TicketClient ticket={ticket} usuario={payload.user} />
      ) : (
        <h2>Ticket No encontrado</h2>
      )}
    </>
  );
}
