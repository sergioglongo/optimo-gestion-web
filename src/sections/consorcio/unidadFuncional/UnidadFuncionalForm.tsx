import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { unidadFuncional, LiquidarA, TipounidadFuncional } from 'types/unidadFuncional'; // Assuming new types
import { useState, useEffect } from 'react';
import useConsorcio from 'hooks/useConsorcio';
import { useGetCuentas } from 'services/api/cuentasapi';

interface unidadFuncionalFormProps {
  tiposunidadFuncional: TipounidadFuncional[];
}

const UnidadFuncionalForm = ({ tiposunidadFuncional }: unidadFuncionalFormProps) => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, setFieldValue, values } = useFormikContext<unidadFuncional>();
  const { selectedConsorcio } = useConsorcio();

  const [isEtiquetaManual, setIsEtiquetaManual] = useState(false);

  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  useEffect(() => {
    if (!isEtiquetaManual) {
      const generatedEtiqueta = [values.identificador1, values.identificador2, values.identificador3].filter(Boolean).join('-');
      setFieldValue('etiqueta', generatedEtiqueta);
    }
  }, [values.identificador1, values.identificador2, values.identificador3, isEtiquetaManual, setFieldValue]);

  useEffect(() => {
    // Si la unidad no está alquilada, forzar que se liquide solo al propietario.
    if (!values.alquilada && values.liquidar_a !== 'propietario') {
      setFieldValue('liquidar_a', 'propietario');
    }
  }, [values.alquilada, values.liquidar_a, setFieldValue]);

  useEffect(() => {
    // Si el prorrateo del consorcio no es por 'auto', deshabilitar y apagar el prorrateo automático.
    if (selectedConsorcio?.prorrateo !== 'auto') {
      if (values.prorrateo_automatico) {
        setFieldValue('prorrateo_automatico', false);
      }
    } else if (values.prorrateo_automatico) {
      // Si el prorrateo automático está activado, buscar el índice del tipo de unidad y asignarlo.
      const tipoSeleccionado = tiposunidadFuncional.find((tipo) => tipo.id === values.tipo_unidad_funcional_id);
      const nuevoProrrateo = tipoSeleccionado ? tipoSeleccionado.indice : 0;
      if (values.prorrateo !== nuevoProrrateo) {
        setFieldValue('prorrateo', nuevoProrrateo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.alquilada, values.liquidar_a, setFieldValue]);

  const handleEtiquetaManualToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsEtiquetaManual(checked);
    if (checked) {
      // When switching to manual, set the current generated value as the base
      const generatedEtiqueta = [values.identificador1, values.identificador2, values.identificador3].filter(Boolean).join(' ');
      setFieldValue('etiqueta', generatedEtiqueta);
    }
  };

  const liquidarAOptions: LiquidarA[] = values.alquilada ? ['propietario', 'inquilino', 'ambos'] : ['propietario'];

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
      <Grid item xs={6} md={4}>
        <TextField
          fullWidth
          label="Etiqueta"
          {...getFieldProps('etiqueta')}
          error={Boolean(touched.etiqueta && errors.etiqueta)}
          helperText={touched.etiqueta && errors.etiqueta}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: !isEtiquetaManual,
            sx: { padding: 0 },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={isEtiquetaManual ? 'Generar automaticamente' : 'Escribir manualmente'}>
                  <Switch
                    size="small"
                    checked={isEtiquetaManual}
                    onChange={handleEtiquetaManualToggle}
                    name="isEtiquetaManual"
                    color="primary"
                  />
                </Tooltip>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          select
          fullWidth
          label="Tipo de Unidad Funcional"
          {...getFieldProps('tipo_unidad_funcional_id')}
          error={Boolean(touched.tipo_unidad_funcional_id && errors.tipo_unidad_funcional_id)}
          helperText={touched.tipo_unidad_funcional_id && errors.tipo_unidad_funcional_id}
          InputLabelProps={{ shrink: true }}
        >
          {tiposunidadFuncional.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {selectedConsorcio?.identificador1 && (
        <Grid item xs={4} md={1.66}>
          <TextField
            fullWidth
            label={selectedConsorcio.identificador1}
            {...getFieldProps('identificador1')}
            error={Boolean(touched.identificador1 && errors.identificador1)}
            helperText={touched.identificador1 && errors.identificador1}
          />
        </Grid>
      )}
      {selectedConsorcio?.identificador2 && (
        <Grid item xs={4} md={1.66}>
          <TextField
            fullWidth
            label={selectedConsorcio.identificador2}
            {...getFieldProps('identificador2')}
            error={Boolean(touched.identificador2 && errors.identificador2)}
            helperText={touched.identificador2 && errors.identificador2}
          />
        </Grid>
      )}
      {selectedConsorcio?.identificador3 && (
        <Grid item xs={4} md={1.66}>
          <TextField
            fullWidth
            label={selectedConsorcio.identificador3}
            {...getFieldProps('identificador3')}
            error={Boolean(touched.identificador3 && errors.identificador3)}
            helperText={touched.identificador3 && errors.identificador3}
          />
        </Grid>
      )}
      {/* --- Bloque de Liquidación --- */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              select
              fullWidth
              label="Liquidar a"
              disabled={!values.alquilada}
              {...getFieldProps('liquidar_a')}
              error={Boolean(touched.liquidar_a && errors.liquidar_a)}
              helperText={touched.liquidar_a && errors.liquidar_a}
            >
              {liquidarAOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Tooltip title={getFieldProps('alquilada').value ? 'Inquilino Habilitado' : 'Sin Inquilino'}>
                  <Switch
                    checked={getFieldProps('alquilada').value}
                    onChange={(event) => setFieldValue('alquilada', event.target.checked)}
                    name="alquilada"
                    color="primary"
                  />
                </Tooltip>
              }
              label="Alquilada"
              labelPlacement="top"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 0.1 } }}
            />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Tooltip title={getFieldProps('Intereses').value ? 'Genera intereses' : 'No genera intereses'}>
                  <Switch
                    checked={getFieldProps('Intereses').value}
                    onChange={(event) => setFieldValue('Intereses', event.target.checked)}
                    name="Intereses"
                    color="primary"
                  />
                </Tooltip>
              }
              label="Intereses"
              labelPlacement="top"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 0.1 } }}
            />
          </Grid>
          <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Tooltip title={getFieldProps('prorrateo_automatico').value ? 'Prorrateo automático' : 'Prorrateo manual'}>
                  <Switch
                    checked={getFieldProps('prorrateo_automatico').value}
                    onChange={(event) => setFieldValue('prorrateo_automatico', event.target.checked)}
                    name="prorrateo_automatico"
                    disabled={selectedConsorcio?.prorrateo !== 'auto'}
                    color="primary"
                  />
                </Tooltip>
              }
              label="Prorrat. Auto"
              labelPlacement="top"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 0.1 } }}
            />
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TextField
              label="Prorrateo"
              type="number"
              name="prorrateo"
              value={values.prorrateo}
              onChange={getFieldProps('prorrateo').onChange}
              error={Boolean(touched.prorrateo && errors.prorrateo)}
              helperText={touched.prorrateo && errors.prorrateo}
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setFieldValue('prorrateo', value.toFixed(2));
                }
              }}
              disabled={values.prorrateo_automatico}
              inputProps={{ style: { textAlign: 'center' }, step: 0.01 }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          id="cuenta-id-autocomplete"
          options={cuentas || []}
          getOptionLabel={(option) => `${option.descripcion} (${option.tipo})`}
          value={cuentas?.find((c: any) => c.id === values.cuenta_id) || null}
          onChange={(event, newValue) => {
            setFieldValue('cuenta_id', newValue ? newValue.id : null);
          }}
          loading={isLoadingCuentas}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cuenta Contable (Opcional)"
              error={Boolean(touched.cuenta_id && errors.cuenta_id)}
              helperText={touched.cuenta_id && errors.cuenta_id}
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
      {/* --- Bloque de Notas --- */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Notas"
          multiline
          {...getFieldProps('notas')}
          error={Boolean(touched.notas && errors.notas)}
          helperText={touched.notas && errors.notas}
          sx={{ height: '100%' }}
          InputProps={{ sx: { height: '100%', alignItems: 'flex-start' } }}
        />
      </Grid>
    </Grid>
  );
};

export default UnidadFuncionalForm;
