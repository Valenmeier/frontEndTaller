"use client";
import styles from "./processRowStyle.module.css";

export default function ProcesoRow({
  proceso,
  rol,
  pending,
  onTicket,
  onConfirmar,
  onCancelar,
}) {
  const isProc = proceso.estado === "PROCESANDO";
  const canConfirm = rol === "CAJERO" && isProc;
  const canCancel = (rol === "CAJERO" || rol === "ENCARGADO") && isProc;

  return (
    <div className={styles.wrapper}>
      <div>
        <h3>Estado: {proceso.estado}</h3>
      </div>
      <div>
        <h4>Nro Proceso= {proceso.nroProceso}</h4>
      </div>
      <div className={styles.buttons}>
        <button>
          <a
            href={`/ticket/${proceso.nroProceso}`}
            target="BLANK"
            disabled={pending}
          >
            Ticket
          </a>
        </button>
        <button disabled={pending || !canConfirm} onClick={onConfirmar}>
          Confirmar
        </button>
        <button disabled={pending || !canCancel} onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
