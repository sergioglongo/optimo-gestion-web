import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// types
import { Liquidacion } from 'types/liquidacion';
import { Gasto } from 'types/gasto';
import { periodoFormat, toLocaleDateFormat } from 'utils/dateFormat';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  headerInfo: {
    fontSize: 10,
    color: '#555'
  },
  section: {
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  text: {
    fontSize: 10,
    color: '#555'
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableColDescription: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableCell: {
    fontSize: 9
  },
  rubroHeader: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontSize: 11,
    fontWeight: 'bold'
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#fafafa',
    padding: 5,
    borderTop: '1px solid #e0e0e0'
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold'
  }
});

interface Props {
  liquidacion: Liquidacion;
}

const LiquidacionPDF = ({ liquidacion }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{liquidacion.Consorcio?.nombre}</Text>
          <Text style={styles.headerInfo}>{liquidacion.Consorcio?.Domicilio?.direccion}</Text>
          <Text style={styles.headerInfo}>
            {`${liquidacion.Consorcio?.Domicilio?.localidad}, ${liquidacion.Consorcio?.Domicilio?.provincia}`}
          </Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={styles.subtitle}>Liquidación de Expensas</Text>
          <Text style={styles.headerInfo}>Período: {periodoFormat(liquidacion.periodo)}</Text>
          <Text style={styles.headerInfo}>Fecha Emisión: {toLocaleDateFormat(liquidacion.fecha_emision)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalle de Gastos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, flex: 1 }}>
              <Text style={styles.tableCellHeader}>Descripción</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: 70 }}>
              <Text style={styles.tableCellHeader}>Tipo</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: 120, textAlign: 'right' }}>
              <Text style={styles.tableCellHeader}>Monto</Text>
            </View>
          </View>
          {liquidacion.Gastos?.map((rubroGroup: any, index: number) => {
            const subtotalRubro = rubroGroup.gastos.reduce((sum: number, gasto: Gasto) => sum + Number(gasto.monto), 0);
            return (
              <View key={`rubro-${index}`}>
                <View style={styles.rubroHeader}>
                  <Text>{rubroGroup.rubro}</Text>
                </View>
                {rubroGroup.gastos.map((gasto: Gasto) => (
                  <View style={styles.tableRow} key={gasto.id}>
                    <View style={{ ...styles.tableColDescription, flex: 1 }}>
                      <Text style={styles.tableCell}>
                        {gasto.Proveedor?.nombre ? `${gasto.Proveedor.nombre} - ${gasto.descripcion}` : gasto.descripcion}
                      </Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: 70 }}>
                      <Text style={styles.tableCell}>{gasto.tipo_gasto}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: 120, textAlign: 'right' }}>
                      <Text style={styles.tableCell}>{`$${Number(gasto.monto).toLocaleString('es-AR')}`}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.subtotalRow}>
                  <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>{`Subtotal ${rubroGroup.rubro}: `}</Text>
                  <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>{`$${subtotalRubro.toLocaleString('es-AR')}`}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalText}>Total Liquidación: </Text>
        <Text style={styles.totalText}>{`$${Number(liquidacion.total).toLocaleString('es-AR')}`}</Text>
      </View>
    </Page>
  </Document>
);

export default LiquidacionPDF;
