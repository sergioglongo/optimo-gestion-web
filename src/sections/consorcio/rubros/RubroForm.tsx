import { Grid, TextField, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext } from 'formik';
import { Rubro } from 'types/rubro';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const RubroForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps } = useFormikContext<Rubro>();
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
          label="Nombre del Rubro"
          {...getFieldProps('rubro')}
          error={Boolean(touched.rubro && errors.rubro)}
          helperText={touched.rubro && errors.rubro}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Orden"
          type="number"
          {...getFieldProps('orden')}
          error={Boolean(touched.orden && errors.orden)}
          helperText={touched.orden && errors.orden}
        />
      </Grid>
    </Grid>
  );
};

export default RubroForm;
