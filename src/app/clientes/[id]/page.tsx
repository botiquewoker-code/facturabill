"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ClienteDetalle() {
  const params = useParams();
  const router = useRouter();

  const [cliente, setCliente] = useState<any>(null);

  useEffect(() => {
    const guardados = localStorage.getItem("clientes");

    if (!guardados) return;

    const lista = JSON.parse(guardados);

    const clienteEncontrado = lista[params.id as any];

    if (clienteEncontrado) {
      setCliente(clienteEncontrado);
    }
  }, [params.id]);

  function eliminarCliente() {
    const guardados = localStorage.getItem("clientes");
    if (!guardados) return;

    const lista = JSON.parse(guardados);

    lista.splice(params.id as any, 1);

    localStorage.setItem("clientes", JSON.stringify(lista));

    router.push("/clientes");
  }

  if (!cliente) {
    return <div className="p-6">Cliente no encontrado</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Cliente</h1>

      <div className="mt-6 space-y-2">
        <p>
          <strong>Nombre:</strong> {cliente.nombre}
        </p>
        <p>
          <strong>NIF:</strong> {cliente.nif}
        </p>
        <p>
          <strong>Email:</strong> {cliente.email}
        </p>
        <p>
          <strong>Teléfono:</strong> {cliente.telefono}
        </p>
        <p>
          <strong>Dirección:</strong> {cliente.direccion}
        </p>

        <p>
          <strong>Código postal:</strong> {cliente.cp}
        </p>

        <p>
          <strong>Ciudad:</strong> {cliente.ciudad}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => router.push(`/crear-factura?cliente=${params.id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Crear factura
        </button>

        <button className="border px-4 py-2 rounded-lg">Editar cliente</button>

        <button
          onClick={eliminarCliente}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Eliminar cliente
        </button>
      </div>
    </div>
  );
}
