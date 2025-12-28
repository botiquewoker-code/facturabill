import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  leftColumn: { width: "50%" },
  rightColumn: { width: "50%" },
  logo: { width: 100, height: 100, marginBottom: 20 },
  companyName: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  companyDetail: { fontSize: 11, marginBottom: 2 },
  clientLabel: { fontSize: 11, color: "#6b7280", marginBottom: 3, marginTop: 120 },
  clientDetail: { fontSize: 12, marginBottom: 2 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  infoLeft: { width: "50%" },
  infoRight: { width: "50%", textAlign: "right" },
  label: { fontSize: 11, color: "#6b7280", marginBottom: 4 },
  value: { fontSize: 12 },
  table: { marginBottom: 30 },
  tableHeader: { flexDirection: "row", backgroundColor: "#dbeafe", padding: 8, fontSize: 10, fontWeight: "bold" },
  tableRow: { flexDirection: "row", padding: 8, borderBottom: "1 solid #e0e7ff", fontSize: 10 },
  colConcept: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" as const },
  colPrice: { width: "15%", textAlign: "right" as const },
  colTotal: { width: "20%", textAlign: "right" as const },
  totals: { width: "50%", alignSelf: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", padding: 6 },
  grandTotal: { backgroundColor: "#1e40af", color: "white", padding: 10, textAlign: "center" as const, fontSize: 14, fontWeight: "bold" },
  notes: { marginTop: 30, fontSize: 10, color: "#6b7280" },
});

const InvoicePDF = ({ datos }: { datos: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: logo y datos empresa debajo, cliente derecha */}
        <View style={styles.header}>
          <View style={styles.leftColumn}>
            {datos.logo && <Image style={styles.logo} src={datos.logo} />}
            <Text style={styles.companyName}>{datos.empresa.nombre || "Tu empresa"}</Text>
            <Text style={styles.companyDetail}>{datos.empresa.direccion}</Text>
            <Text style={styles.companyDetail}>{datos.empresa.cp} {datos.empresa.ciudad}</Text>
            <Text style={styles.companyDetail}>NIF: {datos.empresa.nif}</Text>
            <Text style={styles.companyDetail}>Tel: {datos.empresa.telefono}</Text>
            <Text style={styles.companyDetail}>Email: {datos.empresa.email}</Text>
          </View>

          <View style={styles.rightColumn}>
            <Text style={styles.clientLabel}>Cliente</Text>
            <Text style={styles.clientDetail}>{datos.cliente.nombre || ""}</Text>
            <Text style={styles.clientDetail}>{datos.cliente.direccion}</Text>
            <Text style={styles.clientDetail}>{datos.cliente.cp} {datos.cliente.ciudad}</Text>
            <Text style={styles.clientDetail}>NIF: {datos.cliente.nif}</Text>
            <Text style={styles.clientDetail}>Tel: {datos.cliente.telefono}</Text>
            <Text style={styles.clientDetail}>Email: {datos.cliente.email}</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>{datos.esPresupuesto ? "PRESUPUESTO" : "FACTURA"}</Text>

        {/* Número y fecha */}
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Text style={styles.label}>Número</Text>
            <Text style={styles.value}>{datos.numero}</Text>
          </View>
          <View style={styles.infoRight}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>{new Date(datos.fecha).toLocaleDateString("es-ES")}</Text>
          </View>
        </View>

        {/* Tabla items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colConcept}>Concepto</Text>
            <Text style={styles.colQty}>Cant.</Text>
            <Text style={styles.colPrice}>Precio</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {datos.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colConcept}>{item.desc}</Text>
              <Text style={styles.colQty}>{item.cant}</Text>
              <Text style={styles.colPrice}>{item.precio.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{(item.cant * item.precio).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Base imponible</Text>
            <Text>{datos.subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>IVA (21%)</Text>
            <Text>{datos.iva.toFixed(2)} €</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text>Total: {datos.total.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Notas */}
        {datos.notas && (
          <View style={styles.notes}>
            <Text>{datos.notas}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
