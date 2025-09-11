"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearProceso } from "../actions.js";
import StatusToast from "@/components/dialogs/statusToast/statusToast.js";
import LogoutButton from "@/components/Buttons/Logout.js";
import Link from "next/link";
import styles from "./vppClient.module.css";

const SECCIONES = [
  "Todas",
  "CARNES",
  "FRUTAS",
  "VERDURAS",
  "FIAMBRES",
  "PANADERIA",
];

export default function VppClient({
  initialProductos = [],
  cajeroONombreEncargado = "",
  payload,
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

  const [seccion, setSeccion] = useState("Todas");
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
        seccion === "Todas" ? true : (p.seccion || "").toUpperCase() === seccion
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

        if (created?.id) {
          window.open(`/ticket/${created.nroProceso}`, "_blank");
        }
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
    <div className={styles.wrapper}>
      <div className={styles.panelIzquierdo}>
        <div className={styles.filtros}>
          <input
            placeholder="Buscar producto  🔎︎"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div>
            <select
              className={styles.select}
              value={seccion}
              onChange={(e) => setSeccion(e.target.value)}
            >
              {SECCIONES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.lista}>
          {productos.length === 0 ? (
            <p>No hay productos</p>
          ) : (
            <>
              {productos.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)}>
                  <p>Producto: {p.nombre}</p> <p>Precio *kg: ${p.precioKg}</p>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className={styles.panelDerecho}>
        <Link href="/procesos">⟳ Ver procesos </Link>
        <h4> Producto: </h4>
        <h2> {selected ? selected.nombre : "-"}</h2>

        <h4>Peso:</h4>

        <input
          type="number"
          inputMode="decimal"
          placeholder="0"
          min={0}
          value={pesoStr}
          onChange={(e) => setPesoStr(e.target.value)}
          disabled={!selected || pending}
        />

        <h4>Precio total:</h4>
        <h2 className={styles.precioTotal}> ${total.toFixed(2)}</h2>

        <button
          className={`${styles.boton} ${
            canCreate ? styles.botonActivo : styles.botonInactivo
          }`}
          disabled={!canCreate || pending}
          onClick={onCreate}
        >
          {pending ? "Creando..." : "Imprimir ticket"}
          <a href=""></a>
        </button>
        <LogoutButton nombre={payload.user} />
      </div>

      {/* TOAST */}
      <StatusToast {...toast} onClose={closeToast} />
    </div>
  );
}
