"use client";

import { useState } from "react";

export default function EliminarCuenta() {
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = () => setModalOpen(true);
  const cerrarModal = () => setModalOpen(false);

  const eliminarCuenta = () => {
    cerrarModal();
    alert("Cuenta eliminada correctamente");
    // fetch('/api/eliminar-cuenta', { method: 'POST' })
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#d32f2f" }}>Eliminar cuenta</h1>
        <p>Si deseas eliminar tu cuenta Sigue los pasos:</p>

        <p>
          Eliminaremos tu cuenta y datos asociados en un plazo máximo de 48
          horas.
        </p>
        <button
          onClick={abrirModal}
          style={{
            background: "#e53935",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Eliminar cuenta
        </button>
      </div>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h3>¿Estás seguro?</h3>
            <p>Tu cuenta se eliminará definitivamente.</p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={eliminarCuenta}
                style={{
                  background: "#e53935",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Sí, eliminar
              </button>
              <button
                onClick={cerrarModal}
                style={{
                  background: "#ccc",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
