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
        <h1 style={{ fontSize: "36px", marginBottom: "20px", color: "#222" }}>
          Crear factura legal y sin registro y al instante
        </h1>

        <p style={{ fontSize: "20px", marginBottom: "15px", color: "#444" }}>
          Genera tu factura directamente desde el navegador.
          No necesitas cuenta ni datos personales.
        </p>

        <p style={{ fontSize: "18px", marginBottom: "40px", color: "#555" }}>
          Ideal para cuando necesitas enviar una factura rápida
          sin perder tiempo creando perfiles.
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
            Crear factura ahora
          </button>
        </Link>
      </div>
    </div>
  );
}
