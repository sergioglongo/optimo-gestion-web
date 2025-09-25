import {
  Grid,
  TextField,
  // MenuItem,
  Autocomplete,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import { useFormikContext, getIn } from 'formik';
import { useEffect } from 'react';

// types
// import { TipoPagoProveedor } from 'types/pagoProveedor';
import { Gasto } from 'types/gasto';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetProveedores } from 'services/api/proveedoresapi';
import { useGetCuentas } from 'services/api/cuentasapi'; // Assuming this hook exists
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';

interface PagoProveedorFormProps {
  gastosDelProveedor: Gasto[];
  isLoadingGastos: boolean;
}

const PagoProveedorForm = ({ gastosDelProveedor, isLoadingGastos }: PagoProveedorFormProps) => {
  const { errors, touched, getFieldProps, values, setFieldValue, handleBlur } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const { data: proveedores, isLoading: isLoadingProveedores } = useGetProveedores(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio
  });
  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  useEffect(() => {
    // Si la lista de gastos se actualiza y contiene un solo elemento, lo autoseleccionamos.
    if (gastosDelProveedor.length === 1) {
      const unicoGasto = gastosDelProveedor[0];
      const montoAPagar = unicoGasto.deuda && unicoGasto.deuda > 0 ? unicoGasto.deuda : unicoGasto.monto;
      setFieldValue('gasto_id', unicoGasto.id);
      setFieldValue('monto', montoAPagar);
    }
  }, [gastosDelProveedor, setFieldValue]);

  useEffect(() => {
    let newTipoPago = 'impago';

    if (values.gasto_id) {
      const selectedGasto = gastosDelProveedor.find((g) => g.id === values.gasto_id);
      if (selectedGasto) {
        const montoActual = parseFloat(values.monto);
        // The "total" amount is always the full original amount of the expense.
        const montoTotalGasto = parseFloat(selectedGasto.monto as any);

        if (!isNaN(montoActual) && montoActual > 0 && !isNaN(montoTotalGasto)) {
          // Compare them as fixed-point numbers (as strings) to avoid floating point issues
          if (montoActual.toFixed(2) === montoTotalGasto.toFixed(2)) {
            newTipoPago = 'total';
          } else {
            newTipoPago = 'parcial';
          }
        }
      }
    }
    if (values.tipo_pago !== newTipoPago) {
      setFieldValue('tipo_pago', newTipoPago);
    }
  }, [values.monto, values.gasto_id, values.tipo_pago, gastosDelProveedor, setFieldValue]);
  const handleDateChange = (days: number) => {
    const currentDateStr = values.fecha;
    if (!currentDateStr) return;

    const [year, month, day] = currentDateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);

    setFieldValue('fecha', date.toISOString().split('T')[0]);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              id="proveedor-id-autocomplete"
              options={proveedores || []}
              getOptionLabel={(option) => option.nombre}
              value={proveedores?.find((p) => p.id === values.proveedor_id) || null}
              onChange={(event, newValue) => {
                setFieldValue('proveedor_id', newValue ? newValue.id : null);
                setFieldValue('gasto_id', null); // Limpiar gasto seleccionado
                setFieldValue('monto', ''); // Limpiar monto
                setFieldValue('cuenta_id', newValue?.cuenta_id || null); // Seleccionar cuenta del proveedor si existe
              }}
              loading={isLoadingProveedores}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proveedor"
                  error={Boolean(getIn(touched, 'proveedor_id') && getIn(errors, 'proveedor_id'))}
                  helperText={getIn(touched, 'proveedor_id') && getIn(errors, 'proveedor_id')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingProveedores ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box border={1} borderColor="lightgray" borderRadius={1} padding={1} width={'100%'}>
              <Typography
                variant="h6"
                gutterBottom
                textAlign={'center'}
                sx={{ borderBottom: 1, borderWidth: 2, borderColor: 'secondary.light' }}
              >
                Gastos Pendientes del Proveedor
              </Typography>
              {getIn(touched, 'gasto_id') && getIn(errors, 'gasto_id') && (
                <Typography color="error" variant="caption" sx={{ pl: 1 }}>
                  {getIn(errors, 'gasto_id')}
                </Typography>
              )}
              {isLoadingGastos && !!values.proveedor_id ? (
                <CircularProgress />
              ) : (
                <List
                  dense
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: 'auto',
                    p: 0
                  }}
                >
                  {gastosDelProveedor.length > 0 ? (
                    gastosDelProveedor.map((gasto: Gasto) => (
                      <ListItem
                        button
                        divider
                        key={gasto.id}
                        selected={values.gasto_id === gasto.id}
                        onClick={() => {
                          // If there's an outstanding debt, that's the amount to be paid. Otherwise, it's the full amount.
                          const montoAPagar = gasto.deuda && gasto.deuda > 0 ? gasto.deuda : gasto.monto;
                          setFieldValue('gasto_id', gasto.id);
                          setFieldValue('monto', montoAPagar);
                        }}
                      >
                        {gasto.deuda && gasto.deuda > 0 ? (
                          <ListItemText
                            primary={`${new Date(gasto.fecha).toLocaleDateString()} - ${gasto.descripcion}`}
                            secondary={`Deuda: $${gasto.deuda.toLocaleString('es-AR')} (Total: $${gasto.monto.toLocaleString('es-AR')})`}
                          />
                        ) : (
                          <ListItemText
                            primary={`${new Date(gasto.fecha).toLocaleDateString()} - ${gasto.descripcion} - $${gasto.monto.toLocaleString(
                              'es-AR'
                            )}`}
                          />
                        )}
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      {values.proveedor_id ? (
                        <ListItemText primary="No hay gastos para este proveedor." />
                      ) : (
                        <ListItemText primary="Seleccione un proveedor" />
                      )}
                    </ListItem>
                  )}
                </List>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tipo de Pago"
              value={(values.tipo_pago || '').charAt(0).toUpperCase() + (values.tipo_pago || '').slice(1)}
              InputProps={{
                readOnly: true
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor:
                    values.tipo_pago === 'total'
                      ? '#d4edda' // pastel green
                      : values.tipo_pago === 'parcial'
                      ? '#fff3cd' // pastel yellow
                      : 'transparent'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Monto"
              placeholder="0.00"
              InputLabelProps={{ shrink: true }}
              disabled={!values.gasto_id}
              {...getFieldProps('monto')}
              error={Boolean(getIn(touched, 'monto') && getIn(errors, 'monto'))}
              onBlur={(e) => {
                handleBlur(e);
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setFieldValue('monto', value.toFixed(2));
                } else if (e.target.value === '') {
                  setFieldValue('monto', '');
                }
              }}
              helperText={getIn(touched, 'monto') && getIn(errors, 'monto')}
              inputProps={{ step: '0.01' }}
              sx={{
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { display: 'none' },
                '& input[type=number]': { MozAppearance: 'textfield' }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5}>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Pago"
                InputLabelProps={{ shrink: true }}
                {...getFieldProps('fecha')}
                error={Boolean(getIn(touched, 'fecha') && getIn(errors, 'fecha'))}
                helperText={getIn(touched, 'fecha') && getIn(errors, 'fecha')}
                sx={{
                  '& .MuiInputBase-input': {
                    pr: '80px' // Padding to avoid text overlapping buttons
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  right: 5,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  height: '60%',
                  borderLeft: '1px solid lightgray',
                  pl: 0.5
                }}
              >
                <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleDateChange(-1)}>
                  <MinusOutlined style={{ fontSize: '0.7rem' }} />
                </IconButton>
                <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleDateChange(1)}>
                  <PlusOutlined style={{ fontSize: '0.7rem' }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="cuenta-id-autocomplete"
              options={cuentas || []}
              getOptionLabel={(option) => `${option.descripcion} (${option.tipo})`}
              value={cuentas?.find((c) => c.id === values.cuenta_id) || null}
              onChange={(event, newValue) => {
                setFieldValue('cuenta_id', newValue ? newValue.id : null);
              }}
              loading={isLoadingCuentas}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cuenta de pago"
                  error={Boolean(getIn(touched, 'cuenta_id') && getIn(errors, 'cuenta_id'))}
                  helperText={getIn(touched, 'cuenta_id') && getIn(errors, 'cuenta_id')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingCuentas ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comentario (Opcional)"
              {...getFieldProps('comentario')}
              error={Boolean(getIn(touched, 'comentario') && getIn(errors, 'comentario'))}
              helperText={getIn(touched, 'comentario') && getIn(errors, 'comentario')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PagoProveedorForm;
