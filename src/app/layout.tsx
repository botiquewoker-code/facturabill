import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import {
  getLanguageDirection,
  LANGUAGE_COOKIE_KEY,
  resolveAppLanguage,
} from "@/features/i18n/config";
import { AppLanguageProvider } from "@/features/i18n/provider";
import { AppToaster } from "@/features/notifications/toast";

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const TRACKING_IDS = [GOOGLE_ADS_ID, GOOGLE_ANALYTICS_ID].filter(Boolean);
const PRIMARY_TRACKING_ID = TRACKING_IDS[0];

export const metadata: Metadata = {
  title: "Crear facturas y presupuestos facil",
  description: "Facturas y presupuestos rapidos para autonomos y pequenos negocios",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const initialLanguage = resolveAppLanguage(
    cookieStore.get(LANGUAGE_COOKIE_KEY)?.value ||
      headerStore.get("accept-language"),
  );

  return (
    <html
      lang={initialLanguage}
      dir={getLanguageDirection(initialLanguage)}
      data-language={initialLanguage}
      suppressHydrationWarning
    >
      <head>
        <Script id="language-bootstrap" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var storedLanguage = window.localStorage.getItem('${LANGUAGE_COOKIE_KEY}');

                if (!storedLanguage) {
                  return;
                }

                var direction = storedLanguage === 'ar' ? 'rtl' : 'ltr';
                document.documentElement.lang = storedLanguage;
                document.documentElement.dir = direction;
                document.documentElement.dataset.language = storedLanguage;
                document.cookie = '${LANGUAGE_COOKIE_KEY}=' + storedLanguage + '; path=/; max-age=31536000; samesite=lax';
              } catch (error) {
                console.error('Unable to restore language preference', error);
              }
            })();
          `}
        </Script>
        {PRIMARY_TRACKING_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${PRIMARY_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-tracking" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${TRACKING_IDS.map((id) => `gtag('config', '${id}');`).join("\n")}
              `}
            </Script>
          </>
        ) : null}
      </head>

      <body className="antialiased">
        <AppLanguageProvider initialLanguage={initialLanguage}>
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
