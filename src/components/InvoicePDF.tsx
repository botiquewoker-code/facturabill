import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

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

const FacturaPDF = ({ datos }: { datos: any }) => {
  console.log("Datos recibidos en PDF:", datos);
  const isPresupuesto = datos.esPresupuesto;
  const baseImponible =
    datos.items?.reduce(
      (acc: number, item: any) => acc + item.precio * item.cant,
      0,
    ) || 0;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* Empresa */}
          <View style={styles.leftColumn}>
            {datos.logo && <Image style={styles.logo} src={datos.logo} />}
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
              <Text style={styles.title}>
                {isPresupuesto ? "PRESUPUESTO" : "FACTURA"}
              </Text>
              <Text style={styles.invoiceNumber}>
                {datos.numero} ·{" "}
                {new Date(datos.fecha).toLocaleDateString("es-ES")}
              </Text>
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
              DNI: {datos.cliente.nif}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              TEL: {datos.cliente.telefono}
            </Text>
            <Text style={{ fontSize: 11, marginBottom: 1 }}>
              EMAIL: {datos.cliente.email}
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
          {datos.items?.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colConcept}>{item.desc}</Text>
              <Text style={styles.colQty}>{item.cant}</Text>
              <Text style={styles.colPrice}>{item.precio?.toFixed(2)}€</Text>
              <Text style={styles.colTotal}>
                {(item.cant * item.precio)?.toFixed(2)}€
              </Text>
            </View>
          ))}
        </View>

        {/* CUADRO DE TOTALES */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            width: 200, // ancho fijo, no tan largo como la tabla
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
              Base Imponible:
            </Text>
            <Text style={{ fontSize: 11 }}>
              {datos.items
                ?.reduce(
                  (acc: number, item: any) => acc + item.precio * item.cant,
                  0,
                )
                .toFixed(2)}
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
              IVA ({datos.tipoIVA || 21}%):
            </Text>
            <Text style={{ fontSize: 11 }}>
              {(
                (datos.items?.reduce(
                  (acc: number, item: any) => acc + item.precio * item.cant,
                  0,
                ) || 0) *
                ((datos.tipoIVA || 21) / 100)
              ).toFixed(2)}
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
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Total:</Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {(
                (datos.items?.reduce(
                  (acc: number, item: any) => acc + item.precio * item.cant,
                  0,
                ) || 0) *
                (1 + (datos.tipoIVA || 21) / 100)
              ).toFixed(2)}
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
      </Page>
    </Document>
  );
};

export default FacturaPDF;
