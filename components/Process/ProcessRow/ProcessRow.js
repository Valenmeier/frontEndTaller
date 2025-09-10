"use client";

export default function ProcesoRow({ proceso, rol, pending, onTicket, onConfirmar, onCancelar }) {
  const isProc = proceso.estado === "PROCESANDO";
  const canConfirm = rol === "CAJERO" && isProc;
  const canCancel = (rol === "CAJERO" || rol === "ENCARGADO") && isProc;

  return (
    <div>
      <div>{proceso.estado}</div>
      <div>{proceso.nroProceso}</div>
      <div>
        <a href={`/ticket/${proceso.nroProceso}`} target="BLANK" disabled={pending}>Ticket</a>
        <button disabled={pending || !canConfirm} onClick={onConfirmar}>Confirmar</button>
        <button disabled={pending || !canCancel} onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
