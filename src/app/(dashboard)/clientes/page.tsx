"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  CirclePlus,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import {
  createClientRecord,
  createEmptyClientDraft,
  hasDuplicateTaxId,
  readClients,
  type ClientDraft,
  type ClientRecord,
  writeClients,
} from "@/features/clients/storage";
import {
  showSuccessToast,
  showWarningToast,
} from "@/features/notifications/toast";

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getInitials(nombre: string): string {
  const initials = nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "CL";
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClientRecord[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [nuevoCliente, setNuevoCliente] =
    useState<ClientDraft>(createEmptyClientDraft);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setClientes(readClients());
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return clientes.filter((cliente) => {
      if (!termino) {
        return true;
      }

      return [cliente.nombre, cliente.nif, cliente.email]
        .join(" ")
        .toLowerCase()
        .includes(termino);
    });
  }, [busqueda, clientes]);

  function updateNuevoCliente(field: keyof ClientDraft, value: string) {
    setNuevoCliente((current) => ({ ...current, [field]: value }));
  }

  function refreshClients() {
    setClientes(readClients());
  }

  function openModal() {
    setNuevoCliente(createEmptyClientDraft());
    setMostrarModal(true);
  }

  function closeModal() {
    setMostrarModal(false);
    setNuevoCliente(createEmptyClientDraft());
  }

  function sonidoError() {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as WindowWithWebkitAudio).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const audioCtx = new AudioContextConstructor();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);

    window.setTimeout(() => {
      void audioCtx.close();
    }, 260);
  }

  function showNotice(message: string, tone: "warning" | "success") {
    if (tone === "success") {
      showSuccessToast(message);
      return;
    }

    showWarningToast(message);
  }

  function guardarCliente() {
    const shouldSuggestIdentity =
      !nuevoCliente.nombre.trim() || !nuevoCliente.nif.trim();

    if (hasDuplicateTaxId(clientes, nuevoCliente.nif)) {
      showNotice(
        "Ya existe un cliente con ese NIF. Revisalo antes de guardar otro parecido.",
        "warning",
      );
      sonidoError();
      return;
    }

    const clienteGuardado = createClientRecord(nuevoCliente);
    const actualizados = [clienteGuardado, ...clientes];

    setClientes(actualizados);
    writeClients(actualizados);
    closeModal();
    showNotice("Cliente guardado", "success");

    if (shouldSuggestIdentity) {
      showNotice(
        "Puedes completar nombre y NIF mas adelante para identificar mejor esta ficha.",
        "warning",
      );
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#edf3fb_42%,#eef2f7_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 top-20 h-44 w-44 rounded-full bg-[#f4d7bc]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-64 h-52 w-52 rounded-full bg-[#dce8ff]/80 blur-3xl" />

      <main
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-6 font-sans"
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Clientes
            </p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Agenda de clientes
            </h1>
            <p className="mt-3 max-w-xs text-[15px] leading-6 text-slate-500">
              Organiza tus contactos y tenlos listos para la proxima factura.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Nuevo cliente"
              onClick={openModal}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.82)] transition hover:bg-slate-800"
            >
              <CirclePlus className="h-[18px] w-[18px]" strokeWidth={2.1} />
            </button>
            <button
              type="button"
              aria-label="Actualizar lista de clientes"
              onClick={refreshClients}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:bg-white"
            >
              <SlidersHorizontal
                className="h-[18px] w-[18px]"
                strokeWidth={2.1}
              />
            </button>
          </div>
        </header>

        <div className="mt-6 rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_45px_-26px_rgba(15,23,42,0.32)] backdrop-blur-xl">
          <label className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,0.8)]">
              <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre, NIF o email"
              className="h-11 w-full border-0 bg-transparent text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <section className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Tus contactos
            </p>
            <h2 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-950">
              Clientes guardados
            </h2>
          </div>

          <div className="rounded-full border border-white/70 bg-white/72 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_16px_32px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            {clientes.length} total
          </div>
        </section>

        <section className="mt-5 flex flex-1 flex-col gap-4">
          {!isReady ? (
            <>
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-[30px] border border-white/70 bg-white/72 p-5 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                >
                  <div className="flex animate-pulse items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200/70" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-28 rounded-full bg-slate-200/70" />
                      <div className="h-3 w-20 rounded-full bg-slate-200/60" />
                      <div className="h-3 w-40 rounded-full bg-slate-200/50" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : clientes.length === 0 ? (
            <div className="rounded-[36px] border border-white/70 bg-white/72 p-8 text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(229,238,250,0.92),rgba(249,234,216,0.95))] text-slate-950 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)]">
                <UsersRound className="h-8 w-8" strokeWidth={2.1} />
              </div>
              <h3 className="text-[1.6rem] font-semibold tracking-[-0.04em] text-slate-950">
                Todavia no hay clientes
              </h3>
              <p className="mt-3 text-[15px] leading-6 text-slate-500">
                Anade tu primer cliente para tener sus datos a mano en
                facturas y presupuestos.
              </p>
              <button
                type="button"
                onClick={openModal}
                className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-slate-950 px-7 text-[15px] font-semibold text-white shadow-[0_22px_38px_-24px_rgba(15,23,42,0.95)] transition hover:bg-slate-800"
              >
                Anadir primer cliente
              </button>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="rounded-[32px] border border-white/70 bg-white/72 p-7 text-center shadow-[0_28px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur-xl">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                No hay coincidencias
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Prueba con otra busqueda o limpia el filtro actual.
              </p>
              <button
                type="button"
                onClick={() => setBusqueda("")}
                className="mt-5 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Limpiar busqueda
              </button>
            </div>
          ) : (
            clientesFiltrados.map((cliente) => (
              <Link
                key={cliente.id}
                href={`/clientes/${cliente.id}`}
                className="group block rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-slate-950 text-sm font-semibold tracking-[0.14em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.78)]">
                    {getInitials(cliente.nombre)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-950">
                          {cliente.nombre || "Cliente sin nombre"}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {cliente.nif || "Sin NIF"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-[0_12px_22px_-18px_rgba(15,23,42,0.35)]">
                        <span>Abrir</span>
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" strokeWidth={2} />
                        <span className="truncate">
                          {cliente.email || "Sin email"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone
                          className="h-4 w-4 text-slate-400"
                          strokeWidth={2}
                        />
                        <span>{cliente.telefono || "Sin telefono"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin
                          className="h-4 w-4 text-slate-400"
                          strokeWidth={2}
                        />
                        <span className="truncate">
                          {[cliente.direccion, cliente.codigoPostal, cliente.ciudad]
                            .filter(Boolean)
                            .join(", ") || "Sin direccion"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-slate-500"
                    strokeWidth={2.2}
                  />
                </div>
              </Link>
            ))
          )}
        </section>
      </main>

      {mostrarModal ? (
        <div className="fixed inset-0 z-40 bg-slate-950/28 px-4 pb-4 pt-10 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[430px]">
            <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,251,0.94))] p-6 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.6)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    Nuevo cliente
                  </p>
                  <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-950">
                    Crear ficha
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={closeModal}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-slate-700 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.42)] backdrop-blur-xl transition hover:bg-white"
                >
                  <X className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-sm leading-6 text-slate-500">
                  Puedes guardar la ficha con datos parciales y completarla
                  cuando lo necesites.
                </p>
                <input
                  placeholder="Nombre o razon social"
                  value={nuevoCliente.nombre}
                  onChange={(event) =>
                    updateNuevoCliente("nombre", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <input
                  placeholder="NIF / DNI"
                  value={nuevoCliente.nif}
                  onChange={(event) =>
                    updateNuevoCliente("nif", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <input
                  placeholder="Direccion"
                  value={nuevoCliente.direccion}
                  onChange={(event) =>
                    updateNuevoCliente("direccion", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Codigo postal"
                    value={nuevoCliente.codigoPostal}
                    onChange={(event) =>
                      updateNuevoCliente("codigoPostal", event.target.value)
                    }
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                  <input
                    placeholder="Ciudad"
                    value={nuevoCliente.ciudad}
                    onChange={(event) =>
                      updateNuevoCliente("ciudad", event.target.value)
                    }
                    className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                  />
                </div>
                <input
                  placeholder="Email"
                  value={nuevoCliente.email}
                  onChange={(event) =>
                    updateNuevoCliente("email", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
                <input
                  placeholder="Telefono"
                  value={nuevoCliente.telefono}
                  onChange={(event) =>
                    updateNuevoCliente("telefono", event.target.value)
                  }
                  className="h-14 w-full rounded-[22px] border border-white/70 bg-white/80 px-4 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.4)]"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarCliente}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_34px_-24px_rgba(15,23,42,0.9)] transition hover:bg-slate-800"
                >
                  Guardar cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
