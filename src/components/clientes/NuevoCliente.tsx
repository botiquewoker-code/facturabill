"use client";
import React, { useState, useEffect } from "react";

export default function NuevoCliente({ onCerrar }) {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    dni: "",
  });
  const [confirmado, setConfirmado] = useState(false);

  // Cargar clientes guardados en localStorage al iniciar
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("clientes") || "[]");
    setClientes(guardados);
  }, []);

  const guardarCliente = () => {
    const nuevos = [...clientes, nuevoCliente];
    setClientes(nuevos);
    localStorage.setItem("clientes", JSON.stringify(nuevos));

    // Flecha verde de confirmación
    setConfirmado(true);

    // Limpiar formulario y cerrar cuadro después de 1.5s
    setTimeout(() => {
      setNuevoCliente({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        dni: "",
      });
      setConfirmado(false);
      onCerrar();
    }, 1500);
  };

  return (
    <div className="bg-white p-6 mt-4 rounded-xl shadow-lg max-w-md relative">
      <h2 className="text-xl font-bold mb-4">Nuevo Cliente</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nuevoCliente.nombre}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
        }
        className="w-full border rounded-lg p-2 mb-3"
      />
      <input
        type="email"
        placeholder="Email"
        value={nuevoCliente.email}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, email: e.target.value })
        }
        className="w-full border rounded-lg p-2 mb-3"
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={nuevoCliente.telefono}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
        }
        className="w-full border rounded-lg p-2 mb-3"
      />
      <input
        type="text"
        placeholder="Dirección"
        value={nuevoCliente.direccion}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
        }
        className="w-full border rounded-lg p-2 mb-3"
      />
      <input
        type="text"
        placeholder="DNI / NIE"
        value={nuevoCliente.dni}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, dni: e.target.value })
        }
        className="w-full border rounded-lg p-2 mb-4"
      />

      <button
        onClick={guardarCliente}
        className="w-full bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700"
      >
        Guardar
      </button>

      {confirmado && (
        <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full animate-bounce">
          ✔
        </div>
      )}
    </div>
  );
}
