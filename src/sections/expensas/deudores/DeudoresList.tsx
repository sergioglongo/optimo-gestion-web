// material-ui
import { Box, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';

// third-party
import { ColumnDef } from '@tanstack/react-table';
import Loader from 'components/Loader';

// project-import
import IconButton from 'components/@extended/IconButton';
import TablaAdminCollapse from 'components/tables/TablaAdminCollapse';

// types
import { DeudorLiquidacionUnidad, LiquidacionUnidadDeudores } from 'types/liquidacion';

// utils
import { periodoFormat } from 'utils/dateFormat';

// assets
import { DollarOutlined } from '@ant-design/icons';

interface Props {
  data: LiquidacionUnidadDeudores[];
  columns: ColumnDef<LiquidacionUnidadDeudores>[];
  isLoading: boolean;
  onPay: (deuda: DeudorLiquidacionUnidad, unidadFuncionalId: number) => void;
}

const DeudoresSubComponent = ({
  data,
  onPay,
  unidadFuncionalId
}: {
  data: DeudorLiquidacionUnidad[];
  onPay: (deuda: DeudorLiquidacionUnidad, unidadFuncionalId: number) => void;
  unidadFuncionalId: number;
}) => {
  return (
    <Box sx={{ p: 2, bgcolor: '#e3f2fd' }}>
      <Typography variant="h6" gutterBottom>
        Detalle de Deuda
      </Typography>
      <Table size="small" aria-label="detalle-deuda">
        <TableHead>
          <TableRow>
            <TableCell>Período</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Expensa</TableCell>
            <TableCell align="right">Saldado</TableCell>
            <TableCell align="right">Restante</TableCell>
            <TableCell align="right">Interés</TableCell>
            <TableCell align="right">Deuda</TableCell>
            <TableCell align="right">Monto final</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((liquidacion) => {
            let color: 'primary' | 'warning' | 'success' | 'error' = 'primary';
            if (liquidacion.estado === 'pagada') color = 'success';
            if (liquidacion.estado === 'vencida') color = 'error';
            if (liquidacion.estado === 'pendiente') color = 'warning';
            if (liquidacion.estado === 'adeuda') color = 'error';

            return (
              <TableRow key={liquidacion.id}>
                <TableCell>{periodoFormat(liquidacion.Liquidacion.periodo)}</TableCell>
                <TableCell>
                  {/* @ts-ignore */}
                  <Chip color={color} label={liquidacion.estado} size="small" variant="light" />
                </TableCell>
                <TableCell align="right">${Number(liquidacion.monto).toLocaleString('es-AR')}</TableCell>
                <TableCell align="right" sx={{ color: 'success.dark' }}>
                  ${Number(liquidacion.saldado).toLocaleString('es-AR')}
                </TableCell>
                <TableCell align="right">${Number(liquidacion.restante).toLocaleString('es-AR')}</TableCell>
                <TableCell align="right">${Number(liquidacion.interes_deuda).toLocaleString('es-AR')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  ${Number(liquidacion.deuda).toLocaleString('es-AR')}
                </TableCell>
                <TableCell align="right">${Number(liquidacion.monto_final).toLocaleString('es-AR')}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    <Tooltip title="Registrar Pago">
                      <span>
                        <IconButton color="success" onClick={() => onPay(liquidacion, unidadFuncionalId)}>
                          <DollarOutlined />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

// ==============================|| DEUDORES - LIST ||============================== //

function DeudoresList({ data, columns, isLoading, onPay }: Props) {
  if (isLoading) {
    return <Loader />;
  }

  return (
    <TablaAdminCollapse
      data={data}
      columns={columns}
      renderSubComponent={(row) => <DeudoresSubComponent data={row.LiquidacionUnidads} onPay={onPay} unidadFuncionalId={row.id} />}
      csvFilename="lista-deudores.csv"
      searchPlaceholder={`Buscar en ${data.length} deudores...`}
    />
  );
}

export default DeudoresList;
