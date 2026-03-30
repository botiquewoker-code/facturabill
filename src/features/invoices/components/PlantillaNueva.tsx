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
    paddingHorizontal: 34,
    paddingTop: 32,
    paddingBottom: 28,
    backgroundColor: "#fffaf5",
    color: "#1f2937",
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "#9f6b42",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  brandColumn: {
    width: "46%",
  },
  logoWrap: {
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logo: {
    width: 84,
    height: 84,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },
  companyLine: {
    fontSize: 10,
    lineHeight: 1.45,
    color: "#475569",
    marginBottom: 2,
  },
  documentColumn: {
    width: "42%",
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#f4ede5",
    borderWidth: 1,
    borderColor: "#eadbca",
  },
  documentTitle: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  documentCode: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#9f6b42",
  },
  metaGrid: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#d8c4ad",
    paddingTop: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    color: "#8b735c",
  },
  metaValue: {
    width: "56%",
    fontSize: 10,
    textAlign: "right",
    color: "#111827",
  },
  clientCard: {
    marginBottom: 22,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ece6de",
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
  },
  clientGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clientColumn: {
    width: "47%",
  },
  clientLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 6,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },
  clientLine: {
    fontSize: 10,
    lineHeight: 1.45,
    color: "#475569",
    marginBottom: 2,
  },
  table: {
    marginBottom: 22,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ece6de",
    backgroundColor: "#ffffff",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#f6f0ea",
    borderBottomWidth: 1,
    borderBottomColor: "#ece6de",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#8b735c",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1ede7",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  colConcept: {
    width: "49%",
    paddingRight: 8,
  },
  colQty: {
    width: "13%",
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
  lineConcept: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#111827",
  },
  lineCaption: {
    marginTop: 4,
    fontSize: 9,
    color: "#94a3b8",
  },
  lineValue: {
    fontSize: 10,
    color: "#334155",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  notesCard: {
    width: "55%",
    minHeight: 138,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2eb",
    borderWidth: 1,
    borderColor: "#ebe1d5",
  },
  notesText: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 1.55,
    color: "#475569",
  },
  totalsCard: {
    width: "38%",
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#172033",
  },
  totalsLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: "#d8c4ad",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  totalsText: {
    fontSize: 10,
    color: "#f8fafc",
  },
  totalsDivider: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(216,196,173,0.35)",
  },
  totalAmount: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalCaption: {
    marginTop: 4,
    fontSize: 9,
    color: "#cbd5e1",
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ece6de",
  },
  footerText: {
    fontSize: 8.5,
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

const PlantillaNueva = ({
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
        <View style={styles.header}>
          <View style={styles.brandColumn}>
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

          <View style={styles.documentColumn}>
            <Text style={styles.eyebrow}>Editorial Layout</Text>
            <Text style={styles.documentTitle}>
              {isPresupuesto ? "Presupuesto" : "Factura"}
            </Text>
            <Text style={styles.documentCode}>
              {isPresupuesto ? "PRES-" : "FACT-"}
              {numeroFactura}
            </Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Fecha</Text>
                <Text style={styles.metaValue}>
                  {formatDocumentDate(datos?.fecha)}
                </Text>
              </View>
              {!isPresupuesto && datos?.fechaVencimiento ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Vencimiento</Text>
                  <Text style={styles.metaValue}>
                    {formatDocumentDate(datos.fechaVencimiento)}
                  </Text>
                </View>
              ) : null}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>IVA</Text>
                <Text style={styles.metaValue}>
                  {taxLabel} {taxRate}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.clientCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.eyebrow}>Datos clave</Text>
            <Text style={styles.sectionTitle}>Cliente y emision</Text>
          </View>

          <View style={styles.clientGrid}>
            <View style={styles.clientColumn}>
              <Text style={styles.clientLabel}>Cliente</Text>
              <Text style={styles.clientName}>{datos?.cliente?.nombre || ""}</Text>
              <Text style={styles.clientLine}>
                {datos?.cliente?.nif || datos?.cliente?.dni || ""}
              </Text>
              <Text style={styles.clientLine}>{clientLocation}</Text>
              <Text style={styles.clientLine}>
                {joinParts([datos?.cliente?.telefono, datos?.cliente?.email])}
              </Text>
            </View>

            <View style={styles.clientColumn}>
              <Text style={styles.clientLabel}>Emisor</Text>
              <Text style={styles.clientName}>{datos?.empresa?.nombre || ""}</Text>
              <Text style={styles.clientLine}>{companyLocation}</Text>
              <Text style={styles.clientLine}>
                {joinParts([
                  datos?.empresa?.telefono,
                  datos?.empresa?.email,
                ])}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colConcept]}>Concepto</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Precio</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Importe</Text>
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
                    ? [styles.tableRow, styles.tableRowLast]
                    : styles.tableRow
                }
              >
                <View style={styles.colConcept}>
                  <Text style={styles.lineConcept}>{item.desc || "Concepto"}</Text>
                  <Text style={styles.lineCaption}>
                    Linea {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>
                <Text style={[styles.lineValue, styles.colQty]}>{quantity}</Text>
                <Text style={[styles.lineValue, styles.colPrice]}>
                  {formatCurrency(price)}
                </Text>
                <Text style={[styles.lineValue, styles.colTotal]}>
                  {formatCurrency(rowTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.notesCard}>
            <Text style={styles.eyebrow}>Notas</Text>
            <Text style={styles.sectionTitle}>Mensaje final</Text>
            <Text style={styles.notesText}>
              {datos?.notas?.trim() ||
                "Gracias por la confianza. Este documento resume el alcance, los importes y las condiciones indicadas para esta operacion."}
            </Text>
            {datos?.taxNote?.trim() ? (
              <Text style={styles.notesText}>
                Nota fiscal: {datos.taxNote}
              </Text>
            ) : null}
          </View>

          <View style={styles.totalsCard}>
            <Text style={styles.totalsLabel}>Resumen economico</Text>

            <View style={styles.totalsRow}>
              <Text style={styles.totalsText}>Base imponible</Text>
              <Text style={styles.totalsText}>{formatCurrency(subtotal)}</Text>
            </View>

            <View style={styles.totalsRow}>
              <Text style={styles.totalsText}>{taxLabel} ({taxRate}%)</Text>
              <Text style={styles.totalsText}>{formatCurrency(taxAmount)}</Text>
            </View>

            <View style={styles.totalsDivider} />
            <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
            <Text style={styles.totalCaption}>
              Total {isPresupuesto ? "estimado" : "a pagar"}
            </Text>
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

export default PlantillaNueva;
