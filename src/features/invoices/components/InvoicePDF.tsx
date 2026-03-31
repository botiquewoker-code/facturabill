import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image as PdfImage,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import { normalizeDeliveryDetails } from "@/features/invoices/delivery-details";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff" },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  leftColumn: { width: "50%" },
  rightColumn: { width: "50%" },
  logo: { width: 100, height: 100, marginBottom: 20 },
  companyName: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  companyDetail: { fontSize: 11, marginBottom: 2 },

  /* TÍTULO Y FICHA */
  titleSection: { alignItems: "flex-end" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40 },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },

  /* CUADRO CLIENTE */
  clientBox: {
    borderRadius: 6,
    padding: 10,
    width: 260,
    marginTop: 10,
    backgroundColor: "#f8f9fa", // gris muy suave
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  clientLabel: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1f2937",
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#111827",
  },
  clientValue: {
    fontSize: 11,
    marginBottom: 0,
    color: "#374151",
  },

  /* TABLA DE CONCEPTOS */
  table: {
    width: "100%",
    marginBottom: 20, // espacio con el siguiente bloque
    borderWidth: 1, // opcional, borde de la tabla
    borderColor: "#ccc",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#dbeafe",
    paddingVertical: 4, // menos alto
    paddingHorizontal: 6, // espacio interno horizontal
    fontWeight: "bold",
    fontSize: 11, // más compacto
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 4, // reduce altura de fila
    paddingHorizontal: 6,
    fontSize: 10,
  },
  colConcept: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },

  /* TOTALES */
  totalsBox: {
    flexDirection: "column",
    alignSelf: "flex-end",
    width: 200,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    marginTop: 5,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    backgroundColor: "#FFF9C4",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },

  /* NOTAS */
  notesBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#f9f9f9",
  },
  notesLabel: { fontSize: 12, fontWeight: "bold", marginBottom: 8 },
  notesText: { fontSize: 11, lineHeight: 1.5 },
});

type PdfParty = {
  nombre?: string;
  nif?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  cp?: string;
  codigoPostal?: string;
};

type PdfDatos = {
  documentType?: InvoiceDocumentType;
  esPresupuesto?: boolean;
  fecha?: string;
  fechaVencimiento?: string;
  logo?: string;
  empresa: PdfParty;
  cliente: PdfParty;
  deliveryDetails?: unknown;
  notas?: string;
  tipoIVA?: number;
  tipiIVA?: number;
  ivaPct?: number;
  taxLabel?: string;
  taxNote?: string;
};

type PdfConcepto = {
  desc: string;
  cant: number;
  precio: number;
};

const formatDocumentDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("es-ES");
};

const joinParts = (parts: Array<string | undefined>) =>
  parts.map((part) => (part || "").trim()).filter(Boolean).join(" · ");

const InvoicePDF = ({
  datos,
  numeroFactura,
  conceptos = [],
}: {
  datos: PdfDatos;
  numeroFactura: string;
  conceptos: PdfConcepto[];
}) => {
  const documentType = normalizeInvoiceDocumentType(
    datos?.documentType ?? (datos?.esPresupuesto ? "presupuesto" : "factura"),
  );
  const documentMeta = getInvoiceDocumentMeta(documentType);
  const deliveryDetails = normalizeDeliveryDetails(datos?.deliveryDetails);
  const clientLocation = joinParts([
    datos?.cliente?.direccion,
    datos?.cliente?.cp || datos?.cliente?.codigoPostal,
    datos?.cliente?.ciudad,
  ]);
  const deliveryLocation =
    deliveryDetails.location.trim() || clientLocation || datos?.cliente?.direccion || "";
  const deliveredBy =
    deliveryDetails.deliveredBy.trim() || datos?.empresa?.nombre || "";
  const receivedBy =
    deliveryDetails.receivedBy.trim() || datos?.cliente?.nombre || "";
  const receivedById =
    deliveryDetails.receivedById.trim() ||
    datos?.cliente?.nif ||
    datos?.cliente?.dni ||
    "";
  const deliveryNotes = deliveryDetails.deliveryNotes.trim() || datos?.notas?.trim() || "";
  const albaranConcepts =
    conceptos.length > 0
      ? conceptos
      : [{ desc: "Sin detalle de entrega", cant: 0, precio: 0 }];
  const totalUnits = conceptos.reduce(
    (sum, item) => sum + Number(item.cant || 0),
    0,
  );
  const taxLabel = datos.taxLabel?.trim() || "IVA";

  if (documentType === "albaran") {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={[styles.header, { marginBottom: 20 }]}>
            <View style={styles.leftColumn}>
              {datos.logo && <PdfImage style={styles.logo} src={datos.logo} />}
              <Text style={styles.companyName}>{datos.empresa.nombre}</Text>
              <Text style={styles.companyDetail}>{datos.empresa.direccion}</Text>
              <Text style={styles.companyDetail}>{datos.empresa.ciudad}</Text>
              <Text style={styles.companyDetail}>CP: {datos.empresa.cp}</Text>
              <Text style={styles.companyDetail}>NIF: {datos.empresa.nif}</Text>
              <Text style={styles.companyDetail}>Tel: {datos.empresa.telefono}</Text>
              <Text style={styles.companyDetail}>Email: {datos.empresa.email}</Text>
            </View>

            <View style={styles.rightColumn}>
              <View
                style={{
                  alignItems: "flex-end",
                  padding: 14,
                  borderRadius: 10,
                  backgroundColor: "#f0fdfa",
                  borderWidth: 1,
                  borderColor: "#99f6e4",
                }}
              >
                <Text style={[styles.title, { marginBottom: 16, color: "#0f766e" }]}>
                  {documentMeta.uppercaseLabel}
                </Text>
                <Text style={styles.invoiceNumber}>
                  {documentMeta.prefix}-{numeroFactura}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 11, color: "#0f172a" }}>
                  {documentMeta.primaryDateLabel}: {formatDocumentDate(datos.fecha)}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 10.5,
                    textAlign: "right",
                    color: "#475569",
                  }}
                >
                  Documento de entrega y conformidad.
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: "48%",
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#d1d5db",
                backgroundColor: "#ffffff",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#0f172a" }}>
                Cliente
              </Text>
              <Text style={{ marginTop: 8, fontSize: 11, fontWeight: "bold" }}>
                {datos.cliente.nombre || ""}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10.5, color: "#475569" }}>
                {datos.cliente.nif || datos.cliente.dni || ""}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10.5, color: "#475569" }}>
                {clientLocation || "Sin direccion de entrega"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10.5, color: "#475569" }}>
                {joinParts([datos.cliente.telefono, datos.cliente.email]) || "Sin contacto"}
              </Text>
            </View>

            <View
              style={{
                width: "48%",
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#99f6e4",
                backgroundColor: "#f0fdfa",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#0f766e" }}>
                Ficha de entrega
              </Text>
              <Text style={{ marginTop: 8, fontSize: 10.5, color: "#475569" }}>
                Lugar: {deliveryLocation || "Pendiente de indicar"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10.5, color: "#475569" }}>
                Entregado por: {deliveredBy || "Pendiente"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10.5, color: "#475569" }}>
                Recibido por: {receivedBy || "Pendiente"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10.5, color: "#475569" }}>
                DNI/NIF: {receivedById || "Pendiente"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: "31%",
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#f8fafc",
                borderWidth: 1,
                borderColor: "#e2e8f0",
              }}
            >
              <Text style={{ fontSize: 9.5, color: "#64748b" }}>Partidas</Text>
              <Text style={{ marginTop: 6, fontSize: 16, fontWeight: "bold" }}>
                {albaranConcepts.length}
              </Text>
            </View>
            <View
              style={{
                width: "31%",
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#f8fafc",
                borderWidth: 1,
                borderColor: "#e2e8f0",
              }}
            >
              <Text style={{ fontSize: 9.5, color: "#64748b" }}>Unidades</Text>
              <Text style={{ marginTop: 6, fontSize: 16, fontWeight: "bold" }}>
                {totalUnits}
              </Text>
            </View>
            <View
              style={{
                width: "31%",
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#f8fafc",
                borderWidth: 1,
                borderColor: "#e2e8f0",
              }}
            >
              <Text style={{ fontSize: 9.5, color: "#64748b" }}>Recepcion</Text>
              <Text style={{ marginTop: 6, fontSize: 12, fontWeight: "bold" }}>
                {receivedBy ? "Identificada" : "Pendiente"}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableHeader, { backgroundColor: "#ccfbf1" }]}>
              <Text style={[styles.colConcept, { fontWeight: "bold" }]}>
                Material o servicio entregado
              </Text>
              <Text style={[styles.colQty, { width: "20%", fontWeight: "bold" }]}>
                Cant.
              </Text>
              <Text style={[styles.colTotal, { width: "30%", fontWeight: "bold" }]}>
                Referencia
              </Text>
            </View>

            {albaranConcepts.map((item, index) => (
              <View key={`${item.desc}-${index}`} style={styles.tableRow}>
                <Text style={[styles.colConcept, { width: "50%" }]}>
                  {item.desc || "Sin detalle"}
                </Text>
                <Text style={[styles.colQty, { width: "20%" }]}>
                  {Number(item.cant || 0)}
                </Text>
                <Text style={[styles.colTotal, { width: "30%" }]}>
                  Partida {String(index + 1).padStart(2, "0")}
                </Text>
              </View>
            ))}
          </View>

          {deliveryNotes ? (
            <View
              style={[
                styles.notesBox,
                { marginTop: 0, borderColor: "#99f6e4", backgroundColor: "#f0fdfa" },
              ]}
            >
              <Text style={[styles.notesLabel, { color: "#0f766e" }]}>
                Observaciones de entrega
              </Text>
              <Text style={styles.notesText}>{deliveryNotes}</Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 18,
            }}
          >
            <View
              style={{
                width: "48%",
                minHeight: 110,
                padding: 12,
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 10,
                backgroundColor: "#ffffff",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#0f172a" }}>
                Entregado por
              </Text>
              <Text style={{ marginTop: 10, fontSize: 10.5, color: "#475569" }}>
                {deliveredBy || datos.empresa.nombre || ""}
              </Text>
              <View
                style={{ marginTop: 48, borderTopWidth: 1, borderTopColor: "#94a3b8" }}
              >
                <Text style={{ marginTop: 6, fontSize: 9.5, color: "#64748b" }}>
                  Firma y sello
                </Text>
              </View>
            </View>

            <View
              style={{
                width: "48%",
                minHeight: 110,
                padding: 12,
                borderWidth: 1,
                borderColor: "#99f6e4",
                borderRadius: 10,
                backgroundColor: "#f0fdfa",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#0f766e" }}>
                Recibido y conforme
              </Text>
              <Text style={{ marginTop: 10, fontSize: 10.5, color: "#0f172a" }}>
                {receivedBy || ""}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 10, color: "#475569" }}>
                {receivedById || ""}
              </Text>
              <View
                style={{ marginTop: 34, borderTopWidth: 1, borderTopColor: "#0f766e" }}
              >
                <Text style={{ marginTop: 6, fontSize: 9.5, color: "#0f766e" }}>
                  Firma del receptor
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              marginTop: 14,
              fontSize: 9.5,
              color: "#64748b",
              textAlign: "center",
            }}
          >
            Este albaran acredita la entrega del material o servicio descrito y no
            sustituye a la factura.
          </Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* Empresa */}
          <View style={styles.leftColumn}>
            {datos.logo && <PdfImage style={styles.logo} src={datos.logo} />}
            <Text style={styles.companyName}>{datos.empresa.nombre}</Text>
            <Text style={styles.companyDetail}>{datos.empresa.direccion}</Text>
            <Text style={styles.companyDetail}>{datos.empresa.ciudad}</Text>
            <Text style={styles.companyDetail}>CP: {datos.empresa.cp}</Text>
            <Text style={styles.companyDetail}>NIF: {datos.empresa.nif}</Text>
            <Text style={styles.companyDetail}>
              Tel: {datos.empresa.telefono}
            </Text>
            <Text style={styles.companyDetail}>
              Email: {datos.empresa.email}
            </Text>
          </View>

          {/* Número de factura / ficha */}
          <View style={styles.rightColumn}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{documentMeta.uppercaseLabel}</Text>
              <Text style={styles.invoiceNumber}>
                {documentMeta.prefix}-{numeroFactura}
              </Text>
              <Text style={{ fontSize: 11, color: "#4b5563" }}>
                Fecha: {formatDocumentDate(datos.fecha)}
              </Text>
              {documentMeta.supportsSecondaryDate && datos?.fechaVencimiento ? (
                <Text style={{ marginTop: 4, fontSize: 11, color: "#4b5563" }}>
                  {documentMeta.secondaryDateLabel}:{" "}
                  {formatDocumentDate(datos.fechaVencimiento)}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* CUADRO CLIENTE */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#f3f4f6", // gris muy suave
            borderRadius: 6, // bordes redondeados
            paddingVertical: 10,
            marginTop: -20,
            marginBottom: 15,
            width: "100%",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 10,
          }}
        >
          {/* Parte izquierda */}
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 2 }}>
              Cliente:
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.nombre}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.nif}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.telefono}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.email}
            </Text>
          </View>

          {/* Parte derecha */}
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 2 }}>
              Dirección:
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.direccion}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.cp}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              {datos.cliente.ciudad}
            </Text>
          </View>
        </View>

        {/* TABLA DE CONCEPTOS */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colConcept}>Concepto</Text>
            <Text style={styles.colQty}>Cant</Text>
            <Text style={styles.colPrice}>Precio</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {conceptos.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colConcept}>{item.desc}</Text>
              <Text style={styles.colQty}>{item.cant}</Text>
              <Text style={styles.colPrice}>
                {(item.precio ?? 0).toFixed(2)} €
              </Text>
              <Text style={styles.colTotal}>
                {((item.cant ?? 1) * (item.precio ?? 0)).toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        {/* CUADRO DE TOTALES */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            width: 200,
            alignSelf: "flex-end",
            marginTop: 10,
          }}
        >
          {/* Base Imponible */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 6,
              borderBottomWidth: 1,
              borderBottomColor: "#e5e7eb",
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>
              Base imponible:
            </Text>
            <Text style={{ fontSize: 11 }}>
              {conceptos
                .reduce(
                  (acc, item) => acc + (item.precio ?? 0) * (item.cant ?? 1),
                  0,
                )
                .toFixed(2)}{" "}
              €
            </Text>
          </View>

          {/* IVA */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 6,
              borderBottomWidth: 1,
              borderBottomColor: "#e5e7eb",
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>
              {taxLabel} ({datos.tipiIVA || 21}%):
            </Text>
            <Text style={{ fontSize: 11 }}>
              {(
                (conceptos.reduce(
                  (acc, item) => acc + (item.precio ?? 0) * (item.cant ?? 1),
                  0,
                ) *
                  (datos.tipiIVA || 21)) /
                100
              ).toFixed(2)}{" "}
              €
            </Text>
          </View>

          {/* Total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 6,
              backgroundColor: "#FFF9C4", // amarillo suave
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {documentType === "presupuesto" || documentType === "proforma"
                ? "Total estimado:"
                : "Total:"}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {(
                conceptos.reduce(
                  (acc, item) => acc + (item.precio ?? 0) * (item.cant ?? 1),
                  0,
                ) *
                (1 + (datos.tipiIVA || 21) / 100)
              ).toFixed(2)}{" "}
              €
            </Text>
          </View>
        </View>

        {/* NOTAS */}
        {datos.notas && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notas</Text>
            <Text style={styles.notesText}>{datos.notas}</Text>
          </View>
        )}
        {datos.taxNote?.trim() ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Nota fiscal</Text>
            <Text style={styles.notesText}>{datos.taxNote}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
