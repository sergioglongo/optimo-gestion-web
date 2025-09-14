import { Grid, TextField, MenuItem, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { UnidadOperativa, TipoUnidadOperativa, LiquidarA } from 'types/unidadOperativa'; // Assuming new types
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useState, useEffect } from 'react';

const UnidadOperativaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, setFieldValue, values } = useFormikContext<UnidadOperativa>();
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

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
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Etiqueta"
          {...getFieldProps('etiqueta')}
          error={Boolean(touched.etiqueta && errors.etiqueta)}
          helperText={touched.etiqueta && errors.etiqueta}
          disabled={!isEtiquetaManual}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={<Switch checked={isEtiquetaManual} onChange={handleEtiquetaManualToggle} name="isEtiquetaManual" color="primary" />}
          label="Editar Etiqueta Manualmente"
        />
      </Grid>
      <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={selectedConsorcio.identificador3}
            {...getFieldProps('identificador3')}
            error={Boolean(touched.identificador3 && errors.identificador3)}
            helperText={touched.identificador3 && errors.identificador3}
          />
        </Grid>
      )}
      <Grid item xs={12} md={6}>
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
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Prorrateo"
          type="number"
          {...getFieldProps('prorrateo')}
          error={Boolean(touched.prorrateo && errors.prorrateo)}
          helperText={touched.prorrateo && errors.prorrateo}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={getFieldProps('Intereses').value}
              onChange={(event) => setFieldValue('Intereses', event.target.checked)}
              name="Intereses"
              color="primary"
            />
          }
          label="Intereses"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={getFieldProps('alquilada').value}
              onChange={(event) => setFieldValue('alquilada', event.target.checked)}
              name="alquilada"
              color="primary"
            />
          }
          label="Alquilada"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Notas"
          multiline
          rows={3}
          {...getFieldProps('notas')}
          error={Boolean(touched.notas && errors.notas)}
          helperText={touched.notas && errors.notas}
        />
      </Grid>
    </Grid>
  );
};

export default UnidadOperativaForm;
