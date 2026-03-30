import React from "react";
import {
  Document,
  Image as PdfImage,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

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
  esPresupuesto?: boolean;
  fecha?: string;
  fechaVencimiento?: string;
  logo?: string;
  cliente?: PdfParty;
  empresa?: PdfParty;
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
  const isPresupuesto = Boolean(datos?.esPresupuesto);
  const taxRate = Number(datos?.tipoIVA || datos?.tipiIVA || 21);
  const taxLabel = datos?.taxLabel?.trim() || "IVA";
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
              <Text style={styles.documentTitle}>
                {isPresupuesto ? "Presupuesto" : "Factura"}
              </Text>
              <Text style={styles.documentNumber}>
                {isPresupuesto ? "PRES-" : "FACT-"}
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
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>
                    {isPresupuesto ? "Validez" : "Vencimiento"}
                  </Text>
                  <Text style={styles.metaValue}>
                    {formatDocumentDate(
                      isPresupuesto
                        ? datos?.fechaVencimiento || datos?.fecha
                        : datos?.fechaVencimiento,
                    )}
                  </Text>
                </View>
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
                  {isPresupuesto ? "Total estimado" : "Total final"}
                </Text>
                <Text style={styles.highlightValue}>{formatCurrency(total)}</Text>
                <Text style={styles.highlightCaption}>
                  {isPresupuesto
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
