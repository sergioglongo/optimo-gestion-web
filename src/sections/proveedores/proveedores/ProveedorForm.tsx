import { Grid, TextField, MenuItem, Typography, Box, Autocomplete, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext, getIn } from 'formik';
import { useState, useEffect } from 'react';

// project import
import { Proveedor, TipoIdentificacionProveedor } from 'types/proveedor';
import { Cuenta } from 'types/cuenta';
import { useGetRubros } from 'services/api/rubrosapi';
import { useGetProvincias, useGetLocalidades } from 'services/api/toolsapi';
import useConsorcio from 'hooks/useConsorcio';

import { useGetCuentas } from 'services/api/cuentasapi';
// assets

interface ProveedorFormProps {
  proveedor: Proveedor | null;
  open: boolean;
}

const ProveedorForm = ({ proveedor, open }: ProveedorFormProps) => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, values, setFieldValue } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const { data: cuentas = [] } = useGetCuentas(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open
  });

  const { data: allRubros = [] } = useGetRubros(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open
  });

  // --- Lógica de Domicilio ---
  const { data: provincias, isLoading: isLoadingProvincias } = useGetProvincias({ enabled: open });
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>('');
  const { data: localidades, isLoading: isLoadingLocalidades } = useGetLocalidades(selectedProvinciaId, { enabled: !!selectedProvinciaId });

  useEffect(() => {
    // Si hay un domicilio con provincia_id, se establece como la provincia seleccionada
    // para cargar las localidades correspondientes.
    if (values.Domicilio?.provincia_id) {
      setSelectedProvinciaId(values.Domicilio.provincia_id);
    }
  }, [values.Domicilio?.provincia_id]);

  // --- Fin Lógica de Domicilio ---

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
          label="Servicio / Descripción"
          {...getFieldProps('servicio')}
          error={Boolean(getIn(touched, 'servicio') && getIn(errors, 'servicio'))}
          helperText={getIn(touched, 'servicio') && getIn(errors, 'servicio')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField select fullWidth label="Tipo de Identificación" {...getFieldProps('tipo_identificacion')}>
          {(['documento', 'cuit', 'cuil', 'otro'] as TipoIdentificacionProveedor[]).map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Identificación"
          {...getFieldProps('identificacion')}
          value={values.identificacion || ''}
          error={Boolean(getIn(touched, 'identificacion') && getIn(errors, 'identificacion'))}
          helperText={getIn(touched, 'identificacion') && getIn(errors, 'identificacion')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="CBU / Alias (Opcional)" {...getFieldProps('CBU')} value={values.CBU || ''} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField select fullWidth label="Cuenta Principal" {...getFieldProps('cuenta_id')} value={values.cuenta_id || ''}>
          <MenuItem value="">Sin cuenta principal</MenuItem>
          {cuentas.map((cuenta: Cuenta) => (
            <MenuItem key={cuenta.id} value={cuenta.id}>{`${cuenta.descripcion} (${cuenta.tipo})`}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Email (Opcional)"
          type="email"
          {...getFieldProps('email')}
          value={values.email || ''}
          error={Boolean(getIn(touched, 'email') && getIn(errors, 'email'))}
          helperText={getIn(touched, 'email') && getIn(errors, 'email')}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Teléfono (Opcional)"
          {...getFieldProps('telefono')}
          value={values.telefono || ''}
          error={Boolean(getIn(touched, 'telefono') && getIn(errors, 'telefono'))}
          helperText={getIn(touched, 'telefono') && getIn(errors, 'telefono')}
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
      <Grid item xs={12} sm={4}>
        <Autocomplete
          id="provincia-autocomplete"
          options={provincias || []}
          getOptionLabel={(option) => option.nombre || ''}
          value={provincias?.find((p) => p.id === values.Domicilio?.provincia_id) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedProvinciaId(String(newValue.id));
              setFieldValue('Domicilio.provincia_id', newValue.id);
              setFieldValue('Domicilio.localidad_id', null); // Reset localidad on provincia change
            } else {
              setSelectedProvinciaId('');
              setFieldValue('Domicilio.provincia_id', null);
              setFieldValue('Domicilio.localidad_id', null);
            }
          }}
          loading={isLoadingProvincias}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.nombre}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Provincia"
              error={Boolean(getIn(touched, 'Domicilio.provincia_id') && getIn(errors, 'Domicilio.provincia_id'))}
              helperText={getIn(touched, 'Domicilio.provincia_id') && getIn(errors, 'Domicilio.provincia_id')}
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
      <Grid item xs={12} sm={4}>
        <Autocomplete
          id="localidad-autocomplete"
          options={localidades || []}
          getOptionLabel={(option) => option.nombre || ''}
          value={localidades?.find((l) => l.id === values.Domicilio?.localidad_id) || null}
          onChange={(event, newValue) => {
            setFieldValue('Domicilio.localidad_id', newValue ? newValue.id : null);
          }}
          loading={isLoadingLocalidades}
          disabled={!selectedProvinciaId || isLoadingLocalidades}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.nombre}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Localidad"
              error={Boolean(getIn(touched, 'Domicilio.localidad_id') && getIn(errors, 'Domicilio.localidad_id'))}
              helperText={getIn(touched, 'Domicilio.localidad_id') && getIn(errors, 'Domicilio.localidad_id')}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingLocalidades ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          fullWidth
          label="Rubro"
          value={values.Rubros && values.Rubros.length > 0 ? values.Rubros[0].id : ''}
          onChange={(e) => {
            const rubroId = e.target.value;
            setFieldValue('Rubros', rubroId ? [{ id: Number(rubroId) }] : []);
          }}
          error={Boolean(getIn(touched, 'Rubros') && getIn(errors, 'Rubros'))}
          helperText={getIn(touched, 'Rubros') ? (getIn(errors, 'Rubros') as any)?.[0]?.id || getIn(errors, 'Rubros') : ''}
        >
          <MenuItem value="">Seleccione un rubro</MenuItem>
          {allRubros.map((rubro) => (
            <MenuItem key={rubro.id} value={rubro.id}>
              {rubro.rubro}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default ProveedorForm;
