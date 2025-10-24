import { Grid, TextField, Autocomplete, CircularProgress, IconButton, Typography, Box } from '@mui/material';
import { useFormikContext, getIn } from 'formik';
import { useEffect } from 'react';

// types
import { PagoProveedor } from 'types/pagoProveedor';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetCuentas } from 'services/api/cuentasapi';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
// import { formatDateOnly } from 'utils/dateFormat';

interface PagoProveedorEditFormProps {
  pago: PagoProveedor;
}

const PagoProveedorEditForm = ({ pago }: PagoProveedorEditFormProps) => {
  const { errors, touched, getFieldProps, values, setFieldValue, handleBlur } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  // Efecto para calcular el tipo de pago (total/parcial) basado en el monto ingresado
  useEffect(() => {
    let newTipoPago = 'impago';
    const montoActual = parseFloat(values.monto);

    if (pago.Gasto && !isNaN(montoActual) && montoActual > 0) {
      // Un pago es 'total' si su monto es igual al monto original del gasto.
      const montoTotalGasto = Number(pago.Gasto.monto) || 0;

      if (montoActual.toFixed(2) === montoTotalGasto.toFixed(2)) {
        newTipoPago = 'total';
      } else {
        newTipoPago = 'parcial';
      }
    }

    if (values.tipo_pago !== newTipoPago) {
      setFieldValue('tipo_pago', newTipoPago);
    }
  }, [values.monto, values.tipo_pago, pago, setFieldValue]);

  const handleDateChange = (days: number) => {
    const [year, month, day] = values.fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    setFieldValue('fecha', date.toISOString().split('T')[0]);
  };

  return (
    <Grid container spacing={3} sx={{ pt: 1 }}>
      <Grid item xs={12}>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Pagando a: {pago.Proveedor?.nombre}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Gasto: {pago.Gasto?.descripcion}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            (Monto Original del Gasto: ${Number(pago.Gasto?.monto).toLocaleString('es-AR')})
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          label="Monto"
          placeholder="0.00"
          InputLabelProps={{ shrink: true }}
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
              backgroundColor: values.tipo_pago === 'total' ? '#d4edda' : values.tipo_pago === 'parcial' ? '#fff3cd' : 'transparent'
            }
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
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

      <Grid item xs={12} sm={6}>
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
  );
};

export default PagoProveedorEditForm;
