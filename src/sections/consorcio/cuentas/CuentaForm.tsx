import React, { Fragment } from 'react';
import { Grid, TextField, MenuItem, Typography, Box, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { Cuenta, tiposDeCuenta } from 'types/cuenta';
import useConsorcio from 'hooks/useConsorcio';

const CuentaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, values, setFieldValue } = useFormikContext<Cuenta>();
  const { selectedConsorcio } = useConsorcio();
  const isCreating = !values.id;
  const isEfectivo = values.tipo === 'efectivo';

  const handleTipoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTipo = event.target.value;
    setFieldValue('tipo', newTipo);
    if (newTipo === 'efectivo') {
      setFieldValue('numero', '');
      setFieldValue('cbu', '');
      setFieldValue('alias', '');
      setFieldValue('titular', '');
    }
  };

  return (
    <Grid container spacing={3}>
      {selectedConsorcio && (
        <Grid item xs={12}>
          <Box sx={{ p: 1, borderRadius: 1, textAlign: 'center', color: 'white', backgroundColor: theme.palette.primary.main }}>
            <Typography variant="body1">
              <strong>Consorcio {selectedConsorcio.nombre}</strong>
            </Typography>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} sm={isEfectivo ? 12 : 6}>
        <TextField
          fullWidth
          label="Descripción"
          {...getFieldProps('descripcion')}
          error={Boolean(touched.descripcion && errors.descripcion)}
          helperText={touched.descripcion && errors.descripcion}
        />
      </Grid>
      {!isEfectivo && (
        <Fragment>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Titular"
              {...getFieldProps('titular')}
              error={Boolean(touched.titular && errors.titular)}
              helperText={touched.titular && errors.titular}
            />
          </Grid>
        </Fragment>
      )}
      <Grid item xs={12} sm={4}>
        <TextField
          select
          fullWidth
          label="Tipo de Cuenta"
          name="tipo"
          value={values.tipo}
          onChange={handleTipoChange}
          error={Boolean(touched.tipo && errors.tipo)}
          helperText={touched.tipo && errors.tipo}
        >
          {tiposDeCuenta.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {!isEfectivo && (
        <Fragment>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Número de Cuenta"
              {...getFieldProps('numero')}
              error={Boolean(touched.numero && errors.numero)}
              helperText={touched.numero && errors.numero}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="CBU"
              {...getFieldProps('cbu')}
              error={Boolean(touched.cbu && errors.cbu)}
              helperText={touched.cbu && errors.cbu}
            />
          </Grid>
          <Grid item xs={12} sm={!isCreating ? 3 : 12}>
            <TextField
              fullWidth
              label="Alias"
              {...getFieldProps('alias')}
              error={Boolean(touched.alias && errors.alias)}
              helperText={touched.alias && errors.alias}
            />
          </Grid>
        </Fragment>
      )}
      {isCreating && (
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Balance Inicial"
            type="number"
            {...getFieldProps('balance')}
            error={Boolean(touched.balance && errors.balance)}
            helperText={touched.balance && errors.balance}
            inputProps={{ step: '0.01' }}
            sx={{
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { display: 'none' },
              '& input[type=number]': { MozAppearance: 'textfield' }
            }}
          />
        </Grid>
      )}
      {!isCreating && (
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="Ultima Conciliacion"
            {...getFieldProps('fecha_ultima_conciliacion')}
            error={Boolean(touched.fecha_ultima_conciliacion && errors.fecha_ultima_conciliacion)}
            helperText={touched.fecha_ultima_conciliacion && errors.fecha_ultima_conciliacion}
            InputLabelProps={{ shrink: true }}
            value={values.fecha_ultima_conciliacion ? new Date(values.fecha_ultima_conciliacion).toISOString().split('T')[0] : ''}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FormControlLabel
          control={
            <Tooltip title={values.pagos ? 'Habilitada para registrar pagos' : 'Deshabilitada para registrar pagos'}>
              <Switch
                checked={values.pagos}
                onChange={(event) => setFieldValue('pagos', event.target.checked)}
                name="pagos"
                color="primary"
              />
            </Tooltip>
          }
          label="Para Pagos"
          labelPlacement="top"
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 0.1 } }}
        />
      </Grid>
      <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FormControlLabel
          control={
            <Tooltip title={values.cobranzas ? 'Habilitada para registrar cobranzas' : 'Deshabilitada para registrar cobranzas'}>
              <Switch
                checked={values.cobranzas}
                onChange={(event) => setFieldValue('cobranzas', event.target.checked)}
                name="cobranzas"
                color="primary"
              />
            </Tooltip>
          }
          label="Para Cobranzas"
          labelPlacement="top"
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 0.1 } }}
        />
      </Grid>
    </Grid>
  );
};

export default CuentaForm;
