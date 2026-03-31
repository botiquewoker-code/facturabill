import React from "react";
import {
  Document,
  Image as PdfImage,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  getInvoiceDocumentMeta,
  normalizeInvoiceDocumentType,
  type InvoiceDocumentType,
} from "@/features/invoices/document-types";
import { normalizeDeliveryDetails } from "@/features/invoices/delivery-details";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: 9.4,
    fontFamily: "Helvetica",
  },
  topBand: {
    height: 74,
    backgroundColor: "#14233b",
  },
  shell: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#7c8ca2",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: -34,
    marginBottom: 18,
  },
  brandCard: {
    width: "41%",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe2ea",
  },
  logoWrap: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  companyLine: {
    fontSize: 9,
    lineHeight: 1.35,
    color: "#475569",
    marginBottom: 2,
  },
  documentCard: {
    width: "55%",
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#eef2f7",
    borderWidth: 1,
    borderColor: "#dbe2ea",
  },
  documentTitle: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
  },
  documentNumber: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "bold",
    color: "#8a5a33",
  },
  metaWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  metaCard: {
    width: "31%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  metaLabel: {
    fontSize: 7.2,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#94a3b8",
  },
  metaValue: {
    marginTop: 5,
    fontSize: 8.8,
    fontWeight: "bold",
    color: "#0f172a",
  },
  stripCard: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  stripGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stripColumn: {
    width: "100%",
  },
  stripLabel: {
    marginTop: 5,
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#0f172a",
  },
  stripText: {
    marginTop: 4,
    fontSize: 8.8,
    lineHeight: 1.35,
    color: "#475569",
  },
  table: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#14233b",
  },
  tableHeaderText: {
    fontSize: 7.6,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    color: "#f8fafc",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    backgroundColor: "#f8fafc",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  colConcept: {
    width: "50%",
    paddingRight: 8,
  },
  colQty: {
    width: "12%",
    textAlign: "center",
  },
  colPrice: {
    width: "18%",
    textAlign: "right",
  },
  colTotal: {
    width: "20%",
    textAlign: "right",
  },
  conceptTitle: {
    fontSize: 9.2,
    fontWeight: "bold",
    color: "#0f172a",
  },
  conceptCaption: {
    marginTop: 3,
    fontSize: 7.8,
    color: "#94a3b8",
  },
  bodyValue: {
    fontSize: 8.8,
    color: "#334155",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  messageCard: {
    width: "46%",
    minHeight: 128,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#14233b",
  },
  messageTitle: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  messageText: {
    marginTop: 8,
    fontSize: 8.8,
    lineHeight: 1.45,
    color: "#d6dfeb",
  },
  totalsCard: {
    width: "49%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f4ede5",
    borderWidth: 1,
    borderColor: "#eadbca",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalsLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: "#8a5a33",
  },
  totalsText: {
    fontSize: 8.8,
    color: "#334155",
  },
  highlightTotal: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  highlightLabel: {
    fontSize: 7.6,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#94a3b8",
  },
  highlightValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  highlightCaption: {
    marginTop: 4,
    fontSize: 8,
    color: "#64748b",
  },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 7.8,
    textAlign: "center",
    color: "#94a3b8",
  },
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
  cliente?: PdfParty;
  empresa?: PdfParty;
  deliveryDetails?: unknown;
  notas?: string;
  ivaPct?: number;
  iva?: number;
  tipoIVA?: number;
  tipiIVA?: number;
  taxLabel?: string;
  taxNote?: string;
};

type PdfConcepto = {
  desc: string;
  cant: number;
  precio: number;
};

function formatDocumentDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("es-ES");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

function joinParts(parts: Array<string | undefined>) {
  return parts.map((part) => (part || "").trim()).filter(Boolean).join(" · ");
}

const PlantillaStudio = ({
  datos,
  numeroFactura,
  conceptos = [],
}: {
  datos: PdfDatos;
  numeroFactura: string;
  conceptos?: PdfConcepto[];
}) => {
  const documentType = normalizeInvoiceDocumentType(
    datos?.documentType ?? (datos?.esPresupuesto ? "presupuesto" : "factura"),
  );
  const documentMeta = getInvoiceDocumentMeta(documentType);
  const taxRate = Number(datos?.tipoIVA || datos?.tipiIVA || 21);
  const taxLabel = datos?.taxLabel?.trim() || "IVA";
  const deliveryDetails = normalizeDeliveryDetails(datos?.deliveryDetails);
  const subtotal = conceptos.reduce(
    (sum, item) => sum + Number(item.cant || 0) * Number(item.precio || 0),
    0,
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const companyLocation = joinParts([
    datos?.empresa?.direccion,
    datos?.empresa?.cp,
    datos?.empresa?.ciudad,
  ]);
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

  if (documentType === "albaran") {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={[styles.topBand, { backgroundColor: "#0f766e" }]} />

          <View style={styles.shell}>
            <View style={styles.headerRow}>
              <View style={styles.brandCard}>
                {datos?.logo ? (
                  <View style={styles.logoWrap}>
                    <PdfImage style={styles.logo} src={datos.logo} />
                  </View>
                ) : null}
                <Text style={styles.companyName}>{datos?.empresa?.nombre || ""}</Text>
                <Text style={styles.companyLine}>{companyLocation}</Text>
                <Text style={styles.companyLine}>
                  {joinParts([
                    datos?.empresa?.nif ? `NIF ${datos.empresa.nif}` : "",
                    datos?.empresa?.telefono,
                  ])}
                </Text>
                <Text style={styles.companyLine}>{datos?.empresa?.email || ""}</Text>
              </View>

              <View
                style={[
                  styles.documentCard,
                  {
                    backgroundColor: "#f0fdfa",
                    borderColor: "#99f6e4",
                  },
                ]}
              >
                <Text style={[styles.eyebrow, { color: "#0f766e" }]}>
                  Delivery note
                </Text>
                <Text style={styles.documentTitle}>{documentMeta.label}</Text>
                <Text style={[styles.documentNumber, { color: "#0f766e" }]}>
                  {documentMeta.prefix}-
                  {numeroFactura}
                </Text>

                <View style={styles.metaWrap}>
                  <View style={styles.metaCard}>
                    <Text style={styles.metaLabel}>Fecha</Text>
                    <Text style={styles.metaValue}>
                      {formatDocumentDate(datos?.fecha)}
                    </Text>
                  </View>
                  <View style={styles.metaCard}>
                    <Text style={styles.metaLabel}>Partidas</Text>
                    <Text style={styles.metaValue}>{albaranConcepts.length}</Text>
                  </View>
                  <View style={styles.metaCard}>
                    <Text style={styles.metaLabel}>Unidades</Text>
                    <Text style={styles.metaValue}>{totalUnits}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.stripCard}>
              <View style={styles.stripGrid}>
                <View style={{ width: "48%" }}>
                  <Text style={[styles.eyebrow, { color: "#0f766e" }]}>Cliente</Text>
                  <Text style={styles.stripLabel}>{datos?.cliente?.nombre || ""}</Text>
                  <Text style={styles.stripText}>
                    {joinParts([
                      datos?.cliente?.nif || datos?.cliente?.dni,
                      clientLocation,
                    ])}
                  </Text>
                  <Text style={styles.stripText}>
                    {joinParts([datos?.cliente?.telefono, datos?.cliente?.email])}
                  </Text>
                </View>

                <View style={{ width: "48%" }}>
                  <Text style={[styles.eyebrow, { color: "#0f766e" }]}>
                    Ficha de entrega
                  </Text>
                  <Text style={styles.stripLabel}>
                    {deliveryLocation || "Pendiente de indicar"}
                  </Text>
                  <Text style={styles.stripText}>
                    Entregado por: {deliveredBy || "Pendiente"}
                  </Text>
                  <Text style={styles.stripText}>
                    Recibido por: {receivedBy || "Pendiente"}
                  </Text>
                  <Text style={styles.stripText}>
                    DNI/NIF: {receivedById || "Pendiente"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={[styles.tableHeader, { backgroundColor: "#0f766e" }]}>
                <Text style={[styles.tableHeaderText, styles.colConcept]}>
                  Material o servicio
                </Text>
                <Text style={[styles.tableHeaderText, styles.colQty, { width: "18%" }]}>
                  Cant.
                </Text>
                <Text style={[styles.tableHeaderText, styles.colTotal, { width: "32%" }]}>
                  Referencia
                </Text>
              </View>

              {albaranConcepts.map((item, index) => (
                <View
                  key={`${item.desc}-${index}`}
                  style={
                    index === albaranConcepts.length - 1
                      ? index % 2 === 1
                        ? [styles.tableRow, styles.tableRowAlt, styles.tableRowLast]
                        : [styles.tableRow, styles.tableRowLast]
                      : index % 2 === 1
                        ? [styles.tableRow, styles.tableRowAlt]
                        : styles.tableRow
                  }
                >
                  <View style={styles.colConcept}>
                    <Text style={styles.conceptTitle}>{item.desc || "Sin detalle"}</Text>
                    <Text style={styles.conceptCaption}>
                      Partida {String(index + 1).padStart(2, "0")}
                    </Text>
                  </View>
                  <Text style={[styles.bodyValue, styles.colQty, { width: "18%" }]}>
                    {Number(item.cant || 0)}
                  </Text>
                  <Text style={[styles.bodyValue, styles.colTotal, { width: "32%" }]}>
                    Entrega registrada
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.bottomRow}>
              <View
                style={[
                  styles.messageCard,
                  { backgroundColor: "#0f172a", minHeight: 144 },
                ]}
              >
                <Text style={[styles.eyebrow, { color: "#99f6e4" }]}>Entrega</Text>
                <Text style={styles.messageTitle}>Observaciones y conformidad</Text>
                <Text style={styles.messageText}>
                  {deliveryNotes ||
                    "Sin observaciones adicionales. Este documento deja constancia de la entrega efectuada."}
                </Text>
                <Text style={styles.messageText}>
                  El albaran acredita la entrega y no sustituye a la factura.
                </Text>
              </View>

              <View
                style={[
                  styles.totalsCard,
                  { backgroundColor: "#f0fdfa", borderColor: "#99f6e4" },
                ]}
              >
                <Text style={[styles.totalsLabel, { color: "#0f766e" }]}>
                  Recepcion del material
                </Text>

                <View style={styles.totalsRow}>
                  <Text style={styles.totalsText}>Receptor</Text>
                  <Text style={styles.totalsText}>
                    {receivedBy || "Pendiente"}
                  </Text>
                </View>

                <View style={styles.totalsRow}>
                  <Text style={styles.totalsText}>Documento</Text>
                  <Text style={styles.totalsText}>
                    {receivedById || "Pendiente"}
                  </Text>
                </View>

                <View style={styles.highlightTotal}>
                  <Text style={styles.highlightLabel}>Estado</Text>
                  <Text style={[styles.highlightValue, { fontSize: 15 }]}>
                    {receivedBy ? "Listo para firma" : "Pendiente de firma"}
                  </Text>
                  <Text style={styles.highlightCaption}>
                    Fecha de entrega: {formatDocumentDate(datos?.fecha)}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                marginTop: 18,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "48%",
                  minHeight: 116,
                  padding: 14,
                  borderRadius: 16,
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <Text style={[styles.eyebrow, { color: "#0f766e" }]}>
                  Entregado por
                </Text>
                <Text style={[styles.stripLabel, { marginTop: 10 }]}>
                  {deliveredBy || datos?.empresa?.nombre || ""}
                </Text>
                <View style={{ marginTop: 58, borderTopWidth: 1, borderTopColor: "#94a3b8" }} />
                <Text style={styles.stripText}>Firma y sello</Text>
              </View>

              <View
                style={{
                  width: "48%",
                  minHeight: 116,
                  padding: 14,
                  borderRadius: 16,
                  backgroundColor: "#f0fdfa",
                  borderWidth: 1,
                  borderColor: "#99f6e4",
                }}
              >
                <Text style={[styles.eyebrow, { color: "#0f766e" }]}>
                  Recibido y conforme
                </Text>
                <Text style={[styles.stripLabel, { marginTop: 10 }]}>
                  {receivedBy || ""}
                </Text>
                <Text style={styles.stripText}>{receivedById || ""}</Text>
                <View style={{ marginTop: 42, borderTopWidth: 1, borderTopColor: "#0f766e" }} />
                <Text style={[styles.stripText, { color: "#0f766e" }]}>
                  Firma del receptor
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
              {joinParts([
                datos?.empresa?.nombre,
                datos?.empresa?.nif ? `NIF ${datos.empresa.nif}` : "",
                companyLocation,
                datos?.empresa?.email,
              ])}
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBand} />

        <View style={styles.shell}>
          <View style={styles.headerRow}>
            <View style={styles.brandCard}>
              {datos?.logo ? (
                <View style={styles.logoWrap}>
                  <PdfImage style={styles.logo} src={datos.logo} />
                </View>
              ) : null}
              <Text style={styles.companyName}>{datos?.empresa?.nombre || ""}</Text>
              <Text style={styles.companyLine}>{companyLocation}</Text>
              <Text style={styles.companyLine}>
                {joinParts([
                  datos?.empresa?.nif ? `NIF ${datos.empresa.nif}` : "",
                  datos?.empresa?.telefono,
                ])}
              </Text>
              <Text style={styles.companyLine}>{datos?.empresa?.email || ""}</Text>
            </View>

            <View style={styles.documentCard}>
              <Text style={styles.eyebrow}>Studio collection</Text>
              <Text style={styles.documentTitle}>{documentMeta.label}</Text>
              <Text style={styles.documentNumber}>
                {documentMeta.prefix}-
                {numeroFactura}
              </Text>

              <View style={styles.metaWrap}>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>Fecha</Text>
                  <Text style={styles.metaValue}>
                    {formatDocumentDate(datos?.fecha)}
                  </Text>
                </View>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>Impuesto</Text>
                  <Text style={styles.metaValue}>
                    {taxLabel} {taxRate}%
                  </Text>
                </View>
                {documentMeta.supportsSecondaryDate ? (
                  <View style={styles.metaCard}>
                    <Text style={styles.metaLabel}>
                      {documentMeta.secondaryDateLabel}
                    </Text>
                    <Text style={styles.metaValue}>
                      {formatDocumentDate(datos?.fechaVencimiento || datos?.fecha)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.stripCard}>
            <View style={styles.stripColumn}>
              <Text style={styles.eyebrow}>Cliente</Text>
              <Text style={styles.stripLabel}>{datos?.cliente?.nombre || ""}</Text>
              <Text style={styles.stripText}>
                {joinParts([
                  datos?.cliente?.nif || datos?.cliente?.dni,
                  clientLocation,
                ])}
              </Text>
              <Text style={styles.stripText}>
                {joinParts([datos?.cliente?.telefono, datos?.cliente?.email])}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colConcept]}>
                Servicio
              </Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>Precio</Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
            </View>

            {conceptos.map((item, index) => {
              const quantity = Number(item.cant || 0);
              const price = Number(item.precio || 0);
              const rowTotal = quantity * price;

              return (
                <View
                  key={`${item.desc}-${index}`}
                  style={
                    index === conceptos.length - 1
                      ? index % 2 === 1
                        ? [styles.tableRow, styles.tableRowAlt, styles.tableRowLast]
                        : [styles.tableRow, styles.tableRowLast]
                      : index % 2 === 1
                        ? [styles.tableRow, styles.tableRowAlt]
                        : styles.tableRow
                  }
                >
                  <View style={styles.colConcept}>
                    <Text style={styles.conceptTitle}>{item.desc || "Concepto"}</Text>
                    <Text style={styles.conceptCaption}>
                      Partida {String(index + 1).padStart(2, "0")}
                    </Text>
                  </View>
                  <Text style={[styles.bodyValue, styles.colQty]}>{quantity}</Text>
                  <Text style={[styles.bodyValue, styles.colPrice]}>
                    {formatCurrency(price)}
                  </Text>
                  <Text style={[styles.bodyValue, styles.colTotal]}>
                    {formatCurrency(rowTotal)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.messageCard}>
              <Text style={styles.eyebrow}>Contexto</Text>
              <Text style={styles.messageTitle}>Observaciones del documento</Text>
              <Text style={styles.messageText}>
                {datos?.notas?.trim() ||
                  "Documento preparado con un formato premium y una estructura pensada para presentar el servicio con claridad, orden y buen nivel visual."}
              </Text>
              {datos?.taxNote?.trim() ? (
                <Text style={styles.messageText}>
                  Nota fiscal: {datos.taxNote}
                </Text>
              ) : null}
            </View>

            <View style={styles.totalsCard}>
              <Text style={styles.totalsLabel}>Resumen de importes</Text>

              <View style={styles.totalsRow}>
                <Text style={styles.totalsText}>Base</Text>
                <Text style={styles.totalsText}>{formatCurrency(subtotal)}</Text>
              </View>

              <View style={styles.totalsRow}>
                <Text style={styles.totalsText}>{taxLabel} ({taxRate}%)</Text>
                <Text style={styles.totalsText}>{formatCurrency(taxAmount)}</Text>
              </View>

              <View style={styles.highlightTotal}>
                <Text style={styles.highlightLabel}>
                  {documentType === "presupuesto" || documentType === "proforma"
                    ? "Total estimado"
                    : "Total final"}
                </Text>
                <Text style={styles.highlightValue}>{formatCurrency(total)}</Text>
                <Text style={styles.highlightCaption}>
                  {documentType === "presupuesto" || documentType === "proforma"
                    ? "Importe preparado para aprobacion"
                    : "Importe listo para cobro"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {joinParts([
              datos?.empresa?.nombre,
              datos?.empresa?.nif ? `NIF ${datos.empresa.nif}` : "",
              companyLocation,
              datos?.empresa?.email,
            ])}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PlantillaStudio;
