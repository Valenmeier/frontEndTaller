import TokenAutoLogout from "@/hooks/TokenLogout";
import validarToken from "../../security/validarToken.js";
import { getProductos } from "./actions.js";
import Product from "./Product/Product.js";
import PollRefresher from "../refreshers/PollRefresher.js";
import LogoutButton from "../Buttons/Logout.js";
import AddProduct from "./Product/AddProduct.js";

export default async function ProductPage() {
  const { ok, payload, exp } = await validarToken();
  if (!ok || payload.rol !== "ADMIN") return <h1>No autorizado</h1>;

  const productos = await getProductos();

  return (
    <>
      <TokenAutoLogout exp={exp} />
      <PollRefresher intervalMs={15000} />

      <div>
        <h1>Productos:</h1>
        <a href="usuarios">Ir a usuarios</a>
        <LogoutButton nombre={payload.user}></LogoutButton>
      </div>
      {!productos || productos.length === 0 ? (
        <h1>No hay empleados</h1>
      ) : (
        productos.map((p) => (
          <Product
            key={p.id ?? p.nombre}
            id={p.id}
            nombre={p.nombre}
            price={p.precioKg}
            seccion={p.seccion}
          />
        ))
      )}
      <AddProduct></AddProduct>
    </>
  );
}
