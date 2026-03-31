"use client";

import Link from "next/link";
import { useState } from "react";
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
import AppScreenLoader from "@/features/ui/AppScreenLoader";
import { useAppI18n } from "@/features/i18n/runtime";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";

const inputClass =
  "h-14 w-full rounded-[22px] border border-white/70 bg-white/82 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.35)]";

export default function DatosAccesoPage() {
  const { t } = useAppI18n();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isReady, setIsReady] = useState(false);

  const copy = {
    missingFields: t({ es: "Completa nombre y correo para guardar", en: "Complete name and email to save" }),
    weakPassword: t({ es: "La contrasena debe tener al menos 8 caracteres", en: "Password must be at least 8 characters long" }),
    missingPassword: t({ es: "Anade una contrasena para terminar de crear el acceso", en: "Add a password to finish creating the access" }),
    updated: t({ es: "Datos de acceso actualizados", en: "Access details updated" }),
    updateError: t({ es: "No se pudieron guardar los datos de acceso", en: "Unable to save access details" }),
    loaderEyebrow: t({ es: "Cuenta", en: "Account" }),
    loaderTitle: t({ es: "Datos de acceso", en: "Access details" }),
    loaderDescription: t({
      es: "Estamos preparando tu perfil para que lo edites con la informacion actual.",
      en: "We are preparing your profile so you can edit it with the current information.",
    }),
    backToSettings: t({ es: "Volver a ajustes", en: "Back to settings" }),
    badge: t({ es: "PERFIL", en: "PROFILE" }),
    eyebrow: t({ es: "Cuenta", en: "Account" }),
    title: t({ es: "Datos de acceso", en: "Access details" }),
    description: t({
      es: "Actualiza el nombre, correo y la contrasena personal o del gerente que usa esta cuenta.",
      en: "Update the name, email, and the personal or manager password used on this account.",
    }),
    securityTitle: t({ es: "Seguridad de acceso", en: "Access security" }),
    securityDescription: t({
      es: "Actualiza tus datos para acceder a la cuenta de forma segura.",
      en: "Update your details to access the account securely.",
    }),
    name: t({ es: "Nombre", en: "Name" }),
    namePlaceholder: t({ es: "Nombre personal o del gerente", en: "Personal or manager name" }),
    email: t({ es: "Correo", en: "Email" }),
    emailPlaceholder: t({ es: "tu@negocio.com", en: "you@business.com" }),
    newPassword: t({ es: "Nueva contrasena", en: "New password" }),
    newPasswordPlaceholder: t({ es: "Deja vacia si no quieres cambiarla", en: "Leave empty if you do not want to change it" }),
    saveChanges: t({ es: "Guardar cambios", en: "Save changes" }),
  };

  useClientLayoutEffect(() => {
    const storedProfile = readUserProfile();
    const storedCredentials = readLocalAccountCredentials();

    setDisplayName(
      storedProfile?.displayName || storedCredentials?.displayName || "",
    );
    setEmail(storedProfile?.email || storedCredentials?.email || "");
    setIsReady(true);
  }, []);

  async function handleSave() {
    const normalizedName = displayName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();
    const storedProfile = readUserProfile();
    const storedCredentials = readLocalAccountCredentials();

    if (!normalizedName || !normalizedEmail) {
      showWarningToast(copy.missingFields);
      return;
    }

    if (nextPassword && nextPassword.length < 8) {
      showWarningToast(copy.weakPassword);
      return;
    }

    if (!storedCredentials && !nextPassword) {
      showWarningToast(copy.missingPassword);
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
      showSuccessToast(copy.updated);
    } catch {
      showWarningToast(copy.updateError);
    }
  }

  if (!isReady) {
    return (
      <AppScreenLoader
        eyebrow={copy.loaderEyebrow}
        title={copy.loaderTitle}
        description={copy.loaderDescription}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#f2f4f6_52%,#eef1f4_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#efe2d3]/42 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-24 h-24 w-24 rounded-full bg-[#dde6f1]/65 blur-3xl" />

      <main className="relative mx-auto min-h-screen w-full max-w-[430px] px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/ajustes"
              aria-label={copy.backToSettings}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>

            <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
              {copy.badge}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-[18rem] text-[14px] leading-6 text-slate-500">
              {copy.description}
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
                {copy.securityTitle}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {copy.securityDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <UserRound className="h-4 w-4" strokeWidth={2.2} />
                {copy.name}
              </span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={copy.namePlaceholder}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <Mail className="h-4 w-4" strokeWidth={2.2} />
                {copy.email}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <LockKeyhole className="h-4 w-4" strokeWidth={2.2} />
                {copy.newPassword}
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={copy.newPasswordPlaceholder}
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
          >
            {copy.saveChanges}
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </section>
      </main>
    </div>
  );
}
