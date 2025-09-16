import { Grid, TextField, MenuItem, Typography, Box, Switch, FormControlLabel, InputAdornment, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { UnidadOperativa, TipoUnidadOperativa, LiquidarA } from 'types/unidadOperativa'; // Assuming new types
import { useState, useEffect } from 'react';
import useConsorcio from 'hooks/useConsorcio';

const UnidadOperativaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, setFieldValue, values } = useFormikContext<UnidadOperativa>();
  const { selectedConsorcio } = useConsorcio();

  const [isEtiquetaManual, setIsEtiquetaManual] = useState(false);

  useEffect(() => {
    if (!isEtiquetaManual) {
      const generatedEtiqueta = [values.identificador1, values.identificador2, values.identificador3].filter(Boolean).join('-');
      setFieldValue('etiqueta', generatedEtiqueta);
    }
  }, [values.identificador1, values.identificador2, values.identificador3, isEtiquetaManual, setFieldValue]);

  const handleEtiquetaManualToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsEtiquetaManual(checked);
    if (checked) {
      // When switching to manual, set the current generated value as the base
      const generatedEtiqueta = [values.identificador1, values.identificador2, values.identificador3].filter(Boolean).join(' ');
      setFieldValue('etiqueta', generatedEtiqueta);
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
          label="Tipo de Unidad Operativa"
          {...getFieldProps('tipo')}
          error={Boolean(touched.tipo && errors.tipo)}
          helperText={touched.tipo && errors.tipo}
        >
          {(['departamento', 'casa', 'duplex', 'local', 'cochera', 'baulera'] as TipoUnidadOperativa[]).map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
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
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Liquidar a"
              {...getFieldProps('liquidar_a')}
              error={Boolean(touched.liquidar_a && errors.liquidar_a)}
              helperText={touched.liquidar_a && errors.liquidar_a}
            >
              {(['propietario', 'inquilino', 'ambos'] as LiquidarA[]).map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Prorrateo"
              type="number"
              {...getFieldProps('prorrateo')}
              error={Boolean(touched.prorrateo && errors.prorrateo)}
              helperText={touched.prorrateo && errors.prorrateo}
              inputProps={{ style: { textAlign: 'center' }, step: 0.1 }}
            />
          </Grid>
        </Grid>
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

export default UnidadOperativaForm;
