// components/Ticket/TicketClient.jsx  (Client Component)
"use client";

export default function TicketClient({ ticket, usuario }) {
  const {
    nroProceso,
    estado,
    fecha,
    productoNombre,
    productoSeccion,
    precioUnitario,
    pesoKg,
    importeTotal,
  } = ticket || {};

  const fechaFmt = (() => {
    if (!fecha) return "-";
    const iso = fecha.includes(" ") ? fecha.replace(" ", "T") : fecha;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return fecha;
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  })();

  const estadoLabel = ({ PROCESANDO: "en proceso", CANCELADO: "Cancelado", FINALIZADO: "Pagado" }[estado] || estado);

  return (
    <div>
      <div><strong>Nro. de Proceso:</strong> {nroProceso}</div>
      <div><strong>Fecha:</strong> {fechaFmt}</div>
      <div><strong>Producto:</strong> {productoNombre}{productoSeccion ? ` (${productoSeccion})` : ""}</div>
      <div><strong>Precio*kg:</strong> ${Number(precioUnitario ?? 0).toFixed(2)}</div>
      <div><strong>Peso:</strong> {Number(pesoKg ?? 0).toFixed(3)} kg</div>
      <div><strong>Total:</strong> ${Number(importeTotal ?? 0).toFixed(2)}</div>
      <div><strong>Estado:</strong> {estadoLabel}</div>
      <div style={{ marginTop: 12 }}>
      </div>
    </div>
  );
}
