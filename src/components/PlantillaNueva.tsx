import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const PURPLE = "#5B2D8B";
const LIGHT = "#F2EEF6";
const GRAY = "#E5E1EC";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#F7F5FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 20,
  },

  leftColumn: {
    width: 150,
    alignItems: "flex-start",
  },

  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerDivider: {
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
    marginTop: 6,
    marginBottom: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 0,
  },

  invoiceNumber: {
    fontSize: 12,
    marginTop: 4,
  },
  date: {
    marginTop: 0,
    fontSize: 11,
  },
  logoBox: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    objectFit: "contain",
    marginLeft: "auto",
  },
  /* CLIENTE */
  clientBox: {
    marginTop: 20,
    marginBottom: 30, // separa del cuadro de conceptos
  },

  clientTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },

  clientRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  clientText: {
    fontSize: 10,
    color: "#000",
    marginRight: 6,
    marginBottom: 3,
  },
  /* TABLA */
  table: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontWeight: "bold",
    fontSize: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    fontSize: 10,
  },

  colConcept: {
    width: "50%",
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
  colProduct: { width: "40%" },

  /* RESUMEN */
  totalsCard: {
    width: 260,
    alignSelf: "flex-end",
    backgroundColor: "#f2eef7",
    borderRadius: 8,
    padding: 12,
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 11,
  },

  totalsDivider: {
    height: 1,
    backgroundColor: "#d1c4e9",
    marginVertical: 8,
  },

  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#5e2d91",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  totalFinalText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  notes: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: "1px solid #ccc",
    fontSize: 10,
  },

  notesTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  notesText: {
    fontSize: 10,
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 18,
    left: 40,
    right: 40,
  },

  footerLine: {
    textAlign: "center",
    fontSize: 9,
    color: "#444",
  },
});
type Item = {
  precio: number | string;
};
const PlantillaNueva = ({
  datos,
  numeroFactura,
  conceptos = [],
}: {
  datos: any;
  numeroFactura: string;
  conceptos?: { desc: string; cant: number; precio: number }[];
}) => {
  console.log("Datos recibidos en PDF:", datos);

  const isPresupuesto = Boolean(datos?.esPresupuesto);

  const ivaPct: number = Number(
    datos?.ivaPct ?? datos?.iva ?? datos?.tipoIVA ?? 21,
  );

  const baseImponible = conceptos.reduce(
    (acc: number, item) =>
      acc + (Number(item.precio) || 0) * (Number(item.cant) || 1),
    0,
  );

  const ivaImporte = baseImponible * (ivaPct / 100);
  const total = baseImponible + ivaImporte;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {datos.logo && <Image style={styles.logo} src={datos.logo} />}

          <View style={styles.rightColumn}>
            <Text style={styles.title}>
              {datos.esPresupuesto ? "PRESUPUESTO" : "FACTURA"}
            </Text>

            <Text style={styles.invoiceNumber}>
              {datos.esPresupuesto ? "PRES-" : "FACT-"}
              {numeroFactura} -{" "}
              {new Date(datos.fecha).toLocaleDateString("es-ES")}
            </Text>
          </View>
        </View>
        {/* CLIENTE */}
        <View style={styles.clientBox}>
          <Text style={styles.clientTitle}>DATOS DE CLIENTE :</Text>

          <View style={styles.clientRow}>
            <Text style={styles.clientText}>
              {datos?.cliente?.nombre ?? ""}
            </Text>
          </View>

          <View style={styles.clientRow}>
            <Text style={styles.clientText}>
              • {(datos?.cliente?.dni || datos?.cliente?.nif) ?? ""}
            </Text>
            <Text style={styles.clientText}>
              • {datos?.cliente?.direccion ?? ""}
            </Text>
          </View>

          <View style={styles.clientRow}>
            <Text style={styles.clientText}>
              {(datos?.cliente?.cp || datos?.cliente?.codigoPostal) ?? ""}
            </Text>
            <Text style={styles.clientText}>
              • {datos?.cliente?.ciudad ?? ""}
            </Text>
            <Text style={styles.clientText}>
              • {datos?.cliente?.telefono ?? ""}
            </Text>
            <Text style={styles.clientText}>
              • {datos?.cliente?.email ?? ""}
            </Text>
          </View>
        </View>
        {/* TABLA DE CONCEPTOS */}
        <View style={styles.table}>
          {/* Cabecera */}
          <View style={styles.tableHeader}>
            <Text style={styles.colConcept}>Concepto</Text>
            <Text style={styles.colQty}>Cant.</Text>
            <Text style={styles.colPrice}>Precio</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {/* Filas */}
          {conceptos.map((item, i) => {
            const cant = Number(item.cant ?? 1);
            const precio = Number(item.precio ?? 0);
            const totalLinea = cant * precio;

            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colConcept}>
                  {item.desc && String(item.desc).trim() !== ""
                    ? item.desc
                    : "-"}
                </Text>
                <Text style={styles.colQty}>{cant}</Text>
                <Text style={styles.colPrice}>{precio.toFixed(2)} €</Text>
                <Text style={styles.colTotal}>{totalLinea.toFixed(2)} €</Text>
              </View>
            );
          })}
        </View>
        ); ) ) : ( ){/* CUADRO DE TOTALES */}
        <View style={styles.totalsCard}>
          <View style={styles.totalsRow}>
            <Text>Base imponible</Text>
            <Text>
              {conceptos
                .reduce(
                  (acc, item) => acc + (item.precio ?? 0) * (item.cant ?? 1),
                  0,
                )
                .toFixed(2)}{" "}
              €
            </Text>
          </View>

          <View style={styles.totalsRow}>
            <Text>IVA ({datos.tipiIVA || 21}%)</Text>
            <Text>
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

          <View style={styles.totalsDivider} />

          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalText}>TOTAL</Text>
            <Text style={styles.totalFinalText}>
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
        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <View style={styles.footerDivider} />

          <Text style={styles.footerLine}>
            {datos?.empresa?.nombre ?? ""} • NIF {datos?.empresa?.nif ?? ""} •{" "}
            {datos?.empresa?.direccion ?? ""} • {datos?.empresa?.cp ?? ""}{" "}
            {datos?.empresa?.ciudad ?? ""} • Tel{" "}
            {datos?.empresa?.telefono ?? ""} • {datos?.empresa?.email ?? ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PlantillaNueva;
