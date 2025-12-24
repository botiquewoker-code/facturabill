import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
});

interface InvoicePDFProps {
  datos: any; // ajusta según tus datos
}

const InvoicePDF = ({ datos }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>FACTURA</Text>
      <View style={styles.section}>
        <Text style={styles.text}>Emisor: {datos.emisor?.nombre || 'Tu empresa'}</Text>
        <Text style={styles.text}>Cliente: {datos.cliente?.nombre || 'Cliente'}</Text>
        <Text style={styles.text}>Total: {datos.total || '0.00'} €</Text>
      </View>
      {/* Añade más secciones según tus datos */}
    </Page>
  </Document>
);

export default InvoicePDF;
