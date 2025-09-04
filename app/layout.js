import "./globals.css";

export const metadata = {
  title: "TP Taller",
  description: "Sistema Del Plata",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }, 
      { url: "/favicon.ico", sizes: "any" },    
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body>
        <main> {children}</main>
      </body>
    </html>
  );
}
