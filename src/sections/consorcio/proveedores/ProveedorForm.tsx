import { Grid, TextField, MenuItem, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { Proveedor } from 'types/proveedor';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const ProveedorForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps } = useFormikContext<Proveedor>();
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  return (
    <Grid container spacing={3}>
      {selectedConsorcio && (
        <Grid item xs={12}>
          <Box sx={{ p: 1, borderRadius: 1, textAlign: 'center', color: 'white', backgroundColor: theme.palette.primary.main }}>
            <Typography variant="body1">
              Gestionando para el consorcio: <strong>{selectedConsorcio.nombre}</strong>
            </Typography>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre"
          {...getFieldProps('nombre')}
          error={Boolean(touched.nombre && errors.nombre)}
          helperText={touched.nombre && errors.nombre}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Servicio"
          {...getFieldProps('servicio')}
          error={Boolean(touched.servicio && errors.servicio)}
          helperText={touched.servicio && errors.servicio}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Tipo de Identificación"
          {...getFieldProps('tipo_identificacion')}
          error={Boolean(touched.tipo_identificacion && errors.tipo_identificacion)}
          helperText={touched.tipo_identificacion && errors.tipo_identificacion}
        >
          <MenuItem value="documento">Documento</MenuItem>
          <MenuItem value="cuit">CUIT</MenuItem>
          <MenuItem value="cuil">CUIL</MenuItem>
          <MenuItem value="otro">Otro</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Identificación"
          {...getFieldProps('identificacion')}
          value={getFieldProps('identificacion').value || ''}
          error={Boolean(touched.identificacion && errors.identificacion)}
          helperText={touched.identificacion && errors.identificacion}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="CBU"
          {...getFieldProps('CBU')}
          value={getFieldProps('CBU').value || ''}
          error={Boolean(touched.CBU && errors.CBU)}
          helperText={touched.CBU && errors.CBU}
        />
      </Grid>
    </Grid>
  );
};

export default ProveedorForm;
