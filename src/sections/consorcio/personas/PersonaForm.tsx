import { Grid, TextField, MenuItem, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { Persona } from 'types/persona'; // Assuming new type
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const PersonaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps } = useFormikContext<Persona>();
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

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
          label="Nombre"
          {...getFieldProps('nombre')}
          error={Boolean(touched.nombre && errors.nombre)}
          helperText={touched.nombre && errors.nombre}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Apellido"
          {...getFieldProps('apellido')}
          error={Boolean(touched.apellido && errors.apellido)}
          helperText={touched.apellido && errors.apellido}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="DNI"
          {...getFieldProps('dni')}
          error={Boolean(touched.dni && errors.dni)}
          helperText={touched.dni && errors.dni}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Tipo de Persona"
          {...getFieldProps('tipo')}
          error={Boolean(touched.tipo && errors.tipo)}
          helperText={touched.tipo && errors.tipo}
        >
          <MenuItem value="propietario">Propietario</MenuItem>
          <MenuItem value="inquilino">Inquilino</MenuItem>
          <MenuItem value="administrador">Administrador</MenuItem>
          <MenuItem value="otro">Otro</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
};

export default PersonaForm;
