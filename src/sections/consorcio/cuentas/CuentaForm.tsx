import { Grid, TextField, MenuItem, Typography, Box, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { Cuenta } from 'types/cuenta';
import useConsorcio from 'hooks/useConsorcio';

const CuentaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, values, setFieldValue } = useFormikContext<Cuenta>();
  const { selectedConsorcio } = useConsorcio();
  const isCreating = !values.id;
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Descripción"
          {...getFieldProps('descripcion')}
          error={Boolean(touched.descripcion && errors.descripcion)}
          helperText={touched.descripcion && errors.descripcion}
        />
      </Grid>
      <Grid item xs={12} sm={isCreating ? 6 : 12}>
        <TextField
          select
          fullWidth
          label="Tipo de Cuenta"
          {...getFieldProps('tipo')}
          error={Boolean(touched.tipo && errors.tipo)}
          helperText={touched.tipo && errors.tipo}
        >
          <MenuItem value="corriente">Corriente</MenuItem>
          <MenuItem value="ahorro">Ahorro</MenuItem>
          <MenuItem value="caja">Caja</MenuItem>
          <MenuItem value="otro">Otro</MenuItem>
        </TextField>
      </Grid>
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
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
