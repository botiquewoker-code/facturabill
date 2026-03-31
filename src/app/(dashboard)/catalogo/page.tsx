"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  CirclePlus,
  Copy,
  Package,
  PenSquare,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  Tags,
  X,
} from "lucide-react";
import {
  createCatalogItem,
  createEmptyCatalogItemDraft,
  readCatalogItems,
  type CatalogDocumentType,
  type CatalogItem,
  type CatalogItemDraft,
  writeCatalogItems,
} from "@/features/catalog/storage";
import {
  getUserFirstName,
  readUserProfile,
} from "@/features/account/profile";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";
import AppScreenLoader from "@/features/ui/AppScreenLoader";

const inputClass =
  "h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]";
const documentOptions: Array<{ id: CatalogDocumentType; label: string }> = [
  { id: "factura", label: "Facturas" },
  { id: "presupuesto", label: "Presupuestos" },
  { id: "albaran", label: "Albaranes" },
];
const unitOptions = ["ud", "hora", "dia", "mes", "kg", "m", "proyecto"];

function getInitials(value: string) {
  const initials = value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "CT";
}

function getTypeCopy(type: CatalogItem["type"]) {
  if (type === "producto") {
    return {
      label: "Producto",
      Icon: Package,
      badgeClass: "border-[#edcfab] bg-[#fff5e9] text-[#8a5a33]",
      accentClass:
        "bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(255,245,233,0.98),rgba(246,225,201,0.92))] text-[#8a5a33]",
    };
  }

  return {
    label: "Servicio",
    Icon: BriefcaseBusiness,
    badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
    accentClass:
      "bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(236,243,251,0.98),rgba(224,232,243,0.94))] text-slate-700",
  };
}

export default function CatalogoPage() {
  const [isReady, setIsReady] = useState(false);
  const [hasRegisteredUser, setHasRegisteredUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CatalogItem["type"]>(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | CatalogItem["status"]
  >("active");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState("");
  const [draft, setDraft] = useState<CatalogItemDraft>(createEmptyCatalogItemDraft);

  const refreshCatalog = () => {
    setItems(readCatalogItems());
  };

  useEffect(() => {
    const syncViewState = () => {
      const profile = readUserProfile();
      const name = getUserFirstName(profile);

      setFirstName(name);
      setHasRegisteredUser(name.length > 0);
      refreshCatalog();
      setIsReady(true);
    };
    const frame = window.requestAnimationFrame(() => {
      syncViewState();
    });

    window.addEventListener("focus", syncViewState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", syncViewState);
    };
  }, []);

  const summary = useMemo(() => {
    const active = items.filter((item) => item.status === "active").length;
    const archived = items.filter((item) => item.status === "archived").length;
    const products = items.filter((item) => item.type === "producto").length;
    const services = items.filter((item) => item.type === "servicio").length;

    return { active, archived, products, services };
  }, [items]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((item) => item.category.trim())
            .filter((item) => item.length > 0),
        ),
      ).sort((left, right) => left.localeCompare(right, "es")),
    [items],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        item.category.trim().toLowerCase() !== categoryFilter.toLowerCase()
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        item.name,
        item.description,
        item.sku,
        item.category,
        item.unit,
        item.internalNotes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [categoryFilter, items, search, statusFilter, typeFilter]);

  const openCreateModal = () => {
    setEditingItemId("");
    setDraft(createEmptyCatalogItemDraft());
    setShowModal(true);
  };

  const openEditModal = (item: CatalogItem) => {
    setEditingItemId(item.id);
    setDraft({
      type: item.type,
      name: item.name,
      description: item.description,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      basePrice: item.basePrice,
      taxRate: item.taxRate,
      internalNotes: item.internalNotes,
      supportedDocuments: [...item.supportedDocuments],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItemId("");
    setDraft(createEmptyCatalogItemDraft());
  };

  const updateDraftField = <T extends keyof CatalogItemDraft>(
    field: T,
    value: CatalogItemDraft[T],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleSupportedDocument = (documentId: CatalogDocumentType) => {
    setDraft((current) => {
      const exists = current.supportedDocuments.includes(documentId);

      if (exists && current.supportedDocuments.length === 1) {
        showWarningToast(
          "Selecciona al menos un tipo de documento para esta referencia.",
        );
        return current;
      }

      return {
        ...current,
        supportedDocuments: exists
          ? current.supportedDocuments.filter((item) => item !== documentId)
          : [...current.supportedDocuments, documentId],
      };
    });
  };

  const saveItem = () => {
    if (!draft.name.trim()) {
      showWarningToast("Anade un nombre para guardar esta referencia.");
      return;
    }

    const existingItem = items.find((item) => item.id === editingItemId);
    const nextItem = createCatalogItem(
      draft,
      existingItem,
      existingItem ? { preserveStatus: true } : undefined,
    );
    const nextItems = existingItem
      ? items.map((item) => (item.id === existingItem.id ? nextItem : item))
      : [nextItem, ...items];

    writeCatalogItems(nextItems);
    refreshCatalog();
    closeModal();
    showSuccessToast(existingItem ? "Referencia actualizada" : "Referencia creada");
  };

  const duplicateItem = (item: CatalogItem) => {
    const duplicated = createCatalogItem({
      type: item.type,
      name: item.name.trim() ? `${item.name} copia` : "Nueva referencia",
      description: item.description,
      sku: "",
      category: item.category,
      unit: item.unit,
      basePrice: item.basePrice,
      taxRate: item.taxRate,
      internalNotes: item.internalNotes,
      supportedDocuments: [...item.supportedDocuments],
    });

    writeCatalogItems([duplicated, ...items]);
    refreshCatalog();
    showSuccessToast("Referencia duplicada");
  };

  const toggleArchive = (item: CatalogItem) => {
    const nextStatus = item.status === "active" ? "archived" : "active";
    const updatedItem = {
      ...createCatalogItem(item, item, { preserveStatus: true }),
      status: nextStatus as CatalogItem["status"],
    };

    writeCatalogItems(
      items.map((current) => (current.id === item.id ? updatedItem : current)),
    );
    refreshCatalog();
    showSuccessToast(
      nextStatus === "archived"
        ? "Referencia archivada"
        : "Referencia reactivada",
    );
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("active");
    setCategoryFilter("all");
  };

  if (!isReady) {
    return (
      <AppScreenLoader
        eyebrow="Catalogo"
        title="Productos y servicios"
        description="Estamos preparando tus referencias y preferencias guardadas."
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />
      <main
        className="relative mx-auto min-h-screen w-full max-w-[430px] px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        {!hasRegisteredUser ? (
          <>
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Catalogo
                </p>
                <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
                  Referencias reutilizables
                </h1>
                <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
                  Organiza productos y servicios para reutilizarlos en
                  facturas, presupuestos y albaranes.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)]">
                <ReceiptText className="h-5 w-5" strokeWidth={2.1} />
              </div>
            </header>

            <section className="mt-8 rounded-[34px] border border-white/70 bg-white/82 p-6 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 text-white shadow-[0_22px_35px_-24px_rgba(15,23,42,0.75)]">
                <ShieldCheck className="h-6 w-6" strokeWidth={2.1} />
              </div>
              <h2 className="mt-5 text-[1.55rem] font-semibold tracking-[-0.04em] text-slate-950">
                Activa tu catalogo profesional
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                El catalogo es una funcion avanzada. Crea tu cuenta o inicia
                sesion para guardar precios, categorias y referencias listas
                para usar en tus documentos.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[24px] border border-[#edcfab] bg-[#fff5e9] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#8a5a33]">
                      <Package className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        Productos
                      </p>
                      <p className="text-sm leading-6 text-slate-500">
                        Precio, unidad, impuesto y categoria.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white/84 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <BriefcaseBusiness className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        Servicios
                      </p>
                      <p className="text-sm leading-6 text-slate-500">
                        Conceptos reutilizables para cada presupuesto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Link
                  href="/registro"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Crear cuenta
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Iniciar sesion
                </Link>
              </div>
            </section>
          </>
        ) : (
          <>
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  {firstName ? `${firstName}, tu catalogo` : "Catalogo"}
                </p>
                <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
                  Productos y servicios
                </h1>
                <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
                  Centraliza referencias reutilizables para facturas,
                  presupuestos y albaranes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Nueva referencia"
                  onClick={openCreateModal}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white transition hover:bg-slate-800"
                >
                  <CirclePlus className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </button>
                <button
                  type="button"
                  aria-label="Actualizar catalogo"
                  onClick={refreshCatalog}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 transition hover:bg-white"
                >
                  <RefreshCw className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </button>
              </div>
            </header>

            <section className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: "Activas", value: summary.active, Icon: ShieldCheck },
                { label: "Productos", value: summary.products, Icon: Package },
                {
                  label: "Servicios",
                  value: summary.services,
                  Icon: BriefcaseBusiness,
                },
                { label: "Archivadas", value: summary.archived, Icon: Archive },
              ].map(({ label, value, Icon }) => (
                <div
                  key={label}
                  className="rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <Icon className="h-4 w-4 text-slate-600" strokeWidth={2.1} />
                  </div>
                  <p className="mt-4 text-[1.55rem] font-semibold tracking-[-0.04em]">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-6 rounded-[30px] border border-white/70 bg-white/82 p-4 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)]">
              <label className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, codigo o categoria"
                  className="h-11 w-full border-0 bg-transparent text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Todo" },
                  { id: "producto", label: "Productos" },
                  { id: "servicio", label: "Servicios" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setTypeFilter(option.id as "all" | CatalogItem["type"])
                    }
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      typeFilter === option.id
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { id: "active", label: "Activos" },
                  { id: "archived", label: "Archivados" },
                  { id: "all", label: "Todos" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setStatusFilter(option.id as "all" | CatalogItem["status"])
                    }
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      statusFilter === option.id
                        ? "bg-[#8a5a33] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Tags className="h-4 w-4" strokeWidth={2.1} />
                  Categoria
                </span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className={inputClass}
                >
                  <option value="all">Todas las categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section className="mt-6 space-y-4">
              {items.length === 0 ? (
                <div className="rounded-[36px] border border-white/70 bg-white/74 p-8 text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)]">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(229,238,250,0.92),rgba(249,234,216,0.95))] text-slate-950">
                    <ReceiptText className="h-9 w-9" strokeWidth={1.9} />
                  </div>
                  <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-slate-950">
                    Crea tu primera referencia
                  </h2>
                  <p className="mt-3 text-[15px] leading-6 text-slate-500">
                    Guarda productos o servicios para insertarlos despues en tus
                    documentos.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <CirclePlus className="h-4 w-4" strokeWidth={2.2} />
                    Nueva referencia
                  </button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="rounded-[32px] border border-white/70 bg-white/76 p-6 text-center shadow-[0_26px_60px_-38px_rgba(15,23,42,0.4)]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-100 text-slate-600">
                    <Search className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <h2 className="mt-5 text-[1.3rem] font-semibold tracking-[-0.04em] text-slate-950">
                    No hay resultados con esos filtros
                  </h2>
                  <p className="mt-3 text-[15px] leading-6 text-slate-500">
                    Ajusta la busqueda o limpia los filtros para ver tus
                    referencias.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const typeCopy = getTypeCopy(item.type);
                  const TypeIcon = typeCopy.Icon;

                  return (
                    <article
                      key={item.id}
                      className="rounded-[30px] border border-white/70 bg-white/82 p-5 shadow-[0_26px_60px_-38px_rgba(15,23,42,0.4)]"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-sm font-semibold ${typeCopy.accentClass}`}
                        >
                          {getInitials(item.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-[1.15rem] font-semibold tracking-[-0.03em] text-slate-950">
                              {item.name || "Referencia sin nombre"}
                            </h2>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${typeCopy.badgeClass}`}
                            >
                              <TypeIcon className="h-3.5 w-3.5" />
                              {typeCopy.label}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                              {item.status === "archived" ? "Archivado" : "Activo"}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white">
                              {new Intl.NumberFormat("es-ES", {
                                style: "currency",
                                currency: "EUR",
                              }).format(item.basePrice)}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                              IVA {item.taxRate}%
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.description ? (
                        <p className="mt-4 text-[15px] leading-6 text-slate-500">
                          {item.description}
                        </p>
                      ) : null}

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-[22px] bg-[#f7f6f3] px-4 py-3">
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                            Categoria
                          </p>
                          <p className="mt-1 font-semibold text-slate-700">
                            {item.category || "Sin categoria"}
                          </p>
                        </div>
                        <div className="rounded-[22px] bg-[#f7f6f3] px-4 py-3">
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                            Codigo
                          </p>
                          <p className="mt-1 font-semibold text-slate-700">
                            {item.sku || "Sin codigo"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {documentOptions
                          .filter((option) =>
                            item.supportedDocuments.includes(option.id),
                          )
                          .map((option) => (
                            <span
                              key={option.id}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                            >
                              {option.label}
                            </span>
                          ))}
                      </div>

                      {item.internalNotes ? (
                        <div className="mt-4 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/85 px-4 py-3">
                          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                            Nota interna
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.internalNotes}
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <PenSquare className="h-4 w-4" strokeWidth={2.1} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateItem(item)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Copy className="h-4 w-4" strokeWidth={2.1} />
                          Duplicar
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleArchive(item)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Archive className="h-4 w-4" strokeWidth={2.1} />
                          {item.status === "archived" ? "Activar" : "Archivar"}
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          </>
        )}
      </main>

      {showModal ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-4 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center py-2 sm:items-end sm:py-6">
          <div className="relative w-full max-w-[430px] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[34px] border border-white/70 bg-[#f8f6f1] p-6 shadow-[0_36px_80px_-42px_rgba(15,23,42,0.6)]">
            <button
              type="button"
              aria-label="Cerrar"
              onClick={closeModal}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>

            <div className="pr-12">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Catalogo
              </p>
              <h2 className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-slate-950">
                {editingItemId ? "Editar referencia" : "Nueva referencia"}
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                Define los datos base para reutilizar esta referencia en tus
                documentos.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { id: "producto", label: "Producto", Icon: Package },
                { id: "servicio", label: "Servicio", Icon: BriefcaseBusiness },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    updateDraftField("type", id as CatalogItem["type"])
                  }
                  className={`rounded-[24px] border px-4 py-4 text-left transition ${
                    draft.type === id
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-white/70 bg-white/82 text-slate-700"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                  <p className="mt-4 text-sm font-semibold">{label}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <input
                placeholder="Nombre"
                value={draft.name}
                onChange={(event) => updateDraftField("name", event.target.value)}
                className={inputClass}
              />
              <textarea
                rows={3}
                placeholder="Descripcion visible en el documento"
                value={draft.description}
                onChange={(event) =>
                  updateDraftField("description", event.target.value)
                }
                className="min-h-[100px] w-full rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Codigo o SKU"
                  value={draft.sku}
                  onChange={(event) =>
                    updateDraftField("sku", event.target.value)
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Categoria"
                  value={draft.category}
                  onChange={(event) =>
                    updateDraftField("category", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={draft.unit}
                  onChange={(event) => updateDraftField("unit", event.target.value)}
                  className={inputClass}
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.basePrice === 0 ? "" : draft.basePrice}
                  onChange={(event) =>
                    updateDraftField(
                      "basePrice",
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                  placeholder="Precio base"
                  className={inputClass}
                />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.taxRate}
                onChange={(event) =>
                  updateDraftField(
                    "taxRate",
                    Math.max(0, Number(event.target.value) || 0),
                  )
                }
                placeholder="IVA por defecto"
                className={inputClass}
              />
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-slate-600">
                Disponible para
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {documentOptions.map((option) => {
                  const active = draft.supportedDocuments.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleSupportedDocument(option.id)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Notas internas para tu equipo"
              value={draft.internalNotes}
              onChange={(event) =>
                updateDraftField("internalNotes", event.target.value)
              }
              className="mt-6 min-h-[92px] w-full rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
            />

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={saveItem}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {editingItemId ? "Guardar cambios" : "Guardar referencia"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
