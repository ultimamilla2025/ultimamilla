import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "../context/SessionWrapper";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/global/Navbar";

export const metadata: Metadata = {
  title: "Última Milla - Envíos del Futuro",
  description: "Plataforma de logística y envíos de última milla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <SessionWrapper>
            <Navbar />
            {children}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
