import { Grid, TextField, MenuItem, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { Cuenta } from 'types/cuenta';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const CuentaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps } = useFormikContext<Cuenta>();
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
          label="Descripción"
          {...getFieldProps('descripcion')}
          error={Boolean(touched.descripcion && errors.descripcion)}
          helperText={touched.descripcion && errors.descripcion}
        />
      </Grid>
      <Grid item xs={12}>
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
    </Grid>
  );
};

export default CuentaForm;
