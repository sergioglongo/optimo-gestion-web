import { Grid, TextField, Autocomplete, CircularProgress, MenuItem } from '@mui/material';
import { useFormikContext, getIn } from 'formik';

// types
import { TipoMovimiento, EstadoTransaccion } from 'types/transaccion';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetCuentas } from 'services/api/cuentasapi';

const tipoMovimientoOptions: { value: TipoMovimiento; label: string }[] = [
  { value: 'egreso', label: 'Egreso' },
  { value: 'ingreso', label: 'Ingreso' }
];

const estadoOptions: { value: EstadoTransaccion; label: string }[] = [
  { value: 'completado', label: 'Completado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'anulado', label: 'Anulado' }
];

interface TransaccionFormProps {
  isCreating: boolean;
}

const TransaccionForm = ({ isCreating }: TransaccionFormProps) => {
  const { errors, touched, getFieldProps, values, setFieldValue, handleBlur } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  return (
    <Grid container spacing={3} pt={1}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          id="cuenta-id-autocomplete"
          disabled={!isCreating}
          options={cuentas || []}
          getOptionLabel={(option) => `${option.descripcion} (Balance: $${option.balance})`}
          value={cuentas?.find((c) => c.id === values.cuenta_id) || null}
          onChange={(event, newValue) => {
            setFieldValue('cuenta_id', newValue ? newValue.id : null);
          }}
          loading={isLoadingCuentas}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cuenta de Origen/Destino"
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
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Descripción"
          {...getFieldProps('descripcion')}
          error={Boolean(getIn(touched, 'descripcion') && getIn(errors, 'descripcion'))}
          helperText={getIn(touched, 'descripcion') && getIn(errors, 'descripcion')}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          type="date"
          disabled={!isCreating}
          label="Fecha"
          InputLabelProps={{ shrink: true }}
          {...getFieldProps('fecha')}
          error={Boolean(getIn(touched, 'fecha') && getIn(errors, 'fecha'))}
          helperText={getIn(touched, 'fecha') && getIn(errors, 'fecha')}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          fullWidth
          select
          disabled={!isCreating}
          label="Tipo de Movimiento"
          {...getFieldProps('tipo_movimiento')}
          error={Boolean(getIn(touched, 'tipo_movimiento') && getIn(errors, 'tipo_movimiento'))}
          helperText={getIn(touched, 'tipo_movimiento') && getIn(errors, 'tipo_movimiento')}
        >
          {tipoMovimientoOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          fullWidth
          type="number"
          disabled={!isCreating}
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
      <Grid item xs={6} sm={3}>
        <TextField
          fullWidth
          select
          label="Estado"
          {...getFieldProps('estado')}
          error={Boolean(getIn(touched, 'estado') && getIn(errors, 'estado'))}
          helperText={getIn(touched, 'estado') && getIn(errors, 'estado')}
        >
          {estadoOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default TransaccionForm;
