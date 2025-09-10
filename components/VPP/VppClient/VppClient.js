"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearProceso } from "../actions";
import StatusToast from "@/components/dialogs/statusToast/statusToast";

const SECCIONES = [
  "TODAS",
  "CARNES",
  "FRUTAS",
  "VERDURAS",
  "FIAMBRES",
  "PANADERIA",
];

export default function VppClient({
  initialProductos = [],
  cajeroONombreEncargado = "",
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [toast, setToast] = useState({
    open: false,
    type: "info", 
    title: "",
    message: "",
  });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));
  const showToast = (type, title, message) =>
    setToast({ open: true, type, title, message });


  const [seccion, setSeccion] = useState("TODAS");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [pesoStr, setPesoStr] = useState("");

  const peso = useMemo(() => {
    const v = parseFloat((pesoStr || "").replace(",", "."));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }, [pesoStr]);

  const productos = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (initialProductos || [])
      .filter((p) =>
        seccion === "TODAS" ? true : (p.seccion || "").toUpperCase() === seccion
      )
      .filter((p) =>
        query ? (p.nombre || "").toLowerCase().includes(query) : true
      )
      .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
  }, [initialProductos, seccion, q]);

  const total = useMemo(() => {
    if (!selected) return 0;
    const v = (selected.precioKg || 0) * (peso || 0);
    return Math.round(v * 100) / 100;
  }, [selected, peso]);

  const canCreate = !!selected && peso > 0;

  const onCreate = () => {
    if (!canCreate) {
      showToast(
        "error",
        "Datos faltantes",
        "Elegí un producto e ingresá un peso mayor a 0."
      );
      return;
    }
    startTransition(async () => {
      try {
        const created = await crearProceso({
          productoId: selected.id,
          pesoKg: peso,
        });
        showToast(
          "success",
          "Proceso creado",
          `#${created?.nroProceso ?? "-"} — ${selected.nombre} (${peso.toFixed(
            3
          )} kg)`
        );
      } catch (e) {
        showToast(
          "error",
          "No se pudo crear el proceso",
          e?.message || "Error desconocido"
        );
      }
    });
  };

  return (
    <>
      {/* Filtros */}
      <div>
        <select value={seccion} onChange={(e) => setSeccion(e.target.value)}>
          {SECCIONES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          placeholder="Buscar producto"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Lista */}
      <div>
        {productos.length === 0 ? (
          <p>No hay productos</p>
        ) : (
          <ul>
            {productos.map((p) => (
              <li key={p.id}>
                <button onClick={() => setSelected(p)}>
                  {p.nombre} — ${p.precioKg}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Panel derecho */}
      <div>
        <h3>Producto: {selected ? selected.nombre : "-"}</h3>
        <p>Precio/KG: {selected ? `$${selected.precioKg}` : "-"}</p>

        <label>
          Peso (kg):
          <input
            inputMode="decimal"
            placeholder="0.000"
            value={pesoStr}
            onChange={(e) => setPesoStr(e.target.value)}
            disabled={!selected || pending}
          />
        </label>

        <h3>Precio total: ${total.toFixed(2)}</h3>

        <button disabled={!canCreate || pending} onClick={onCreate}>
          {pending ? "Creando..." : "Imprimir ticket"}
        </button>
      </div>

      {/* TOAST */}
      <StatusToast {...toast} onClose={closeToast} />
    </>
  );
}
