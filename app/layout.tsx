// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";                    // ← tus estilos globales (Tailwind)
import "@/components/loader.css";
import { MsalClientProvider } from "@/components/msal-client-provider";
import NavbarWrapper from "@/components/navbar-wrapper";
import { getSession, UserSessionData } from "@/lib/session-utils";

/* ---- Fuentes de Google ---- */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Portal de auditores - IGC",
  description: "Portal de auditores",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---- Lee la sesión y quita el Date exp ---- */
  const session = await getSession();               // { …, exp: Date }
  const { exp: _discard, ...safe } = session ?? {}; // quitamos exp
  const serializableSession = session ? (safe as UserSessionData) : null;

  /* ---- html + body OBLIGATORIOS + clases y provider ---- */
  return (
    <html lang="es" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <MsalClientProvider>
          <NavbarWrapper userSession={serializableSession} />
          {children}
        </MsalClientProvider>
      </body>
    </html>
  );
}
