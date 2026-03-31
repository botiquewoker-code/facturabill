"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CircleCheckBig,
  FileText,
  House,
  ImagePlus,
  Mail,
  Palette,
  Phone,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";
import { dashboardCopy } from "@/features/i18n/dashboard-copy";
import { useAppLanguage } from "@/features/i18n/provider";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";

type Empresa = {
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono: string;
  email: string;
};

type Plantilla = "InvoicePDF" | "PlantillaNueva" | "PlantillaStudio";

const EMPTY_EMPRESA: Empresa = {
  nombre: "",
  nif: "",
  direccion: "",
  ciudad: "",
  cp: "",
  telefono: "",
  email: "",
};

function isPlantilla(value: string): value is Plantilla {
  return (
    value === "InvoicePDF" ||
    value === "PlantillaNueva" ||
    value === "PlantillaStudio"
  );
}

function getInitials(nombre: string): string {
  const initials = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "PR";
}

export default function ConfiguracionEmpresaPage() {
  const router = useRouter();
  const { language } = useAppLanguage();
  const copy = dashboardCopy[language].company;
  const studioLabel = language === "es" ? "Studio" : "Studio";
  const studioDescription =
    language === "es"
      ? "Premium, sobria y con presencia visual"
      : "Premium, refined, and visually rich";
  const [empresa, setEmpresa] = useState<Empresa>(EMPTY_EMPRESA);
  const [plantilla, setPlantilla] = useState<Plantilla>("InvoicePDF");
  const [logo, setLogo] = useState("");
  const [notas, setNotas] = useState("");
  const [isReady, setIsReady] = useState(false);

  const templateOptions = useMemo(
    () => [
      {
        id: "InvoicePDF" as Plantilla,
        label: copy.classic,
        description: copy.classicDescription,
        preview: "/previews/Clasica.jpg",
      },
      {
        id: "PlantillaNueva" as Plantilla,
        label: copy.elegant,
        description: copy.elegantDescription,
        preview: "/previews/elegant.jpg",
      },
      {
        id: "PlantillaStudio" as Plantilla,
        label: studioLabel,
        description: studioDescription,
        preview: "/previews/studio-template.svg",
      },
    ],
    [
      copy.classic,
      copy.classicDescription,
      copy.elegant,
      copy.elegantDescription,
      studioDescription,
      studioLabel,
    ],
  );

  useClientLayoutEffect(() => {
    const storedCompany = window.localStorage.getItem("datosEmpresa");
    if (storedCompany) {
      try {
        const parsed = JSON.parse(storedCompany) as Partial<Empresa>;
        setEmpresa({ ...EMPTY_EMPRESA, ...parsed });
      } catch (error) {
        console.error("Error loading company profile", error);
      }
    }

    const storedTemplate =
      window.localStorage.getItem("plantillaSeleccionada") ||
      window.localStorage.getItem("plantillaUsuario") ||
      window.localStorage.getItem("plantillaElegida");

    if (storedTemplate && isPlantilla(storedTemplate)) {
      setPlantilla(storedTemplate);
    }

    const storedLogo = window.localStorage.getItem("logoUsuario");
    if (storedLogo) {
      setLogo(storedLogo);
    }

    const storedNotes = window.localStorage.getItem("notasUsuario");
    if (storedNotes) {
      setNotas(storedNotes);
    }

    setIsReady(true);
  }, []);

  function persistProfile() {
    window.localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
    window.localStorage.setItem("plantillaSeleccionada", plantilla);
    window.localStorage.setItem("plantillaUsuario", plantilla);
    window.localStorage.setItem("plantillaElegida", plantilla);
    window.localStorage.setItem("logoUsuario", logo || "");
    window.localStorage.setItem("notasUsuario", notas || "");
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (empresa.nombre || empresa.nif || empresa.direccion) {
      window.localStorage.setItem("datosEmpresa", JSON.stringify(empresa));
    }
  }, [empresa, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem("plantillaSeleccionada", plantilla);
    window.localStorage.setItem("plantillaUsuario", plantilla);
    window.localStorage.setItem("plantillaElegida", plantilla);
  }, [plantilla, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem("logoUsuario", logo);
  }, [logo, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem("notasUsuario", notas);
  }, [notas, isReady]);

  function showNotice(message: string, tone: "warning" | "success") {
    if (tone === "success") {
      showSuccessToast(message);
      return;
    }

    showWarningToast(message);
  }

  function updateEmpresa(field: keyof Empresa, value: string) {
    setEmpresa((current) => ({ ...current, [field]: value }));
  }

  function handleLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result as string;
      setLogo(image);
      window.localStorage.setItem("logoUsuario", image);
    };

    reader.readAsDataURL(file);
  }

  function handleGuardarEmpresa() {
    try {
      persistProfile();

      if (navigator.vibrate) {
        navigator.vibrate(40);
      }

      showNotice(copy.profileSaved, "success");
    } catch (error) {
      console.error("Error saving profile", error);
      showNotice(copy.unableSave, "warning");
    }
  }

  const profileName = empresa.nombre.trim() || copy.yourBusiness;
  const activeTemplate = useMemo(
    () => templateOptions.find((option) => option.id === plantilla),
    [plantilla, templateOptions],
  );
  const hasLogo = logo.trim().length > 0;
  const hasNotes = notas.trim().length > 0;

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
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              {copy.workspace}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              {copy.subtitle}
            </p>
          </div>

          <button
            type="button"
            aria-label={copy.saveProfileAria}
            onClick={handleGuardarEmpresa}
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
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-slate-950 text-lg font-semibold tracking-[0.12em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.78)]">
                  {getInitials(profileName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                        {copy.businessProfile}
                      </p>
                      <h2 className="mt-2 truncate text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {profileName}
                      </h2>
                    </div>

                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      {copy.localSync}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        {copy.template}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {activeTemplate?.label || copy.classic}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        {copy.logo}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {hasLogo ? copy.ready : copy.pending}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/70 bg-white/80 p-3 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)]">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                        {copy.notes}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {hasNotes ? copy.added : copy.empty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <Palette className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {copy.invoiceStyle}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {copy.pickTemplate}
                  </h3>
                  <p className="mt-2 max-w-[18rem] text-sm leading-6 text-slate-500">
                    Desliza para comparar las plantillas y toca la que quieras usar.
                  </p>
                </div>
              </div>

              <div className="-mx-6 mt-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex snap-x snap-mandatory gap-4">
                {templateOptions.map((template) => {
                  const isSelected = template.id === plantilla;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setPlantilla(template.id)}
                      aria-pressed={isSelected}
                      className={`min-w-[84%] snap-center overflow-hidden rounded-[30px] border bg-white/86 text-left shadow-[0_24px_50px_-32px_rgba(15,23,42,0.35)] transition sm:min-w-[340px] ${
                        isSelected
                          ? "border-slate-950 shadow-[0_28px_56px_-30px_rgba(15,23,42,0.5)]"
                          : "border-white/70 hover:border-slate-200"
                      }`}
                    >
                      <div className="border-b border-[#ece8e1] bg-[linear-gradient(180deg,rgba(248,247,243,0.95),rgba(242,240,235,0.85))] px-4 pb-4 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                              {copy.template}
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-950">
                              {template.label}
                            </p>
                          </div>
                          <div
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              isSelected
                                ? "bg-slate-950 text-white"
                                : "border border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {isSelected ? copy.selected : copy.choose}
                          </div>
                        </div>

                        <div className="mt-4 rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(233,239,246,0.78),_rgba(245,240,233,0.92))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                          <div className="relative mx-auto aspect-[3/4.15] w-full max-w-[260px] overflow-hidden rounded-[18px] border border-white/80 bg-white shadow-[0_24px_40px_-28px_rgba(15,23,42,0.45)]">
                            <Image
                              src={template.preview}
                              alt={template.label}
                              fill
                              className="object-contain object-top"
                              sizes="(max-width: 430px) 72vw, 260px"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-3">
                        <div>
                          <p className="text-base font-semibold text-slate-950">
                            Vista previa clara
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <ImagePlus className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {copy.brandAssets}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {copy.uploadLogo}
                  </h3>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]">
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogo}
                    className="hidden"
                  />

                  {logo ? (
                    <div className="flex flex-col items-center gap-4 rounded-[24px] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(229,238,250,0.92),rgba(249,234,216,0.95))] px-6 py-8 text-center">
                      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white p-4 shadow-[0_18px_38px_-26px_rgba(15,23,42,0.35)]">
                        <Image
                          src={logo}
                          alt="Company logo"
                          width={160}
                          height={96}
                          className="h-auto max-h-24 w-auto"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {copy.logoReady}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {copy.replaceLogo}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                        <Upload className="h-[18px] w-[18px]" strokeWidth={2.2} />
                      </span>
                      <p className="mt-4 text-sm font-semibold text-slate-950">
                        {copy.addLogo}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {copy.addLogoDescription}
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <Building2 className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {copy.businessDetails}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {copy.companyInformation}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <input
                  placeholder={copy.companyName}
                  value={empresa.nombre}
                  onChange={(event) => updateEmpresa("nombre", event.target.value)}
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <input
                  placeholder={copy.taxId}
                  value={empresa.nif}
                  onChange={(event) => updateEmpresa("nif", event.target.value)}
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <input
                  placeholder={copy.address}
                  value={empresa.direccion}
                  onChange={(event) =>
                    updateEmpresa("direccion", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder={copy.city}
                    value={empresa.ciudad}
                    onChange={(event) => updateEmpresa("ciudad", event.target.value)}
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                  <input
                    placeholder={copy.postalCode}
                    value={empresa.cp}
                    onChange={(event) => updateEmpresa("cp", event.target.value)}
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      placeholder={copy.email}
                      value={empresa.email}
                      onChange={(event) =>
                        updateEmpresa("email", event.target.value)
                      }
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 pl-11 pr-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  </div>
                  <div className="relative">
                    <Phone
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      placeholder={copy.phone}
                      value={empresa.telefono}
                      onChange={(event) =>
                        updateEmpresa("telefono", event.target.value)
                      }
                      className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 pl-11 pr-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <FileText className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {copy.invoiceNotes}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {copy.footerDetails}
                  </h3>
                </div>
              </div>

              <textarea
                placeholder={copy.notesPlaceholder}
                value={notas}
                onChange={(event) => setNotas(event.target.value)}
                rows={6}
                className="mt-6 w-full rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
              />
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                  <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {copy.actions}
                  </p>
                  <h3 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {copy.saveAndContinue}
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={handleGuardarEmpresa}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                >
                  <CircleCheckBig className="h-4 w-4" strokeWidth={2.2} />
                  {copy.saveProfile}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <House className="h-4 w-4" strokeWidth={2.2} />
                  {copy.backHome}
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
