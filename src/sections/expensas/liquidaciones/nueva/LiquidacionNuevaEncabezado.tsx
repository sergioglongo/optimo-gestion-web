import { Grid, TextField, FormControl, FormHelperText } from '@mui/material';
import { useFormikContext, getIn } from 'formik';
import { DatePicker, LocalizationProvider, esES } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import useConsorcio from 'hooks/useConsorcio';

// ==============================|| LIQUIDACION FORM ||============================== //

const LiquidacionNuevaEncabezado = () => {
  const { errors, touched, getFieldProps, setFieldValue, values, handleBlur, setFieldTouched } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const getMinDate = () => {
    if (selectedConsorcio?.ultimo_periodo_liquidado) {
      // Se parsea el string 'YYYY-MM-DD' para evitar problemas de timezone.
      const [year, month] = selectedConsorcio.ultimo_periodo_liquidado.split('-').map(Number); // ej: 2025-09-01 -> year=2025, month=9
      // Si el último período fue Septiembre (month=9), el siguiente mes disponible es Octubre (índice 9 en Date.UTC).
      console.log('ultimo_periodo_liquidado', selectedConsorcio.ultimo_periodo_liquidado);
      console.log('year ultimo', year);
      console.log('month ultimo', month);
      const mindate = new Date(Date.UTC(year, month, 2));
      console.log('mindate', mindate);
      return mindate;
    }
    return null;
  };

  const getMaxDate = () => {
    const minDate = getMinDate();
    if (minDate) {
      // Se suman 3 meses a la fecha mínima permitida.
      const maxdate = new Date(minDate);
      maxdate.setUTCMonth(maxdate.getUTCMonth() + 3);
      console.log('maxdate', maxdate);
      return maxdate;
    }
    // Fallback por si no hay minDate, aunque no debería ocurrir en el flujo normal.
    return new Date(new Date().setMonth(new Date().getMonth() + 3));
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
            value={
              values.periodo
                ? (() => {
                    const [year, month] = values.periodo.split('-').map(Number);
                    return new Date(Date.UTC(year, month - 1, 2));
                  })()
                : null
            }
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
          <DatePicker
            label="Fecha de Emisión"
            timezone="UTC"
            value={values.fecha_emision ? new Date(values.fecha_emision + 'T00:00:00Z') : null}
            onChange={(newValue) => {
              if (newValue instanceof Date && !isNaN(newValue.getTime())) {
                setFieldValue('fecha_emision', newValue.toISOString().split('T')[0]);
              } else {
                setFieldValue('fecha_emision', null);
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: Boolean(getIn(touched, 'fecha_emision') && getIn(errors, 'fecha_emision')),
                helperText: getIn(touched, 'fecha_emision') && getIn(errors, 'fecha_emision'),
                onBlur: () => setFieldTouched('fecha_emision', true)
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth error={Boolean(getIn(touched, 'fecha_cierre') && getIn(errors, 'fecha_cierre'))}>
            <DatePicker
              label="Fecha de Cierre"
              timezone="UTC"
              value={values.fecha_cierre ? new Date(values.fecha_cierre + 'T00:00:00Z') : null}
              onChange={(newValue) => {
                if (newValue instanceof Date && !isNaN(newValue.getTime())) {
                  setFieldValue('fecha_cierre', newValue.toISOString().split('T')[0]);
                } else {
                  setFieldValue('fecha_cierre', null);
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(getIn(touched, 'fecha_cierre') && getIn(errors, 'fecha_cierre')),
                  onBlur: () => setFieldTouched('fecha_cierre', true)
                }
              }}
            />
            {getIn(touched, 'fecha_cierre') && getIn(errors, 'fecha_cierre') && (
              <FormHelperText error>{getIn(errors, 'fecha_cierre')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={1} sx={{ justifyContent: 'center' }}>
        <Grid item xs={6} sm={3} md={2}>
          <TextField
            fullWidth
            type="number"
            label="1er Venc."
            value={values.primer_vencimiento ?? ''}
            onChange={(e) => setFieldValue('primer_vencimiento', e.target.value === '' ? null : Number(e.target.value))}
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
            value={values.segundo_vencimiento ?? ''}
            onChange={(e) => setFieldValue('segundo_vencimiento', e.target.value === '' ? null : Number(e.target.value))}
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

export default LiquidacionNuevaEncabezado;
