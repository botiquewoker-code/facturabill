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
import { Amplify } from "aws-amplify";
import { fetchUserAttributes, signIn } from "aws-amplify/auth";
import awsconfig from "@/config/aws-exports";
import {
  readLocalAccountCredentials,
  verifyLocalAccountPassword,
} from "@/features/account/credentials";
import {
  readUserProfile,
  writeUserProfile,
} from "@/features/account/profile";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import { useAppI18n } from "@/features/i18n/runtime";

Amplify.configure(awsconfig);

const inputClass =
  "h-12 w-full rounded-[18px] border border-white/70 bg-white/82 px-3.5 text-[14px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.24)] sm:h-14 sm:rounded-[22px] sm:px-4 sm:text-[15px] sm:shadow-[0_14px_32px_-24px_rgba(15,23,42,0.35)]";

export default function Login() {
  const router = useRouter();
  const { t } = useAppI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localCredentials, setLocalCredentials] = useState(null);
  const [hasCheckedCredentials, setHasCheckedCredentials] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = {
    missingCredentials: t({
      es: "Introduce el correo y la contrasena para entrar",
      en: "Enter your email and password to sign in",
    }),
    wrongEmail: t({
      es: "Este correo no coincide con la cuenta que has creado",
      en: "This email does not match the account you created",
    }),
    wrongPassword: t({ es: "La contrasena no coincide", en: "The password does not match" }),
    loggedIn: t({ es: "Sesion iniciada", en: "Signed in" }),
    loginUnavailable: t({ es: "No se pudo iniciar sesion", en: "Unable to sign in" }),
    sessionAlreadyOpen: t({ es: "Ya hay una sesion iniciada", en: "A session is already open" }),
    backHome: t({ es: "Volver al inicio", en: "Back home" }),
    badge: t({ es: "ACCESO", en: "ACCESS" }),
    eyebrow: t({ es: "Cuenta", en: "Account" }),
    title: t({ es: "Iniciar sesion", en: "Sign in" }),
    description: t({
      es: "Entra con el correo y la contrasena de tu cuenta para continuar.",
      en: "Sign in with your account email and password to continue.",
    }),
    checkingTitle: t({ es: "Comprobando acceso", en: "Checking access" }),
    checkingDescription: t({ es: "Estamos preparando tu acceso.", en: "We are preparing your access." }),
    accountDetected: t({ es: "Cuenta detectada", en: "Account detected" }),
    accountDetectedDescription: t({
      es: `Hemos encontrado la cuenta de ${localCredentials?.displayName || ""}. Introduce el correo y la contrasena para continuar.`,
      en: `We found the account for ${localCredentials?.displayName || ""}. Enter the email and password to continue.`,
    }),
    email: t({ es: "Correo", en: "Email" }),
    emailPlaceholder: t({ es: "tu@negocio.com", en: "you@business.com" }),
    password: t({ es: "Contrasena", en: "Password" }),
    passwordPlaceholder: t({ es: "Tu contrasena", en: "Your password" }),
    signingIn: t({ es: "Entrando...", en: "Signing in..." }),
    signIn: t({ es: "Entrar", en: "Sign in" }),
    detectedAccess: t({ es: "Acceso detectado", en: "Detected access" }),
    user: t({ es: "Usuario", en: "User" }),
    savedEmail: t({ es: "Correo guardado", en: "Saved email" }),
    noUserTitle: t({ es: "No hay usuario registrado", en: "No registered user" }),
    noUserDescription: t({
      es: "Todavia no hay ninguna cuenta creada. Primero tienes que registrarte y despues podras iniciar sesion.",
      en: "No account has been created yet. You need to register first and then you will be able to sign in.",
    }),
    goToRegister: t({ es: "Ir a registro", en: "Go to register" }),
  };

  useEffect(() => {
    startTransition(() => {
      const credentials = readLocalAccountCredentials();

      setLocalCredentials(credentials);
      setEmail(credentials?.email || "");
      setHasCheckedCredentials(true);
    });
  }, []);

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      showWarningToast(copy.missingCredentials);
      return;
    }

    if (
      localCredentials &&
      normalizedEmail !== localCredentials.email.toLowerCase()
    ) {
      showWarningToast(
        copy.wrongEmail,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (localCredentials) {
        const isValid = await verifyLocalAccountPassword(
          password.trim(),
          localCredentials,
        );

        if (!isValid) {
          showWarningToast(copy.wrongPassword);
          return;
        }

        const storedProfile = readUserProfile();

        writeUserProfile({
          displayName: localCredentials.displayName,
          email: localCredentials.email,
          companyName: storedProfile?.companyName || "",
          registeredAt:
            storedProfile?.registeredAt || localCredentials.registeredAt,
        });

        showSuccessToast(copy.loggedIn);
        router.push("/");
        return;
      }

      await signIn({
        username: normalizedEmail,
        password,
      });

      const attributes = await fetchUserAttributes().catch(() => null);
      const displayName =
        attributes?.name?.trim() || normalizedEmail.split("@")[0] || "Usuario";

      writeUserProfile({
        displayName,
        email: attributes?.email?.trim() || normalizedEmail,
        companyName: "",
        registeredAt: new Date().toISOString(),
      });

      showSuccessToast(copy.loggedIn);
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy.loginUnavailable;

      if (message.includes("already a signed in user")) {
        showWarningToast(copy.sessionAlreadyOpen);
        return;
      }

      showWarningToast(message);
    } finally {
      setIsSubmitting(false);
    }
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

        {!hasCheckedCredentials ? (
          <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {copy.checkingTitle}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-slate-500">
                  {copy.checkingDescription}
                </p>
              </div>
            </div>
          </section>
        ) : localCredentials ? (
          <>
            <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                <p className="text-sm font-semibold text-slate-950">
                  {copy.accountDetected}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-slate-500">
                    {copy.accountDetectedDescription}
                </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
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
                    {copy.password}
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={copy.passwordPlaceholder}
                    className={inputClass}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={isSubmitting}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isSubmitting ? copy.signingIn : copy.signIn}
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </section>

            <section className="mt-4 rounded-[22px] border border-white/70 bg-white/76 p-4 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:rounded-[28px] sm:p-5 sm:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {copy.detectedAccess}
              </p>
              <div className="mt-3 grid gap-3">
                <div className="rounded-[22px] border border-slate-200 bg-white/88 px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {copy.user}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {localCredentials.displayName}
                  </p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white/88 px-4 py-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {copy.savedEmail}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {localCredentials.email}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="mt-6 rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 sm:shadow-[0_24px_54px_-36px_rgba(15,23,42,0.28)]">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-slate-700">
                <UserRound className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {copy.noUserTitle}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-slate-500">
                  {copy.noUserDescription}
                </p>
              </div>
            </div>

            <Link
              href="/registro"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
            >
              {copy.goToRegister}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
