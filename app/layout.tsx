import type { Metadata } from "next";
// Asumiendo que Geist y Poppins son imports válidos en tu entorno
import { Poppins } from "next/font/google";
import "./globals.css";

// 3. Poppins (Para títulos grandes "Gamer")
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameLens Dashboard",
  description: "Analytics for Gamers",
  // CAMBIO CLAVE: Agregando el icono SVG para el favicon
  icons: {
    icon: {
      url: '/Logo_Game.svg',
      type: 'image/svg+xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Inyectamos Poppins y el fondo oscuro base.
        // AGREGADO: 'selection:bg-pink-500/30' aquí para que sea global en toda la app.
        // AGREGADO: 'min-h-screen' para asegurar que el fondo cubra toda la pantalla siempre.
        className={`${poppins.variable} antialiased bg-[#131119] text-white selection:bg-pink-500/30 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}