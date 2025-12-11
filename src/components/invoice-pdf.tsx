import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    header: { fontSize: 24, marginBottom: 20 },
    section: { margin: 10, padding: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    total: { marginTop: 20, borderTopWidth: 1, paddingTop: 10, fontWeight: 'bold' }
});

export const InvoicePDF = ({ order }: { order: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Invoice #{order.id.slice(0, 8)}</Text>
                <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>Items</Text>
                {order.items?.map((item: any) => (
                    <View key={item.id} style={styles.row}>
                        <Text>{item.product?.name || 'Product'} x {item.quantity}</Text>
                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.section}>
                <View style={[styles.row, styles.total]}>
                    <Text>Total</Text>
                    <Text>${order.total.toFixed(2)}</Text>
                </View>
            </View>
        </Page>
    </Document>
);
