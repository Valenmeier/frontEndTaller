import LoginForm from "@/components/LoginForm/LoginForm.js";

export const metadata = {
  title: "TP Taller-Login",
  description: "Sistema Del Plata, login para ingresar usuario",
};

const ingresar = async (e) => {
  e.preventDefault();
  console.log("perfecto");
};

export default function Page() {
  return <LoginForm></LoginForm>;
}
