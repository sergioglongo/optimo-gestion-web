import { Grid, TextField, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { TipounidadFuncional } from 'types/unidadFuncional';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const TipounidadFuncionalForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps } = useFormikContext<TipounidadFuncional>();
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
      <Grid item xs={12} sm={8}>
        <TextField
          fullWidth
          label="Nombre del Tipo de Unidad"
          {...getFieldProps('nombre')}
          error={Boolean(touched.nombre && errors.nombre)}
          helperText={touched.nombre && errors.nombre}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Índice"
          type="number"
          {...getFieldProps('indice')}
          error={Boolean(touched.indice && errors.indice)}
          helperText={touched.indice && errors.indice}
          inputProps={{ step: '0.01' }}
        />
      </Grid>
    </Grid>
  );
};

export default TipounidadFuncionalForm;
