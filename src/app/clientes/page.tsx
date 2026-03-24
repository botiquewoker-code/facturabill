"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const router = useRouter();

  const [clientes, setClientes] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [aviso, setAviso] = useState("");

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    nif: "",
    email: "",
    telefono: "",
    direccion: "",
    codigoPostal: "",
    ciudad: "",
  });

  useEffect(() => {
    const guardados = localStorage.getItem("clientes");
    if (guardados) {
      setClientes(JSON.parse(guardados));
    }
  }, []);

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.nif.toLowerCase().includes(busqueda.toLowerCase()),
  );
  function sonidoError() {
    const audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  }

  function guardarCliente() {
    const existe = clientes.some((c) => c.nif === nuevoCliente.nif);

    if (existe) {
      setAviso("Ya existe un cliente con ese NIF");
      sonidoError();

      setTimeout(() => {
        setAviso("");
      }, 3000);

      return;
    }
    const actualizados = [...clientes, nuevoCliente];

    setClientes(actualizados);

    localStorage.setItem("clientes", JSON.stringify(actualizados));

    setNuevoCliente({
      nombre: "",
      nif: "",
      email: "",
      telefono: "",
      direccion: "",
      codigoPostal: "",
      ciudad: "",
    });

    setMostrarModal(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {aviso && (
        <div className="fixed top-6 left-0 right-0 flex justify-center z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl font-medium">
            ⚠ {aviso}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">Clientes</h1>

      <p className="text-gray-500 mt-1">Busca o crea nuevos clientes</p>

      {/* buscador */}

      <div className="mt-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cliente o NIF..."
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* botones */}

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Nuevo cliente
        </button>
      </div>

      {/* resultados */}

      <div className="mt-6 space-y-3">
        {clientesFiltrados.map((cliente, index) => (
          <div
            key={index}
            onClick={() => router.push(`/clientes/${index}`)}
            className="border rounded-xl p-4 bg-white shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <div className="font-semibold">{cliente.nombre}</div>

            <div className="text-sm text-gray-500">{cliente.nif}</div>
          </div>
        ))}

        {clientesFiltrados.length === 0 && (
          <p className="text-sm text-gray-400">No hay clientes</p>
        )}
      </div>

      {/* modal nuevo cliente */}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="font-semibold text-lg">Nuevo cliente</h2>

            <div className="mt-4 space-y-3">
              <input
                placeholder="Nombre"
                value={nuevoCliente.nombre || ""}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="NIF"
                value={nuevoCliente.nif || ""}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, nif: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Dirección"
                value={nuevoCliente.direccion || ""}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    direccion: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Ciudad"
                value={nuevoCliente.ciudad || ""}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, ciudad: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Código Postal"
                value={nuevoCliente.codigoPostal || ""}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    codigoPostal: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Email"
                value={nuevoCliente.email || ""}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Teléfono"
                value={nuevoCliente.telefono || ""}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={guardarCliente}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
