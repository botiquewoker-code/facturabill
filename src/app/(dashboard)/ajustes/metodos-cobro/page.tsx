"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CircleCheckBig,
  CreditCard,
  FileText,
  Landmark,
  Save,
  Smartphone,
  Wallet,
} from "lucide-react";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";

const PAYMENT_METHODS_STORAGE_KEY = "facturabill-payment-methods";

type PaymentMethodKey =
  | "bankTransfer"
  | "sepaDebit"
  | "card"
  | "bizum"
  | "paypal";
type PaymentTerms = "uponReceipt" | "15days" | "30days" | "60days";

type PaymentMethodSettings = {
  accountHolder: string;
  bankName: string;
  iban: string;
  bic: string;
  sepaCreditorId: string;
  paymentReference: string;
  cardGateway: string;
  bizumPhone: string;
  paypalEmail: string;
  paymentInstructions: string;
  defaultTerms: PaymentTerms;
  methods: Record<PaymentMethodKey, boolean>;
};

const DEFAULT_PAYMENT_SETTINGS: PaymentMethodSettings = {
  accountHolder: "",
  bankName: "",
  iban: "",
  bic: "",
  sepaCreditorId: "",
  paymentReference: "",
  cardGateway: "",
  bizumPhone: "",
  paypalEmail: "",
  paymentInstructions: "",
  defaultTerms: "30days",
  methods: {
    bankTransfer: true,
    sepaDebit: false,
    card: true,
    bizum: false,
    paypal: false,
  },
};

const paymentTermsOptions: Array<{ value: PaymentTerms; label: string }> = [
  { value: "uponReceipt", label: "Pago inmediato" },
  { value: "15days", label: "15 dias" },
  { value: "30days", label: "30 dias" },
  { value: "60days", label: "60 dias" },
];

const paymentMethodsCatalog: Array<{
  key: PaymentMethodKey;
  title: string;
  description: string;
  icon: typeof Landmark;
}> = [
  {
    key: "bankTransfer",
    title: "Transferencia bancaria",
    description: "IBAN y referencia en la factura.",
    icon: Landmark,
  },
  {
    key: "sepaDebit",
    title: "Domiciliacion SEPA",
    description: "Cobro por recibo con identificador SEPA.",
    icon: Building2,
  },
  {
    key: "card",
    title: "Tarjeta",
    description: "Pasarela o TPV virtual para pago online.",
    icon: CreditCard,
  },
  {
    key: "bizum",
    title: "Bizum",
    description: "Cobro movil para clientes en Espana.",
    icon: Smartphone,
  },
  {
    key: "paypal",
    title: "PayPal",
    description: "Cobro por cuenta o enlace de pago.",
    icon: Wallet,
  },
];

function normalizePaymentSettings(
  value?: Partial<PaymentMethodSettings> | null,
): PaymentMethodSettings {
  return {
    ...DEFAULT_PAYMENT_SETTINGS,
    ...value,
    methods: {
      ...DEFAULT_PAYMENT_SETTINGS.methods,
      ...(value?.methods || {}),
    },
  };
}

function SectionCard({
  eyebrow,
  title,
  children,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  icon: typeof Landmark;
}) {
  return (
    <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
            {title}
          </h3>
        </div>
      </div>

      {children}
    </section>
  );
}

function MethodCard({
  active,
  description,
  onToggle,
  title,
  icon: Icon,
}: {
  active: boolean;
  description: string;
  onToggle: () => void;
  title: string;
  icon: typeof Landmark;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-[28px] border p-4 text-left shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)] transition ${
        active
          ? "border-slate-950 bg-white/90"
          : "border-white/70 bg-white/82 hover:border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3f4f6] text-slate-700">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            active
              ? "bg-slate-950 text-white"
              : "border border-slate-200 bg-white text-slate-500"
          }`}
        >
          {active ? "Activo" : "Activar"}
        </span>
      </div>

      <p className="mt-4 text-[15px] font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </button>
  );
}

function EmptyStateHint({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-sm leading-6 text-slate-500">
      {text}
    </div>
  );
}

export default function MetodosCobroPage() {
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language];
  const companyCopy = dashboardCopy[language].company;
  const [settings, setSettings] = useState<PaymentMethodSettings>(
    DEFAULT_PAYMENT_SETTINGS,
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY);

      if (stored) {
        try {
          setSettings(normalizePaymentSettings(JSON.parse(stored)));
        } catch (error) {
          console.error("Error loading payment methods", error);
        }
      }

      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function persistSettings(nextSettings: PaymentMethodSettings) {
    window.localStorage.setItem(
      PAYMENT_METHODS_STORAGE_KEY,
      JSON.stringify(nextSettings),
    );
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistSettings(settings);
  }, [isReady, settings]);

  function showNotice(message: string, tone: "warning" | "success") {
    if (tone === "success") {
      showSuccessToast(message);
      return;
    }

    showWarningToast(message);
  }

  function handleSave() {
    try {
      persistSettings(settings);
      showNotice("Metodos de cobro guardados", "success");
    } catch (error) {
      console.error("Error saving payment methods", error);
      showNotice("No se pudieron guardar los metodos de cobro", "warning");
    }
  }

  function updateField(
    field: Exclude<keyof PaymentMethodSettings, "methods">,
    value: string,
  ) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function toggleMethod(method: PaymentMethodKey) {
    setSettings((current) => ({
      ...current,
      methods: {
        ...current.methods,
        [method]: !current.methods[method],
      },
    }));
  }

  const activeMethodsCount = Object.values(settings.methods).filter(Boolean).length;
  const bankMethodsEnabled =
    settings.methods.bankTransfer || settings.methods.sepaDebit;
  const onlineMethodsEnabled =
    settings.methods.card || settings.methods.bizum || settings.methods.paypal;
  const bankReady =
    settings.accountHolder.trim().length > 0 && settings.iban.trim().length > 0;
  const onlineReady =
    (!settings.methods.card || settings.cardGateway.trim().length > 0) &&
    (!settings.methods.bizum || settings.bizumPhone.trim().length > 0) &&
    (!settings.methods.paypal || settings.paypalEmail.trim().length > 0) &&
    onlineMethodsEnabled;
  const onlineStatus = !onlineMethodsEnabled
    ? "No usado"
    : onlineReady
      ? companyCopy.ready
      : companyCopy.pending;
  const bankStatus = !bankMethodsEnabled
    ? "No usado"
    : bankReady
      ? companyCopy.ready
      : companyCopy.pending;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/ajustes"
                aria-label="Volver a ajustes"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/84 text-slate-700 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
              >
                <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.4} />
              </Link>

              <div className="rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-[11px] font-medium tracking-[0.02em] text-slate-500 shadow-[0_12px_26px_-22px_rgba(15,23,42,0.18)]">
                Cobro
              </div>
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {copy.settings.eyebrow}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.settings.paymentMethods}
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              Configura solo los medios de cobro que vas a usar y los datos que
              deben aparecer en tus facturas.
            </p>
          </div>

          <button
            type="button"
            aria-label="Guardar metodos de cobro"
            onClick={handleSave}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
          >
            <Save className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </button>
        </header>

        {!isReady ? (
          <section className="mt-6 space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="rounded-[34px] border border-white/70 bg-white/72 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl"
              >
                <div className="flex animate-pulse items-start gap-4">
                  <div className="h-16 w-16 rounded-[24px] bg-slate-200/70" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-32 rounded-full bg-slate-200/70" />
                    <div className="h-4 w-20 rounded-full bg-slate-200/60" />
                    <div className="h-4 w-44 rounded-full bg-slate-200/50" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <>
            <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-slate-950 text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.78)]">
                  <Landmark className="h-7 w-7" strokeWidth={2.1} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                        Configuracion de cobro
                      </p>
                      <h2 className="mt-2 truncate text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                        Metodos y datos de pago
                      </h2>
                    </div>

                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      Configurado
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        Metodos
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {activeMethodsCount} activos
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        Banco
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {bankStatus}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        Online
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {onlineStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <SectionCard
              eyebrow="Metodos"
              title="Medios aceptados"
              icon={Wallet}
            >
              <div className="mt-6 grid gap-3">
                {paymentMethodsCatalog.map((method) => (
                  <MethodCard
                    key={method.key}
                    active={settings.methods[method.key]}
                    description={method.description}
                    onToggle={() => toggleMethod(method.key)}
                    title={method.title}
                    icon={method.icon}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Banco"
              title="Datos bancarios"
              icon={Building2}
            >
              {bankMethodsEnabled ? (
                <div className="mt-6 space-y-3">
                  <input
                    placeholder="Titular de la cuenta"
                    value={settings.accountHolder}
                    onChange={(event) =>
                      updateField("accountHolder", event.target.value)
                    }
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                  <input
                    placeholder="Entidad bancaria"
                    value={settings.bankName}
                    onChange={(event) => updateField("bankName", event.target.value)}
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="IBAN"
                      value={settings.iban}
                      onChange={(event) => updateField("iban", event.target.value)}
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                    <input
                      placeholder="BIC / SWIFT"
                      value={settings.bic}
                      onChange={(event) => updateField("bic", event.target.value)}
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  </div>
                  <input
                    placeholder="Referencia de pago"
                    value={settings.paymentReference}
                    onChange={(event) =>
                      updateField("paymentReference", event.target.value)
                    }
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                  {settings.methods.sepaDebit ? (
                    <input
                      placeholder="Identificador acreedor SEPA"
                      value={settings.sepaCreditorId}
                      onChange={(event) =>
                        updateField("sepaCreditorId", event.target.value)
                      }
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  ) : null}
                </div>
              ) : (
                <EmptyStateHint text="Activa transferencia o domiciliacion SEPA para completar los datos bancarios." />
              )}
            </SectionCard>

            <SectionCard
              eyebrow="Cobro online"
              title="Canales digitales"
              icon={CreditCard}
            >
              {onlineMethodsEnabled ? (
                <div className="mt-6 space-y-3">
                  {settings.methods.card ? (
                    <input
                      placeholder="Pasarela de tarjeta"
                      value={settings.cardGateway}
                      onChange={(event) =>
                        updateField("cardGateway", event.target.value)
                      }
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  ) : null}
                  {settings.methods.bizum ? (
                    <input
                      placeholder="Telefono Bizum"
                      value={settings.bizumPhone}
                      onChange={(event) =>
                        updateField("bizumPhone", event.target.value)
                      }
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  ) : null}
                  {settings.methods.paypal ? (
                    <input
                      placeholder="Email PayPal"
                      value={settings.paypalEmail}
                      onChange={(event) =>
                        updateField("paypalEmail", event.target.value)
                      }
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  ) : null}
                </div>
              ) : (
                <EmptyStateHint text="Activa tarjeta, Bizum o PayPal para mostrar aqui sus datos de cobro." />
              )}
            </SectionCard>

            <SectionCard
              eyebrow="Notas"
              title="Condiciones de pago"
              icon={FileText}
            >
              <div className="mt-6 space-y-3">
                <select
                  value={settings.defaultTerms}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      defaultTerms: event.target.value as PaymentTerms,
                    }))
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                >
                  {paymentTermsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Instrucciones de pago para mostrar al cliente en la factura."
                  value={settings.paymentInstructions}
                  onChange={(event) =>
                    updateField("paymentInstructions", event.target.value)
                  }
                  rows={6}
                  className="w-full rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
              </div>
            </SectionCard>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <CircleCheckBig className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {companyCopy.actions}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    Guardar y continuar
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                >
                  <CircleCheckBig className="h-4 w-4" strokeWidth={2.2} />
                  Guardar metodos de cobro
                </button>
                <Link
                  href="/ajustes"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Volver a ajustes
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
