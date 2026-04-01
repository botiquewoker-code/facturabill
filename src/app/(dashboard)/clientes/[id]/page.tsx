"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CircleCheckBig,
  CirclePlus,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  ReceiptText,
  Save,
  Trash2,
  UsersRound,
} from "lucide-react";
import {
  createClientRecord,
  createEmptyClientDraft,
  findClientById,
  hasDuplicateTaxId,
  normalizeRouteParam,
  readClients,
  toClientDraft,
  type ClientDraft,
  type ClientRecord,
  writeClients,
} from "@/features/clients/storage";
import {
  readDrafts,
  upsertDraft,
  writeActiveDraft,
  writeDrafts,
} from "@/features/drafts/storage";
import type { InvoiceDocumentType } from "@/features/invoices/document-types";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import { useAppI18n } from "@/features/i18n/runtime";
import { useClientLayoutEffect } from "@/features/ui/useClientLayoutEffect";

function getInitials(nombre: string): string {
  const initials = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "CL";
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function addDays(baseDate: string, days: number) {
  const [year, month, day] = baseDate.split("-").map(Number);

  if (!year || !month || !day) {
    return today();
  }

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function draftId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ClienteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useAppI18n();
  const routeClientId = normalizeRouteParam(params.id);
  const shouldOpenEditMode = searchParams.get("edit") === "1";

  const [cliente, setCliente] = useState<ClientRecord | null>(null);
  const [draft, setDraft] = useState<ClientDraft>(createEmptyClientDraft);
  const [isReady, setIsReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const copy = {
    duplicateTaxId: t({
      es: "Ya existe un cliente con ese NIF. Revisalo antes de guardar los cambios.",
      en: "A client with that tax ID already exists. Review it before saving the changes.",
    }),
    clientUpdated: t({ es: "Cliente actualizado", en: "Client updated" }),
    completeLater: t({
      es: "Puedes completar nombre y NIF cuando quieras para identificar mejor esta ficha.",
      en: "You can complete the name and tax ID later to identify this record better.",
    }),
    eyebrow: t({ es: "Cliente", en: "Client" }),
    fallbackTitle: t({ es: "Cliente", en: "Client" }),
    description: t({
      es: "Revisa, actualiza o elimina esta ficha cuando lo necesites.",
      en: "Review, update, or remove this record whenever you need.",
    }),
    backToClients: t({ es: "Volver a clientes", en: "Back to clients" }),
    saveClientAria: t({ es: "Guardar cliente", en: "Save client" }),
    editClientAria: t({ es: "Editar cliente", en: "Edit client" }),
    unavailableTitle: t({ es: "Cliente no disponible", en: "Client unavailable" }),
    unavailableDescription: t({
      es: "Esta ficha ya no esta disponible en tu lista de clientes.",
      en: "This record is no longer available in your client list.",
    }),
    available: t({ es: "Disponible", en: "Available" }),
    noEmail: t({ es: "Sin email", en: "No email" }),
    noPhone: t({ es: "Sin telefono", en: "No phone" }),
    noAddress: t({ es: "Sin direccion", en: "No address" }),
    clientData: t({ es: "Datos del cliente", en: "Client details" }),
    editMode: t({ es: "Modo edicion", en: "Edit mode" }),
    savedInfo: t({ es: "Informacion guardada", en: "Saved information" }),
    cancel: t({ es: "Cancelar", en: "Cancel" }),
    refresh: t({ es: "Actualizar", en: "Refresh" }),
    namePlaceholder: t({ es: "Nombre o razon social", en: "Name or company name" }),
    taxIdPlaceholder: t({ es: "NIF / DNI", en: "Tax ID" }),
    addressPlaceholder: t({ es: "Direccion", en: "Address" }),
    postalCodePlaceholder: t({ es: "Codigo postal", en: "Postal code" }),
    cityPlaceholder: t({ es: "Ciudad", en: "City" }),
    emailPlaceholder: t({ es: "Email", en: "Email" }),
    phonePlaceholder: t({ es: "Telefono", en: "Phone" }),
    incompleteHint: t({
      es: "Puedes guardar cambios aunque falten datos y completar la ficha mas adelante.",
      en: "You can save changes even if some data is missing and complete the record later.",
    }),
    saveChanges: t({ es: "Guardar cambios", en: "Save changes" }),
    actions: t({ es: "Acciones", en: "Actions" }),
    nextSteps: t({ es: "Siguientes pasos", en: "Next steps" }),
    createInvoice: t({ es: "Crear factura", en: "Create invoice" }),
    createQuote: t({ es: "Crear presupuesto", en: "Create quote" }),
    createProforma: t({ es: "Crear proforma", en: "Create proforma" }),
    createDeliveryNote: t({ es: "Crear albaran", en: "Create delivery note" }),
    deleteClient: t({ es: "Eliminar cliente", en: "Delete client" }),
    confirmDelete: t({
      es: "Quieres eliminar este cliente de forma definitiva?",
      en: "Do you want to delete this client permanently?",
    }),
    confirmDeletion: t({ es: "Confirmar eliminacion", en: "Confirm deletion" }),
  };

  useClientLayoutEffect(() => {
    const storedClients = readClients();
    const match = findClientById(storedClients, routeClientId);

    setCliente(match.client);
    setDraft(match.client ? toClientDraft(match.client) : createEmptyClientDraft());
    setIsEditing(Boolean(match.client && shouldOpenEditMode));
    setConfirmDelete(false);
    setIsReady(true);

    if (match.client && routeClientId !== match.client.id && /^\d+$/.test(routeClientId)) {
      router.replace(`/clientes/${match.client.id}`);
    }
  }, [routeClientId, router, shouldOpenEditMode]);

  function showNotice(message: string, tone: "warning" | "success") {
    if (tone === "success") {
      showSuccessToast(message);
      return;
    }

    showWarningToast(message);
  }

  function updateDraft(field: keyof ClientDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function refreshClient() {
    const storedClients = readClients();
    const match = findClientById(storedClients, cliente?.id || routeClientId);

    if (!match.client) {
      setCliente(null);
      setDraft(createEmptyClientDraft());
      setIsEditing(false);
      return;
    }

    setCliente(match.client);
    setDraft(toClientDraft(match.client));
    setIsEditing(false);
    setConfirmDelete(false);
  }

  function cancelEdit() {
    if (!cliente) {
      return;
    }

    setDraft(toClientDraft(cliente));
    setIsEditing(false);
  }

  function saveChanges() {
    if (!cliente) {
      return;
    }

    const shouldSuggestIdentity = !draft.nombre.trim() || !draft.nif.trim();

    const storedClients = readClients();

    if (hasDuplicateTaxId(storedClients, draft.nif, cliente.id)) {
      showNotice(copy.duplicateTaxId, "warning");
      return;
    }

    const updatedClient = createClientRecord(draft, cliente);
    const updatedClients = storedClients.map((item) =>
      item.id === cliente.id ? updatedClient : item,
    );

    writeClients(updatedClients);
    setCliente(updatedClient);
    setDraft(toClientDraft(updatedClient));
    setIsEditing(false);
    showNotice(copy.clientUpdated, "success");

    if (shouldSuggestIdentity) {
      showNotice(copy.completeLater, "warning");
    }
  }

  function deleteClient() {
    if (!cliente) {
      return;
    }

    const storedClients = readClients();
    const updatedClients = storedClients.filter((item) => item.id !== cliente.id);

    writeClients(updatedClients);
    router.push("/clientes");
  }

  function startDraftFromClient(documentType: InvoiceDocumentType) {
    if (!cliente) {
      return;
    }

    const issueDate = today();
    const nextDraft = {
      id: draftId(),
      tipo: documentType,
      numero: "001",
      fecha: issueDate,
      fechaVencimiento:
        documentType === "albaran" ? "" : addDays(issueDate, 30),
      linkedClientId: cliente.id,
      cliente: {
        nombre: cliente.nombre,
        nif: cliente.nif,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        codigoPostal: cliente.codigoPostal,
        telefono: cliente.telefono,
        email: cliente.email,
      },
      empresa: {
        nombre: "",
        nif: "",
        direccion: "",
        ciudad: "",
        cp: "",
        telefono: "",
        email: "",
      },
      conceptos: [],
      deliveryDetails: {
        location: "",
        deliveredBy: "",
        receivedBy: "",
        receivedById: "",
        deliveryNotes: "",
      },
      logo: "",
      notas: "",
      tipoIVA: 21,
      ivaPorc: 21,
      plantilla: "InvoicePDF" as const,
      updatedAt: new Date().toISOString(),
    };

    writeActiveDraft(nextDraft);
    writeDrafts(upsertDraft(nextDraft, readDrafts<typeof nextDraft>()));
    router.push("/crear-factura");
  }

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
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              {cliente?.nombre || copy.fallbackTitle}
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              {copy.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={copy.backToClients}
              onClick={() => router.push("/clientes")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </button>
            <button
              type="button"
              aria-label={isEditing ? copy.saveClientAria : copy.editClientAria}
              onClick={isEditing ? saveChanges : () => setIsEditing(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
            >
              {isEditing ? (
                <Save className="h-[18px] w-[18px]" strokeWidth={2.1} />
              ) : (
                <PencilLine className="h-[18px] w-[18px]" strokeWidth={2.1} />
              )}
            </button>
          </div>
        </header>

        {!isReady ? (
          <section className="mt-6 space-y-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-[32px] border border-white/70 bg-white/72 p-6 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl"
              >
                <div className="flex animate-pulse items-start gap-4">
                  <div className="h-16 w-16 rounded-[24px] bg-slate-200/70" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-32 rounded-full bg-slate-200/70" />
                    <div className="h-4 w-24 rounded-full bg-slate-200/60" />
                    <div className="h-4 w-48 rounded-full bg-slate-200/50" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : !cliente ? (
          <section className="mt-6 rounded-[36px] border border-white/70 bg-white/72 p-8 text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(229,238,250,0.92),rgba(249,234,216,0.95))] text-slate-950 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)]">
              <UsersRound className="h-8 w-8" strokeWidth={2.1} />
            </div>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-slate-950">
              {copy.unavailableTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-slate-500">
              {copy.unavailableDescription}
            </p>
            <button
              type="button"
              onClick={() => router.push("/clientes")}
              className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-slate-950 px-7 text-[15px] font-semibold text-white shadow-[0_22px_38px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
            >
              {copy.backToClients}
            </button>
          </section>
        ) : (
          <>
            <section className="mt-6 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-slate-950 text-lg font-semibold tracking-[0.12em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.78)]">
                  {getInitials(cliente.nombre)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-[1.4rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {cliente.nombre}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {cliente.nif}
                      </p>
                    </div>

                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      {copy.available}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" strokeWidth={2} />
                      <span className="truncate">
                        {cliente.email || copy.noEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" strokeWidth={2} />
                      <span>{cliente.telefono || copy.noPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" strokeWidth={2} />
                      <span className="truncate">
                        {[cliente.direccion, cliente.codigoPostal, cliente.ciudad]
                          .filter(Boolean)
                          .join(", ") || copy.noAddress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {copy.clientData}
                  </p>
                  <h3 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.04em] text-slate-950">
                    {isEditing ? copy.editMode : copy.savedInfo}
                  </h3>
                </div>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {copy.cancel}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={refreshClient}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {copy.refresh}
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <input
                  placeholder={copy.namePlaceholder}
                  value={draft.nombre}
                  disabled={!isEditing}
                  onChange={(event) => updateDraft("nombre", event.target.value)}
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                />
                <input
                  placeholder={copy.taxIdPlaceholder}
                  value={draft.nif}
                  disabled={!isEditing}
                  onChange={(event) => updateDraft("nif", event.target.value)}
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                />
                <input
                  placeholder={copy.addressPlaceholder}
                  value={draft.direccion}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraft("direccion", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder={copy.postalCodePlaceholder}
                    value={draft.codigoPostal}
                    disabled={!isEditing}
                    onChange={(event) =>
                      updateDraft("codigoPostal", event.target.value)
                    }
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                  />
                  <input
                    placeholder={copy.cityPlaceholder}
                    value={draft.ciudad}
                    disabled={!isEditing}
                    onChange={(event) => updateDraft("ciudad", event.target.value)}
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                  />
                </div>
                <input
                  placeholder={copy.emailPlaceholder}
                  value={draft.email}
                  disabled={!isEditing}
                  onChange={(event) => updateDraft("email", event.target.value)}
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                />
                <input
                  placeholder={copy.phonePlaceholder}
                  value={draft.telefono}
                  disabled={!isEditing}
                  onChange={(event) =>
                    updateDraft("telefono", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)] disabled:cursor-default disabled:bg-slate-50/80"
                />
              </div>

              {isEditing ? (
                <>
                  <p className="mt-6 text-sm leading-6 text-slate-500">
                    {copy.incompleteHint}
                  </p>
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                  >
                    <CircleCheckBig className="h-4 w-4" strokeWidth={2.2} />
                    {copy.saveChanges}
                  </button>
                </>
              ) : null}
            </section>

            <section className="mt-5 rounded-[34px] border border-white/70 bg-white/76 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {copy.actions}
              </p>
              <h3 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.04em] text-slate-950">
                {copy.nextSteps}
              </h3>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => startDraftFromClient("factura")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                >
                  <ReceiptText className="h-4 w-4" strokeWidth={2.2} />
                  {copy.createInvoice}
                </button>
                <button
                  type="button"
                  onClick={() => startDraftFromClient("presupuesto")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <CirclePlus className="h-4 w-4" strokeWidth={2.2} />
                  {copy.createQuote}
                </button>
                <button
                  type="button"
                  onClick={() => startDraftFromClient("proforma")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                >
                  <CirclePlus className="h-4 w-4" strokeWidth={2.2} />
                  {copy.createProforma}
                </button>
                <button
                  type="button"
                  onClick={() => startDraftFromClient("albaran")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  <CirclePlus className="h-4 w-4" strokeWidth={2.2} />
                  {copy.createDeliveryNote}
                </button>

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                    {copy.deleteClient}
                  </button>
                ) : (
                  <div className="rounded-[26px] border border-red-200 bg-red-50/90 p-4 text-center">
                    <p className="text-sm font-medium text-red-700">
                      {copy.confirmDelete}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {copy.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={deleteClient}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        {copy.confirmDeletion}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
