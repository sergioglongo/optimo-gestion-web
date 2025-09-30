import { Grid, TextField, MenuItem, Typography, Box, Autocomplete, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext, getIn } from 'formik';
import { TipoPersonaOptions, TipoIdentificacionPersonaOptions } from 'types/persona';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useGetProvincias, useGetLocalidades } from 'services/api/toolsapi';
import { useEffect, useState } from 'react';

const PersonaForm = () => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, values, setFieldValue } = useFormikContext<any>();
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const { data: provincias, isLoading: isLoadingProvincias } = useGetProvincias();
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<number | string>('');
  const { data: localidades, isLoading: isLoadingLocalidades } = useGetLocalidades(selectedProvinciaId, { enabled: !!selectedProvinciaId });

  useEffect(() => {
    if (provincias && values.Domicilio && values.Domicilio.provincia) {
      const initialProvincia = provincias.find((p) => p.nombre === values.Domicilio!.provincia);
      if (initialProvincia) {
        setSelectedProvinciaId(initialProvincia.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provincias, values.Domicilio?.provincia, values.id]); // Se ejecuta cuando las provincias cargan, la provincia o el id de la persona cambia

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
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre"
          {...getFieldProps('nombre')}
          error={Boolean(getIn(touched, 'nombre') && getIn(errors, 'nombre'))}
          helperText={getIn(touched, 'nombre') && getIn(errors, 'nombre')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Apellido"
          {...getFieldProps('apellido')}
          error={Boolean(getIn(touched, 'apellido') && getIn(errors, 'apellido'))}
          helperText={getIn(touched, 'apellido') && getIn(errors, 'apellido')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Tipo de Persona"
          {...getFieldProps('tipo_persona')}
          error={Boolean(getIn(touched, 'tipo_persona') && getIn(errors, 'tipo_persona'))}
          helperText={getIn(touched, 'tipo_persona') && getIn(errors, 'tipo_persona')}
        >
          {TipoPersonaOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Teléfono" {...getFieldProps('telefono')} value={values.telefono || ''} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Tipo de Identificación"
          {...getFieldProps('tipo_identificacion')}
          value={values.tipo_identificacion || ''}
          error={Boolean(getIn(touched, 'tipo_identificacion') && getIn(errors, 'tipo_identificacion'))}
          helperText={getIn(touched, 'tipo_identificacion') && getIn(errors, 'tipo_identificacion')}
        >
          {TipoIdentificacionPersonaOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Identificación"
          {...getFieldProps('identificacion')}
          value={values.identificacion || ''}
          error={Boolean(getIn(touched, 'identificacion') && getIn(errors, 'identificacion'))}
          helperText={getIn(touched, 'identificacion') && getIn(errors, 'identificacion')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Domicilio"
          {...getFieldProps('Domicilio.direccion')}
          value={values.Domicilio?.direccion || ''}
          error={Boolean(getIn(touched, 'Domicilio.direccion') && getIn(errors, 'Domicilio.direccion'))}
          helperText={getIn(touched, 'Domicilio.direccion') && getIn(errors, 'Domicilio.direccion')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          id="provincia-autocomplete"
          options={provincias || []}
          getOptionLabel={(option) => option.nombre}
          value={provincias?.find((p) => p.nombre === values.Domicilio?.provincia) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedProvinciaId(newValue.id);
              setFieldValue('Domicilio.provincia', newValue.nombre);
              setFieldValue('Domicilio.localidad', ''); // Reset localidad on provincia change
            } else {
              setSelectedProvinciaId('');
              setFieldValue('Domicilio.provincia', '');
              setFieldValue('Domicilio.localidad', '');
            }
          }}
          loading={isLoadingProvincias}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Provincia"
              error={Boolean(getIn(touched, 'Domicilio.provincia') && getIn(errors, 'Domicilio.provincia'))}
              helperText={getIn(touched, 'Domicilio.provincia') && getIn(errors, 'Domicilio.provincia')}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingProvincias ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          id="localidad-autocomplete"
          options={localidades || []}
          getOptionLabel={(option) => option.nombre}
          value={localidades?.find((l) => l.nombre === values.Domicilio?.localidad) || null}
          onChange={(event, newValue) => {
            setFieldValue('Domicilio.localidad', newValue ? newValue.nombre : '');
          }}
          loading={isLoadingLocalidades}
          disabled={!selectedProvinciaId || isLoadingLocalidades}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Localidad"
              error={Boolean(getIn(touched, 'Domicilio.localidad') && getIn(errors, 'Domicilio.localidad'))}
              helperText={getIn(touched, 'Domicilio.localidad') && getIn(errors, 'Domicilio.localidad')}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          {...getFieldProps('email')}
          value={values.email || ''} // Ensure value is always a string
          error={Boolean(getIn(touched, 'email') && getIn(errors, 'email'))}
          helperText={getIn(touched, 'email') && getIn(errors, 'email')}
        />
      </Grid>
      {/* El campo Rol de Usuario se elimina del formulario, ya que se establece en 'usuario' por defecto en el modal. */}
    </Grid>
  );
};

export default PersonaForm;
