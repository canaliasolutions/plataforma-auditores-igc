import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {MsalClientProvider} from "@/components/MsalClientProvider";
import {getSession, UserSessionData} from "@/lib/session-utils";
import NavbarWrapper from "@/components/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal de auditores - IGC",
  description: "Portal de auditores",
};

export default async function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const session: UserSessionData | null = await getSession();
    console.log("Session data in RootLayout:", session);

    return (
        <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <MsalClientProvider>
                <NavbarWrapper userSession={session}></NavbarWrapper>
                {children}
            </MsalClientProvider>
            <div id="modal-root"/>
        </body>
        </html>
    );
}
