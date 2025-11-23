import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

export default function InvoicePDF({ datos }: { datos: any }) {
  const {
    esPresupuesto, numero, fecha, empresa, cliente,
    items, logo, plantilla, subtotal, iva, total, notas
  } = datos;

  const color = plantilla === 'elegante' ? '#92400e' :
                plantilla === 'minimal' ? '#111827' :
                plantilla === 'clasica' ? '#1e40af' : '#4f46e5';

  const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 11, color: '#1f2937' },
    header: { marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between' },
    logo: { width: 100, height: 100, objectFit: 'contain' },
    title: { fontSize: 32, fontWeight: 'bold', color, marginBottom: 8 },
    subtitle: { fontSize: 12, color: '#6b7280' },
    section: { marginBottom: 25 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 8, fontWeight: 'bold' },
    tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: '#e5e7eb' },
    colDesc: { width: '50%' },
    colCant: { width: '15%', textAlign: 'right' },
    colPrecio: { width: '15%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },
    totals: { marginTop: 30, alignSelf: 'flex-end', width: 200 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    totalLabel: { fontSize: 12 },
    totalValue: { fontSize: 12, fontWeight: 'bold' },
    grandTotal: { fontSize: 24, fontWeight: 'bold', color, marginTop: 10 },
    notes: { marginTop: 40, fontSize: 10, color: '#6b7280' }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>{logo && <Image style={styles.logo} src={logo} />}</View>
          <View>
            <Text style={styles.title}>{esPresupuesto ? 'PRESUPUESTO' : 'FACTURA'}</Text>
            <Text style={styles.subtitle}>Nº {numero} · {fecha}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <View style={styles.section}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>Emisor</Text>
            <Text>{empresa.nombre}</Text>
            <Text>NIF: {empresa.nif}</Text>
            <Text>{empresa.direccion}</Text>
            <Text>{empresa.cp} {empresa.ciudad}</Text>
            <Text>{empresa.telefono} · {empresa.email}</Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>Cliente</Text>
            <Text>{cliente.nombre || 'Cliente genérico'}</Text>
            <Text>NIF: {cliente.nif || '-'}</Text>
            <Text>{cliente.direccion || '-'}</Text>
            <Text>{cliente.cp} {cliente.ciudad || '-'}</Text>
            <Text>{cliente.telefono || '-'} · {cliente.email || '-'}</Text>
          </View>
        </View>

        <View style={{ marginTop: 30, marginBottom: 30 }}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Concepto</Text>
            <Text style={styles.colCant}>Cant.</Text>
            <Text style={styles.colPrecio}>Precio</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {items.map((item: any, i: number) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.colDesc}>{item.desc}</Text>
              <Text style={styles.colCant}>{item.cant}</Text>
              <Text style={styles.colPrecio}>{item.precio.toFixed(2)} €</Text>
              <Text style={styles.colTotal}>{(item.cant * item.precio).toFixed(2)} €</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Base imponible</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA 21%</Text>
            <Text style={styles.totalValue}>{iva.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>TOTAL</Text>
            <Text style={styles.grandTotal}>{total.toFixed(2)} €</Text>
          </View>
        </View>

        {notas && (
          <View style={styles.notes}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notas:</Text>
            <Text>{notas}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
