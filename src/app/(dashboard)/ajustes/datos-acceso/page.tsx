"use client";

import Link from "next/link";
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
  hashLocalAccountPassword,
  readLocalAccountCredentials,
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

const inputClass =
  "h-14 w-full rounded-[22px] border border-white/70 bg-white/82 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.35)]";

export default function DatosAccesoPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedProfile = readUserProfile();
    const storedCredentials = readLocalAccountCredentials();

    startTransition(() => {
      setDisplayName(
        storedProfile?.displayName || storedCredentials?.displayName || "",
      );
      setEmail(storedProfile?.email || storedCredentials?.email || "");
    });
  }, []);

  async function handleSave() {
    const normalizedName = displayName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();
    const storedProfile = readUserProfile();
    const storedCredentials = readLocalAccountCredentials();

    if (!normalizedName || !normalizedEmail) {
      showWarningToast("Completa nombre y correo para guardar");
      return;
    }

    if (nextPassword && nextPassword.length < 8) {
      showWarningToast("La contrasena debe tener al menos 8 caracteres");
      return;
    }

    if (!storedCredentials && !nextPassword) {
      showWarningToast("Anade una contrasena para terminar de crear el acceso");
      return;
    }

    try {
      writeUserProfile({
        displayName: normalizedName,
        email: normalizedEmail,
        companyName: storedProfile?.companyName || "",
        registeredAt: storedProfile?.registeredAt || new Date().toISOString(),
      });

      if (nextPassword || !storedCredentials) {
        const passwordHash = await hashLocalAccountPassword(nextPassword);

        writeLocalAccountCredentials({
          displayName: normalizedName,
          email: normalizedEmail,
          passwordHash,
          registeredAt:
            storedCredentials?.registeredAt ||
            storedProfile?.registeredAt ||
            new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (storedCredentials) {
        writeLocalAccountCredentials({
          ...storedCredentials,
          displayName: normalizedName,
          email: normalizedEmail,
          updatedAt: new Date().toISOString(),
        });
      }

      setPassword("");
      showSuccessToast("Datos de acceso actualizados");
    } catch {
      showWarningToast("No se pudieron guardar los datos de acceso");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[430px] px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/ajustes"
              aria-label="Volver a ajustes"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              PERFIL
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Cuenta
            </p>
            <h1 className="mt-2 text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              Datos de acceso
            </h1>
            <p className="mt-3 max-w-[18rem] text-[14px] leading-6 text-slate-500">
              Actualiza el nombre, correo y la contrasena personal o del
              gerente que usa esta cuenta.
            </p>
          </div>
        </header>

        <section className="mt-6 rounded-[32px] border border-white/70 bg-white/82 p-5 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Seguridad de acceso
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                Actualiza tus datos para acceder a la cuenta de forma segura.
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
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@negocio.com"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <LockKeyhole className="h-4 w-4" strokeWidth={2.2} />
                Nueva contrasena
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Deja vacia si no quieres cambiarla"
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
          >
            Guardar cambios
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </section>
      </main>
    </div>
  );
}
