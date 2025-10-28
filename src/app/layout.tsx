import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "../context/SessionWrapper";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/global/Navbar";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Última Milla - Envíos del Futuro",
  description: "Plataforma de logística y envíos de última milla",
};

const mainFont = localFont({
  src: [
    {
      path: "../fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-nunito-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={mainFont.className} suppressHydrationWarning>
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
