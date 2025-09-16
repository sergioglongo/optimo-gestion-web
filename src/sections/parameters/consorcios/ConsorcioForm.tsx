import { Grid, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText, Input, Box } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { FormikProps } from 'formik';
import { Consorcio, CondicionFiscal, TipoConsorcio, TipoInteres, Modalidad } from 'types/consorcio';

interface ConsorcioFormProps {
  formik: FormikProps<Consorcio>;
  isCreating: boolean;
  setImageFile: (file: File | undefined) => void;
}

const ConsorcioForm = ({ formik, setImageFile }: ConsorcioFormProps) => {
  const { errors, touched, getFieldProps } = formik;

  const condicionFiscalOptions: CondicionFiscal[] = ['consumidor final', 'responsable inscripto', 'monotributista', 'exento'];
  const tipoConsorcioOptions: TipoConsorcio[] = ['edificio', 'barrio', 'country', 'complejo'];
  const tipoInteresOptions: TipoInteres[] = ['compuesto', 'acumulado'];
  const modalidadOptions: Modalidad[] = ['vencido', 'adelantado'];

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre"
          {...getFieldProps('nombre')}
          value={formik.values.nombre || ''}
          error={Boolean(touched.nombre && errors.nombre)}
          helperText={touched.nombre && errors.nombre}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Dirección"
          {...getFieldProps('direccion')}
          value={formik.values.direccion || ''}
          error={Boolean(touched.direccion && errors.direccion)}
          helperText={touched.direccion && errors.direccion}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={Boolean(touched.condicion_fiscal && errors.condicion_fiscal)}>
          <InputLabel>Condición Fiscal</InputLabel>
          <Select label="Condición Fiscal" {...getFieldProps('condicion_fiscal')} value={formik.values.condicion_fiscal || ''}>
            {condicionFiscalOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {touched.condicion_fiscal && errors.condicion_fiscal && <FormHelperText>{errors.condicion_fiscal}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Identificación"
          {...getFieldProps('identificacion')}
          value={formik.values.identificacion || ''}
          error={Boolean(touched.identificacion && errors.identificacion)}
          helperText={touched.identificacion && errors.identificacion}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={Boolean(touched.tipo && errors.tipo)}>
          <InputLabel>Tipo de Consorcio</InputLabel>
          <Select label="Tipo de Consorcio" {...getFieldProps('tipo')} value={formik.values.tipo || ''}>
            {tipoConsorcioOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {touched.tipo && errors.tipo && <FormHelperText>{errors.tipo}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={Boolean(touched.tipo_interes && errors.tipo_interes)}>
          <InputLabel>Tipo de Interés</InputLabel>
          <Select label="Tipo de Interés" {...getFieldProps('tipo_interes')} value={formik.values.tipo_interes || ''}>
            {tipoInteresOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {touched.tipo_interes && errors.tipo_interes && <FormHelperText>{errors.tipo_interes}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={Boolean(touched.modalidad && errors.modalidad)}>
          <InputLabel>Modalidad de Pago</InputLabel>
          <Select label="Modalidad de Pago" {...getFieldProps('modalidad')} value={formik.values.modalidad || ''}>
            {modalidadOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {touched.modalidad && errors.modalidad && <FormHelperText>{errors.modalidad}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Vencimiento 1"
          type="number"
          {...getFieldProps('vencimiento1')}
          value={formik.values.vencimiento1 || ''}
          error={Boolean(touched.vencimiento1 && errors.vencimiento1)}
          helperText={touched.vencimiento1 && errors.vencimiento1}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Vencimiento 2"
          type="number"
          {...getFieldProps('vencimiento2')}
          value={formik.values.vencimiento2 || ''}
          error={Boolean(touched.vencimiento2 && errors.vencimiento2)}
          helperText={touched.vencimiento2 && errors.vencimiento2}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Identificador 1"
          {...getFieldProps('identificador1')}
          value={formik.values.identificador1 || ''}
          error={Boolean(touched.identificador1 && errors.identificador1)}
          helperText={touched.identificador1 && errors.identificador1}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Identificador 2"
          {...getFieldProps('identificador2')}
          value={formik.values.identificador2 || ''}
          error={Boolean(touched.identificador2 && errors.identificador2)}
          helperText={touched.identificador2 && errors.identificador2}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Identificador 3"
          {...getFieldProps('identificador3')}
          value={formik.values.identificador3 || ''}
          error={Boolean(touched.identificador3 && errors.identificador3)}
          helperText={touched.identificador3 && errors.identificador3}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel shrink>Imagen Actual</InputLabel>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  minHeight: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {formik.values.imagen ? (
                  <Avatar src={formik.values.imagen} alt="Consorcio Image" variant="rounded" sx={{ width: 100, height: 100 }} />
                ) : (
                  <Box sx={{ color: 'text.secondary' }}>No hay imagen</Box>
                )}
              </Box>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="image-upload">
                Subir Nueva Imagen
              </InputLabel>
              <Input
                id="image-upload"
                type="file"
                inputProps={{ accept: 'image/*' }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files && event.target.files[0]) {
                    setImageFile(event.target.files[0]);
                    // Optionally, you can set the 'imagen' field for immediate preview
                    formik.setFieldValue('imagen', URL.createObjectURL(event.target.files[0]));
                  } else {
                    setImageFile(undefined);
                    formik.setFieldValue('imagen', ''); // Clear image preview if no file selected
                  }
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConsorcioForm;
