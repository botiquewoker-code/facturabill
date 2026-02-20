import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        background: "#FFF9E6",
        minHeight: "100vh",
        padding: "80px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "38px",
            marginBottom: "20px",
            color: "#222",
          }}
        >
          Crea facturas profesionales en 30 segundos
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "15px", color: "#444" }}>
          Sin registro. Sin complicaciones. Totalmente gratis.
        </p>

        <p style={{ fontSize: "18px", marginBottom: "40px", color: "#555" }}>
          Diseñada para autónomos y pequeñas empresas que necesitan
          generar y enviar facturas rápidas a sus clientes.
        </p>

        <Link href="/">
          <button
            style={{
              background: "#FFD54F",
              border: "none",
              padding: "16px 34px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            Crear mi factura ahora
          </button>
        </Link>
      </div>
    </div>
  );
}
