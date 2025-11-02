import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  FormControl,
  Divider,
  Skeleton,
  IconButton
} from '@mui/material';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReactToPrint from 'react-to-print';

// project import
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import LiquidacionPDF from 'sections/expensas/liquidaciones/LiquidacionPDF';

import { APP_DEFAULT_PATH } from 'config';
import { useGetLiquidacionById } from 'services/api/liquidacionapi';
import { useAppDispatch } from 'store/hooks';
import { activeItem } from 'store/slices/menu';
import { periodoFormat, toLocaleDateFormat } from 'utils/dateFormat';
import { truncateString } from 'utils/textFormat';
import LoadingButton from 'components/@extended/LoadingButton';

// types
import { Gasto } from 'types/gasto';

// assets
import { DownloadOutlined, PrinterFilled } from '@ant-design/icons';

// ==============================|| LIQUIDACION - DETAILS ||============================== //

const LiquidacionDetalle = () => {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(activeItem({ openedItem: 'liquidaciones' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: liquidacion, isLoading } = useGetLiquidacionById(id!, {
    enabled: !!id
  });

  const isLoader = isLoading;

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Liquidaciones', to: '/expensas/liquidaciones' },
    { title: 'Detalles' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Detalle de Liquidación" links={breadcrumbLinks} />
      <MainCard content={false}>
        <Stack spacing={2.5}>
          <Box sx={{ p: 2.5, pb: 0 }}>
            <MainCard content={false} sx={{ p: 1.25, bgcolor: 'primary.lighter', borderColor: theme.palette.primary[100] }}>
              <Stack direction="row" justifyContent="center" spacing={1} gap={4}>
                {isLoader || !liquidacion ? (
                  <LoadingButton loading>X</LoadingButton>
                ) : (
                  <PDFDownloadLink
                    document={<LiquidacionPDF liquidacion={liquidacion} />}
                    fileName={`liquidacion-${liquidacion.periodo}.pdf`}
                  >
                    <IconButton
                      sx={{
                        color: theme.palette.secondary.main,
                        fontSize: 40,
                        transform: 'translateY(-2px)', // Elevado por defecto
                        filter: 'drop-shadow(0 2px 1px rgb(0 0 0 / 0.3))',
                        transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
                        '&:active': {
                          transform: 'translateY(0)', // Se presiona
                          filter: 'none' // Se quita la sombra
                        }
                      }}
                    >
                      <DownloadOutlined />
                    </IconButton>
                  </PDFDownloadLink>
                )}
                <ReactToPrint
                  trigger={() => (
                    <IconButton
                      sx={{
                        color: theme.palette.secondary.main,
                        fontSize: 40,
                        transform: 'translateY(-2px)', // Elevado por defecto
                        filter: 'drop-shadow(0 2px 1px rgb(0 0 0 / 0.3))',
                        transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
                        '&:active': {
                          transform: 'translateY(0)', // Se presiona
                          filter: 'none' // Se quita la sombra
                        }
                      }}
                    >
                      <PrinterFilled />
                    </IconButton>
                  )}
                  content={() => componentRef.current}
                />
              </Stack>
            </MainCard>
          </Box>
          <Box sx={{ p: 5 }} id="print" ref={componentRef}>
            <Grid container spacing={2.5}>
              {/* Header Consorcio */}
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">Consorcio:</Typography>
                    {isLoader ? (
                      <Stack spacing={0.5}>
                        <Skeleton />
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                      </Stack>
                    ) : (
                      <FormControl sx={{ width: '100%' }}>
                        <Typography color="primary" variant="h6">
                          {liquidacion?.Consorcio?.nombre}
                        </Typography>
                        <Typography color="secondary">{liquidacion?.Consorcio?.Domicilio?.direccion || ''}</Typography>
                        {liquidacion?.Consorcio?.Domicilio && (
                          <Typography color="secondary">
                            {`${liquidacion.Consorcio.Domicilio.Localidad?.nombre || ''}, ${
                              liquidacion.Consorcio.Domicilio.Provincia?.nombre || ''
                            }`}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  </Stack>
                </MainCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Stack spacing={1}>
                    <Typography variant="h5">Liquidado a:</Typography>
                    <FormControl sx={{ width: '100%' }}>
                      {/* Contenido futuro aquí */}
                      <Typography color="secondary">...</Typography>
                    </FormControl>
                  </Stack>
                </MainCard>
              </Grid>

              {/* Datos Liquidacion */}
              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h5">Período:</Typography>
                      <Typography color="secondary">
                        {isLoader ? <Skeleton width={80} /> : liquidacion?.periodo ? periodoFormat(liquidacion.periodo) : 'N/A'}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography variant="subtitle1">Fecha Emisión:</Typography>
                      <Typography color="secondary">
                        {isLoader ? (
                          <Skeleton width={70} />
                        ) : liquidacion?.fecha_emision ? (
                          toLocaleDateFormat(liquidacion.fecha_emision)
                        ) : (
                          'N/A'
                        )}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Typography sx={{ overflow: 'hidden' }} variant="subtitle1">
                        Fecha Cierre:
                      </Typography>
                      <Typography color="secondary">
                        {isLoader ? (
                          <Skeleton width={70} />
                        ) : liquidacion?.fecha_cierre ? (
                          toLocaleDateFormat(liquidacion.fecha_cierre)
                        ) : (
                          'N/A'
                        )}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* Gastos Table */}
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Gastos Incluidos
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell align="right">Monto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoader &&
                        [1, 2, 3].map((row: number) => (
                          <TableRow key={row} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell align="right">
                              <Skeleton />
                            </TableCell>
                          </TableRow>
                        ))}
                      {!isLoader &&
                        liquidacion?.Gastos?.map((rubroGroup: any, index: number) => {
                          const subtotalRubro = rubroGroup.gastos.reduce((sum: number, gasto: Gasto) => sum + Number(gasto.monto), 0);
                          return (
                            <>
                              <TableRow key={`rubro-${index}`} sx={{ backgroundColor: theme.palette.grey[50] }}>
                                <TableCell colSpan={4}>
                                  <Typography variant="h6" color="textSecondary">
                                    {rubroGroup.rubro}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              {rubroGroup.gastos.length > 0 ? (
                                <>
                                  {rubroGroup.gastos.map((gasto: Gasto) => (
                                    <TableRow key={gasto.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                      <TableCell>
                                        <Tooltip
                                          title={
                                            gasto.Proveedor?.nombre ? `${gasto.Proveedor.nombre} - ${gasto.descripcion}` : gasto.descripcion
                                          }
                                          placement="top"
                                        >
                                          <Typography>{truncateString(gasto.descripcion, 30)}</Typography>
                                        </Tooltip>
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          color={gasto.tipo_gasto === 'ordinario' ? 'primary' : 'secondary'}
                                          label={gasto.tipo_gasto}
                                          size="small"
                                          variant="light"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          color={gasto.estado === 'pagado' ? 'success' : gasto.estado === 'parcial' ? 'warning' : 'error'}
                                          label={gasto.estado}
                                          size="small"
                                          variant="light"
                                        />
                                      </TableCell>
                                      <TableCell align="right">{`$${Number(gasto.monto).toLocaleString('es-AR')}`}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow key={`subtotal-${index}`} sx={{ backgroundColor: theme.palette.grey[100] }}>
                                    <TableCell colSpan={3} align="right">
                                      <Typography variant="subtitle1">{`Subtotal ${rubroGroup.rubro}:`}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="subtitle1">{`$${subtotalRubro.toLocaleString('es-AR')}`}</Typography>
                                    </TableCell>
                                  </TableRow>
                                </>
                              ) : (
                                <TableRow key={`empty-${index}`}>
                                  <TableCell colSpan={4} align="center" sx={{ py: 1, color: theme.palette.grey[500] }}>
                                    - Sin gastos en este rubro -
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ borderWidth: 1 }} />
              </Grid>

              {/* Totales */}
              <Grid item xs={12} sm={6} md={8}></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1">Total Liquidación:</Typography>
                    <Typography variant="subtitle1">
                      {isLoader ? <Skeleton width={100} /> : `$${Number(liquidacion?.total).toLocaleString('es-AR')}`}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </MainCard>
    </>
  );
};

export default LiquidacionDetalle;
