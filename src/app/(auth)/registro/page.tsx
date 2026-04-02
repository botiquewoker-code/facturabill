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
  hashLocalAccountPassword,
} from "@/features/account/credentials";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import {
  activeCompanyRepository,
  activeUserRepository,
} from "@/features/repositories";
import AppScreenLoader from "@/features/ui/AppScreenLoader";
import { useAppI18n } from "@/features/i18n/runtime";

const DEFAULT_TEMPLATE = "InvoicePDF";
const inputClass =
  "h-12 w-full rounded-[18px] border border-white/70 bg-white/82 px-3.5 text-[14px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.24)] sm:h-14 sm:rounded-[22px] sm:px-4 sm:text-[15px] sm:shadow-[0_14px_32px_-24px_rgba(15,23,42,0.35)]";

export default function RegistroPage() {
  const router = useRouter();
  const { t } = useAppI18n();
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

  const copy = {
    missingFields: t({
      es: "Completa tu nombre y el correo para continuar",
      en: "Complete your name and email to continue",
    }),
    weakPassword: t({
      es: "La contrasena debe tener al menos 8 caracteres",
      en: "Password must be at least 8 characters long",
    }),
    accountCreated: t({ es: "Cuenta creada correctamente", en: "Account created successfully" }),
    accountError: t({ es: "No se pudo crear la cuenta", en: "Unable to create the account" }),
    loaderEyebrow: t({ es: "Acceso", en: "Access" }),
    loaderTitle: t({ es: "Crea tu acceso", en: "Create your access" }),
    loaderDescription: t({
      es: "Estamos preparando tus datos para que continues sin interrupciones.",
      en: "We are preparing your data so you can continue without interruptions.",
    }),
    backHome: t({ es: "Volver al inicio", en: "Back home" }),
    badge: t({ es: "REGISTRO", en: "REGISTER" }),
    eyebrow: t({ es: "Acceso", en: "Access" }),
    title: t({ es: "Crea tu acceso", en: "Create your access" }),
    description: t({
      es: "Registra solo el nombre, correo y contrasena personal o del gerente del negocio. Lo demas se completa despues.",
      en: "Register only the name, email, and personal or manager password. Everything else can be completed later.",
    }),
    initialStep: t({ es: "Paso inicial", en: "Initial step" }),
    initialStepDescription: t({
      es: "Crea tu cuenta con lo esencial y completa el resto cuando te venga bien.",
      en: "Create your account with the essentials and complete the rest later when it suits you.",
    }),
    name: t({ es: "Nombre", en: "Name" }),
    namePlaceholder: t({ es: "Nombre personal o del gerente", en: "Personal or manager name" }),
    email: t({ es: "Correo", en: "Email" }),
    emailPlaceholder: t({ es: "tu@negocio.com", en: "you@business.com" }),
    password: t({ es: "Contrasena", en: "Password" }),
    passwordPlaceholder: t({ es: "Minimo 8 caracteres", en: "Minimum 8 characters" }),
    creatingAccount: t({ es: "Creando cuenta...", en: "Creating account..." }),
    createAndEnter: t({ es: "Crear cuenta y entrar", en: "Create account and enter" }),
    laterEyebrow: t({ es: "Lo completaras despues", en: "You will complete it later" }),
    laterItems: [
      t({ es: "Datos de empresa y facturacion", en: "Company and billing details" }),
      t({ es: "Metodos de cobro y configuracion fiscal", en: "Payment methods and tax settings" }),
      t({ es: "Plantillas, logo y resto del perfil", en: "Templates, logo, and the rest of the profile" }),
    ],
    alreadyHaveAccount: t({ es: "Ya tienes cuenta. Entrar", en: "Already have an account? Sign in" }),
  };

  useEffect(() => {
    const storedProfile = activeUserRepository.readProfile();
    const storedCredentials = activeUserRepository.readCredentials();

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
      showWarningToast(copy.missingFields);
      return;
    }

    if (!passwordIsValid) {
      showWarningToast(copy.weakPassword);
      return;
    }

    try {
      setIsSubmitting(true);

      const normalizedEmail = email.trim().toLowerCase();
      const passwordHash = await hashLocalAccountPassword(password.trim());
      const workspace = activeCompanyRepository.readWorkspace();
      const companyName = workspace.company.nombre.trim();
      const existingTemplate = workspace.template || DEFAULT_TEMPLATE;
      const currentCredentials = activeUserRepository.readCredentials();

      activeUserRepository.saveProfile({
        displayName: displayName.trim(),
        email: normalizedEmail,
        companyName,
        registeredAt: new Date().toISOString(),
      });
      activeUserRepository.saveCredentials({
        displayName: displayName.trim(),
        email: normalizedEmail,
        passwordHash,
        registeredAt:
          currentCredentials?.registeredAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      activeCompanyRepository.saveTemplate(existingTemplate);

      showSuccessToast(copy.accountCreated);
      router.replace("/");
      router.refresh();
    } catch {
      showWarningToast(copy.accountError);
    } finally {
      setIsSubmitting(false);
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
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#eef3fb_44%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_transparent_72%)]" />
      <div className="pointer-events-none absolute -left-12 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-56 h-52 w-52 rounded-full bg-[#dce8ff]/78 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[410px] flex-col px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[calc(0.875rem+env(safe-area-inset-top))] sm:max-w-[430px] sm:pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pt-[calc(1rem+env(safe-area-inset-top))]">
        <header className="px-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              aria-label={copy.backHome}
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
            <h1 className="mt-2 text-[1.85rem] sm:text-[2.05rem] font-semibold tracking-[-0.055em] text-slate-950">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-[18rem] text-[14px] leading-6 text-slate-500">
              {copy.description}
            </p>
          </div>
        </header>

        <form
          className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]"
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
                {copy.initialStep}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                {copy.initialStepDescription}
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
                name="displayName"
                autoComplete="name"
                required
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
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                <LockKeyhole className="h-4 w-4" strokeWidth={2.2} />
                {copy.password}
              </span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={copy.passwordPlaceholder}
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canRegister || isSubmitting}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? copy.creatingAccount : copy.createAndEnter}
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </form>

        <section className="mt-4 rounded-[22px] border border-white/70 bg-white/76 p-4 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[28px] sm:p-5 sm:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {copy.laterEyebrow}
          </p>
          <div className="mt-3 grid gap-3">
            {copy.laterItems.map((item) => (
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
            {copy.alreadyHaveAccount}
          </Link>
        </div>
      </main>
    </div>
  );
}
