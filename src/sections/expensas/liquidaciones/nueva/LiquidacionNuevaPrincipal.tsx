import { Grid, TextField } from '@mui/material';
import { useFormikContext, getIn } from 'formik';
import { DatePicker, LocalizationProvider, esES } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import useConsorcio from 'hooks/useConsorcio';

// ==============================|| LIQUIDACION FORM ||============================== //

const LiquidacionForm = () => {
  const { errors, touched, getFieldProps, setFieldValue, values, handleBlur } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const getMinDate = () => {
    // Usamos el valor 'periodo' del formulario, que ya tiene el valor inicial mínimo calculado.
    if (selectedConsorcio?.ultimo_periodo_liquidado) {
      // Se parsea el string 'YYYY-MM-DD' para evitar problemas de timezone.
      const [year, month] = selectedConsorcio.ultimo_periodo_liquidado.split('-').map(Number); // ej: 2025-09-01 -> year=2025, month=9
      // Date.UTC usa meses 0-indexados (0=Enero, 11=Diciembre).
      // Si el último período fue Septiembre (month=9), el siguiente mes es Octubre, que tiene índice 9.
      return new Date(Date.UTC(year, month, 2));
    }
    return null;
  };

  const getMaxDate = () => {
    const currentYear = new Date().getFullYear();
    // La fecha máxima es el último día del año siguiente.
    return new Date(Date.UTC(currentYear + 1, 11, 31));
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={es}
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Grid container spacing={3} pt={1} sx={{ mb: 1, justifyContent: 'space-between' }}>
        <Grid item xs={12} sm={4} md={3}>
          <DatePicker
            label="Período"
            timezone="UTC"
            views={['year', 'month']}
            minDate={getMinDate()}
            maxDate={getMaxDate()}
            value={values.periodo ? new Date(values.periodo.replace(/-/g, '/')) : null}
            onChange={(newValue) => {
              if (newValue instanceof Date && !isNaN(newValue.getTime())) {
                if (selectedConsorcio?.dia_cierre) {
                  const year = newValue.getUTCFullYear();
                  const month = newValue.getUTCMonth(); // 0-11
                  const closeDay = selectedConsorcio.dia_cierre;

                  const closeDate = new Date(Date.UTC(year, month, closeDay));
                  setFieldValue('fecha_cierre', closeDate.toISOString().split('T')[0]);
                } else {
                  setFieldValue('fecha_cierre', null);
                }

                const year = newValue.getUTCFullYear();
                const month = (newValue.getUTCMonth() + 1).toString().padStart(2, '0');
                setFieldValue('periodo', `${year}-${month}-01`);
                setFieldValue('gastos', []); // Limpiar gastos al cambiar el período
              } else {
                setFieldValue('periodo', null);
                setFieldValue('gastos', []); // Limpiar gastos si se borra el período
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(getIn(touched, 'periodo') && getIn(errors, 'periodo')),
                helperText: getIn(touched, 'periodo') && getIn(errors, 'periodo')
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de Emisión"
            {...getFieldProps('fecha_emision')}
            error={Boolean(getIn(touched, 'fecha_emision') && getIn(errors, 'fecha_emision'))}
            helperText={getIn(touched, 'fecha_emision') && getIn(errors, 'fecha_emision')}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de Cierre"
            {...getFieldProps('fecha_cierre')}
            error={Boolean(getIn(touched, 'fecha_cierre') && getIn(errors, 'fecha_cierre'))}
            helperText={getIn(touched, 'fecha_cierre') && getIn(errors, 'fecha_cierre')}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={1} sx={{ justifyContent: 'center' }}>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="number"
            label="1er Venc."
            {...getFieldProps('primer_vencimiento')}
            error={Boolean(getIn(touched, 'primer_vencimiento') && getIn(errors, 'primer_vencimiento'))}
            helperText={getIn(touched, 'primer_vencimiento') && getIn(errors, 'primer_vencimiento')}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="number"
            label="1er Recarg."
            {...getFieldProps('primer_vencimiento_recargo')}
            error={Boolean(getIn(touched, 'primer_vencimiento_recargo') && getIn(errors, 'primer_vencimiento_recargo'))}
            helperText={getIn(touched, 'primer_vencimiento_recargo') && getIn(errors, 'primer_vencimiento_recargo')}
            onBlur={(e) => {
              handleBlur(e);
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setFieldValue('primer_vencimiento_recargo', value.toFixed(2));
              }
            }}
            inputProps={{
              step: '0.01'
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="number"
            label="2do Venc."
            {...getFieldProps('segundo_vencimiento')}
            error={Boolean(getIn(touched, 'segundo_vencimiento') && getIn(errors, 'segundo_vencimiento'))}
            helperText={getIn(touched, 'segundo_vencimiento') && getIn(errors, 'segundo_vencimiento')}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="number"
            label="2do Recarg."
            {...getFieldProps('segundo_vencimiento_recargo')}
            error={Boolean(getIn(touched, 'segundo_vencimiento_recargo') && getIn(errors, 'segundo_vencimiento_recargo'))}
            helperText={getIn(touched, 'segundo_vencimiento_recargo') && getIn(errors, 'segundo_vencimiento_recargo')}
            onBlur={(e) => {
              handleBlur(e);
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setFieldValue('segundo_vencimiento_recargo', value.toFixed(2));
              }
            }}
            inputProps={{
              step: '0.01'
            }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default LiquidacionForm;
