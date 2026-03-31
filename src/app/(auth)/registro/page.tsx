"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  readLocalAccountCredentials,
  hashLocalAccountPassword,
  writeLocalAccountCredentials,
} from "@/features/account/credentials";
import {
  readUserProfile,
  writeUserProfile,
} from "@/features/account/profile";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import AppScreenLoader from "@/features/ui/AppScreenLoader";

const DEFAULT_TEMPLATE = "InvoicePDF";
const inputClass =
  "h-14 w-full rounded-[22px] border border-white/70 bg-white/82 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.35)]";

export default function RegistroPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const passwordIsValid = password.trim().length >= 8;
  const canRegister =
    displayName.trim().length > 0 &&
    email.trim().length > 0 &&
    passwordIsValid;

  useEffect(() => {
    const storedProfile = readUserProfile();
    const storedCredentials = readLocalAccountCredentials();

    startTransition(() => {
      setDisplayName(
        storedProfile?.displayName || storedCredentials?.displayName || "",
      );
      setEmail(storedProfile?.email || storedCredentials?.email || "");
      setIsReady(true);
    });
  }, []);

  async function handleSave() {
    if (isSubmitting) {
      return;
    }

    if (!displayName.trim() || !email.trim()) {
      showWarningToast("Completa tu nombre y el correo para continuar");
      return;
    }

    if (!passwordIsValid) {
      showWarningToast("La contrasena debe tener al menos 8 caracteres");
      return;
    }

    try {
      setIsSubmitting(true);

      const normalizedEmail = email.trim().toLowerCase();
      const passwordHash = await hashLocalAccountPassword(password.trim());
      const existingCompany =
        typeof window !== "undefined"
          ? window.localStorage.getItem("datosEmpresa")
          : null;
      let parsedCompany: Record<string, unknown> | null = null;

      if (existingCompany) {
        try {
          parsedCompany = JSON.parse(existingCompany) as Record<string, unknown>;
        } catch {
          parsedCompany = null;
        }
      }

      const companyName =
        parsedCompany && typeof parsedCompany.nombre === "string"
          ? parsedCompany.nombre.trim()
          : "";
      const existingNotes =
        window.localStorage.getItem("notasUsuario")?.trim() || "";
      const existingTemplate =
        window.localStorage.getItem("plantillaSeleccionada") ||
        window.localStorage.getItem("plantillaUsuario") ||
        window.localStorage.getItem("plantillaElegida") ||
        DEFAULT_TEMPLATE;
      const currentCredentials = readLocalAccountCredentials();

      writeUserProfile({
        displayName: displayName.trim(),
        email: normalizedEmail,
        companyName,
        registeredAt: new Date().toISOString(),
      });
      writeLocalAccountCredentials({
        displayName: displayName.trim(),
        email: normalizedEmail,
        passwordHash,
        registeredAt:
          currentCredentials?.registeredAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      window.localStorage.setItem(
        "configEmpresa",
        JSON.stringify({
          user: {
            displayName: displayName.trim(),
            email: normalizedEmail,
          },
          empresa: parsedCompany || {},
          notas: existingNotes,
          plantilla: existingTemplate,
        }),
      );
      window.localStorage.setItem("plantillaSeleccionada", existingTemplate);
      window.localStorage.setItem("plantillaUsuario", existingTemplate);
      window.localStorage.setItem("plantillaElegida", existingTemplate);

      showSuccessToast("Cuenta creada correctamente");
      router.replace("/");
      router.refresh();
    } catch {
      showWarningToast("No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <AppScreenLoader
        eyebrow="Acceso"
        title="Crea tu acceso"
        description="Estamos preparando tus datos para que continues sin interrupciones."
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#eef3fb_44%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-12 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-56 h-52 w-52 rounded-full bg-[#dce8ff]/78 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              aria-label="Volver al inicio"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              REGISTRO
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Acceso
            </p>
            <h1 className="mt-2 text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              Crea tu acceso
            </h1>
            <p className="mt-3 max-w-[18rem] text-[14px] leading-6 text-slate-500">
              Registra solo el nombre, correo y contrasena personal o del
              gerente del negocio. Lo demas se completa despues.
            </p>
          </div>
        </header>

        <form
          className="mt-6 rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Paso inicial
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                Crea tu cuenta con lo esencial y completa el resto cuando te
                venga bien.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <UserRound className="h-4 w-4" strokeWidth={2.2} />
                Nombre
              </span>
              <input
                name="displayName"
                autoComplete="name"
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Nombre personal o del gerente"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <Mail className="h-4 w-4" strokeWidth={2.2} />
                Correo
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@negocio.com"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <LockKeyhole className="h-4 w-4" strokeWidth={2.2} />
                Contrasena
              </span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimo 8 caracteres"
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canRegister || isSubmitting}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta y entrar"}
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </form>

        <section className="mt-4 rounded-[28px] border border-white/70 bg-white/76 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Lo completaras despues
          </p>
          <div className="mt-3 grid gap-3">
            {[
              "Datos de empresa y facturacion",
              "Metodos de cobro y configuracion fiscal",
              "Plantillas, logo y resto del perfil",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200 bg-white/88 px-4 py-3 text-[14px] font-medium text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 pb-2 text-center text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-slate-700 transition hover:text-slate-950">
            Ya tienes cuenta. Entrar
          </Link>
        </div>
      </main>
    </div>
  );
}
