"use client";

import { useMemo, useState } from "react";
import Product from "../Product/Product.js";
import AddProduct from "../Product/AddProduct.js";
import styles from "./productClientStyles.module.css";

const SECCIONES = [
  "Todas",
  "CARNES",
  "FRUTAS",
  "VERDURAS",
  "FIAMBRES",
  "PANADERIA",
];

export default function ProductsClient({ initialProductos = [] }) {
  const [seccion, setSeccion] = useState("Todas");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (initialProductos || [])
      .filter((p) =>
        seccion === "Todas" ? true : (p.seccion || "").toUpperCase() === seccion
      )
      .filter((p) =>
        query ? (p.nombre || "").toLowerCase().includes(query) : true
      )

      .sort(
        (a, b) =>
          (a.seccion || "").localeCompare(b.seccion || "") ||
          (a.nombre || "").localeCompare(b.nombre || "")
      );
  }, [initialProductos, seccion, q]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerFiltroBusqueda}>
        <input
          placeholder="Buscar producto 🔎︎"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={seccion} onChange={(e) => setSeccion(e.target.value)}>
          {SECCIONES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.wrapperSecciones}>
        {filtered.length === 0 ? (
          <h3>No hay productos</h3>
        ) : (
          filtered.map((p) => (
            <Product
              key={p.id ?? p.nombre}
              id={p.id}
              nombre={p.nombre}
              price={p.precioKg}
              seccion={p.seccion}
            />
          ))
        )}
      </div>

      <AddProduct />
    </div>
  );
}
