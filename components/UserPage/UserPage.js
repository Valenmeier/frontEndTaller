import validarToken from "../process/validarToken";

const UserPage = async () => {
  const { ok, payload } = await validarToken();

  return (
    <>
      {ok && payload.rol == "ADMIN" ? <h1>autorizado</h1> : <h1>No autorizado</h1>}
    </>
  );
};

export default UserPage;
