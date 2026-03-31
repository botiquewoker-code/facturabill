import React from "react";
import {
  Document,
  Image as PdfImage,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const PURPLE = "#5b2d8b";
const LIGHT_PURPLE = "#f2eef6";
const PAGE_BG = "#f7f5fa";
const BORDER = "#d8cfe4";
const TEXT = "#1f2937";
const MUTED = "#6b7280";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: PAGE_BG,
    color: TEXT,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  companyColumn: {
    width: "48%",
  },
  documentColumn: {
    width: "38%",
    alignItems: "flex-end",
  },
  logoWrap: {
    width: 92,
    height: 92,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logo: {
    width: 92,
    height: 92,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: TEXT,
  },
  companyLine: {
    fontSize: 10.5,
    lineHeight: 1.45,
    color: MUTED,
    marginBottom: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: PURPLE,
  },
  documentCode: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: TEXT,
  },
  metaLine: {
    marginTop: 4,
    fontSize: 10.5,
    color: MUTED,
  },
  clientCard: {
    marginBottom: 24,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#ffffff",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: PURPLE,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  clientName: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: TEXT,
    marginBottom: 4,
  },
  clientLine: {
    fontSize: 10,
    lineHeight: 1.4,
    color: TEXT,
    marginBottom: 2,
  },
  table: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: LIGHT_PURPLE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: PURPLE,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ede7f5",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  colConcept: {
    width: "50%",
    paddingRight: 8,
  },
  colQty: {
    width: "15%",
    textAlign: "right",
  },
  colPrice: {
    width: "15%",
    textAlign: "right",
  },
  colTotal: {
    width: "20%",
    textAlign: "right",
  },
  rowText: {
    fontSize: 10,
    color: TEXT,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  notesCard: {
    width: "52%",
    minHeight: 118,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#ffffff",
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: TEXT,
  },
  totalsCard: {
    width: 220,
    padding: 14,
    borderRadius: 10,
    backgroundColor: LIGHT_PURPLE,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalsText: {
    fontSize: 10.5,
    color: TEXT,
  },
  totalsDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 6,
  },
  totalHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: PURPLE,
  },
  totalHighlightText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  footer: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerText: {
    textAlign: "center",
    fontSize: 8.5,
    color: MUTED,
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
  const taxRate = Number(datos?.ivaPct ?? datos?.iva ?? datos?.tipoIVA ?? datos?.tipiIVA ?? 21);
  const taxLabel = datos?.taxLabel?.trim() || "IVA";
  const subtotal = conceptos.reduce(
    (sum, item) => sum + (Number(item.precio) || 0) * (Number(item.cant) || 0),
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
          <View style={styles.companyColumn}>
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
            <Text style={styles.title}>
              {isPresupuesto ? "PRESUPUESTO" : "FACTURA"}
            </Text>
            <Text style={styles.documentCode}>
              {isPresupuesto ? "PRES-" : "FACT-"}
              {numeroFactura}
            </Text>
            <Text style={styles.metaLine}>
              Fecha: {formatDocumentDate(datos?.fecha)}
            </Text>
            {!isPresupuesto && datos?.fechaVencimiento ? (
              <Text style={styles.metaLine}>
                Vencimiento: {formatDocumentDate(datos.fechaVencimiento)}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.clientCard}>
          <Text style={styles.sectionLabel}>Datos del cliente</Text>
          <Text style={styles.clientName}>{datos?.cliente?.nombre || ""}</Text>
          <Text style={styles.clientLine}>
            {datos?.cliente?.nif || datos?.cliente?.dni || ""}
          </Text>
          <Text style={styles.clientLine}>{clientLocation}</Text>
          <Text style={styles.clientLine}>
            {joinParts([datos?.cliente?.telefono, datos?.cliente?.email])}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colConcept]}>Concepto</Text>
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
                    ? [styles.tableRow, styles.tableRowLast]
                    : styles.tableRow
                }
              >
                <Text style={[styles.rowText, styles.colConcept]}>
                  {item.desc?.trim() || "-"}
                </Text>
                <Text style={[styles.rowText, styles.colQty]}>{quantity}</Text>
                <Text style={[styles.rowText, styles.colPrice]}>
                  {formatCurrency(price)}
                </Text>
                <Text style={[styles.rowText, styles.colTotal]}>
                  {formatCurrency(rowTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.notesCard}>
            <Text style={styles.sectionLabel}>Notas</Text>
            <Text style={styles.notesText}>
              {datos?.notas?.trim() || "Sin observaciones adicionales."}
            </Text>
            {datos?.taxNote?.trim() ? (
              <Text style={[styles.notesText, { marginTop: 10 }]}>
                Nota fiscal: {datos.taxNote}
              </Text>
            ) : null}
          </View>

          <View style={styles.totalsCard}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsText}>Base imponible</Text>
              <Text style={styles.totalsText}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsText}>
                {taxLabel} ({taxRate}%)
              </Text>
              <Text style={styles.totalsText}>{formatCurrency(taxAmount)}</Text>
            </View>
            <View style={styles.totalsDivider} />
            <View style={styles.totalHighlight}>
              <Text style={styles.totalHighlightText}>TOTAL</Text>
              <Text style={styles.totalHighlightText}>
                {formatCurrency(total)}
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
              datos?.empresa?.telefono,
              datos?.empresa?.email,
            ])}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PlantillaNueva;
