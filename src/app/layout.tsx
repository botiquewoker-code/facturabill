import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppLanguageProvider } from "@/features/i18n/provider";
import { AppToaster } from "@/features/notifications/toast";

const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-1791812185";
const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-XSGT6ME68Y";

export const metadata: Metadata = {
  title: "Crear facturas y presupuestos facil",
  description: "Facturas y presupuestos rapidos para autonomos y pequenos negocios",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `}
        </Script>
      </head>

      <body className="antialiased">
        <AppLanguageProvider>
          {children}
          <AppToaster />
        </AppLanguageProvider>

        <Script id="sw-register" strategy="afterInteractive">
          {`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}
        </Script>
      </body>
    </html>
  );
}
