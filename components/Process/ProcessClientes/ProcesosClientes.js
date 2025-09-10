"use client";

import { useMemo, useState, useTransition } from "react";
import { confirmarProceso, cancelarProceso, getTicket } from "../actions";
import ProcesoRow from "../ProcessRow/ProcessRow";
import ConfirmDialog from "@/components/dialogs/confirmDialog/confirmDialog";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

export default function ProcesosClient({ initialProcesos, rol }) {
  const [procesos, setProcesos] = useState(initialProcesos || []);
  const [estado, setEstado] = useState("ALL");
  const [q, setQ] = useState("");
  const [pending, startTransition] = useTransition();


  const [toast, setToast] = useState({ open: false, type: "info", title: "", message: "" });
  const closeToast = () => setToast(t => ({ ...t, open: false }));
  const showToast = (type, title, message) => setToast({ open: true, type, title, message });

  const [confirm, setConfirm] = useState({ open: false, tipo: null, nro: null });
  const askConfirmar = (nro) => setConfirm({ open: true, tipo: "CONFIRMAR", nro });
  const askCancelar  = (nro) => setConfirm({ open: true, tipo: "CANCELAR",  nro });
  const closeConfirm = () => setConfirm({ open: false, tipo: null, nro: null });

  const filtered = useMemo(() => {
    return (procesos || []).filter(p => {
      const okEstado = estado === "ALL" ? true : p.estado === estado;
      const okQ = q ? String(p.nroProceso).includes(q.trim()) : true;
      return okEstado && okQ;
    });
  }, [procesos, estado, q]);

  const handleConfirm = () => {
    const { tipo, nro } = confirm;
    if (!tipo || !nro) return;

    startTransition(async () => {
      const prev = procesos;
      setProcesos(prev => prev.map(p =>
        p.nroProceso === nro ? { ...p, estado: tipo === "CONFIRMAR" ? "FINALIZADO" : "CANCELADO" } : p
      ));

      try {
        if (tipo === "CONFIRMAR") {
          await confirmarProceso(nro);
          showToast("success", "Proceso confirmado", `#${nro} pasó a FINALIZADO`);
        } else {
          await cancelarProceso(nro);
          showToast("success", "Proceso cancelado", `#${nro} pasó a CANCELADO`);
        }
      } catch (e) {
        setProcesos(prev);
        showToast("error", "Operación fallida", e?.message || "No se pudo aplicar el cambio");
      } finally {
        closeConfirm();
      }
    });
  };

  const onTicket = async (nro) => {
    try {
      await getTicket(nro);
      showToast("success", "Ticket listo", `#${nro} generado`);
    } catch (e) {
      showToast("error", "No se pudo obtener el ticket", e?.message || "Error desconocido");
    }
  };

  return (
    <>

      <div>
        <select value={estado} onChange={(e)=>setEstado(e.target.value)}>
          <option value="ALL">Estado</option>
          <option value="PROCESANDO">PROCESANDO</option>
          <option value="FINALIZADO">FINALIZADO</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
        <input
          placeholder="Buscar Proceso"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>


      {filtered.length === 0 ? (
        <p>No hay procesos</p>
      ) : (
        filtered.map(p => (
          <ProcesoRow
            key={p.nroProceso}
            proceso={p}
            rol={rol}
            pending={pending}
            onConfirmar={() => askConfirmar(p.nroProceso)}
            onCancelar={() => askCancelar(p.nroProceso)}
            onTicket={() => onTicket(p.nroProceso)}
          />
        ))
      )}

      {/* Confirmación */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.tipo === "CONFIRMAR" ? "Confirmar proceso" : "Cancelar proceso"}
        message={
          confirm.tipo === "CONFIRMAR"
            ? `¿Confirmar el proceso #${confirm.nro}?`
            : `¿Cancelar el proceso #${confirm.nro}?`
        }
        confirmText={confirm.tipo === "CONFIRMAR" ? "Confirmar" : "Cancelar"}
        cancelText="Volver"
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      {/* Toast */}
      <StatusToast {...toast} onClose={closeToast} />
    </>
  );
}
