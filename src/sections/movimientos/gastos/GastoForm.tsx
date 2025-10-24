import { Grid, TextField, MenuItem, Autocomplete, CircularProgress, IconButton, Box, InputAdornment } from '@mui/material';
import { useFormikContext, getIn } from 'formik';
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';

// types
import { GastoEstado, GastoTipo } from 'types/gasto';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetRubros } from 'services/api/rubrosapi';
import { useGetProveedores } from 'services/api/proveedoresapi';

const GastoForm = () => {
  const { errors, touched, getFieldProps, values, setFieldValue, handleBlur } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const { data: rubros, isLoading: isLoadingRubros } = useGetRubros(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });
  const { data: proveedores, isLoading: isLoadingProveedores } = useGetProveedores(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio
  });

  const handleDateChange = (days: number) => {
    const currentDateStr = values.fecha;
    if (!currentDateStr) return;

    const [year, month, day] = currentDateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);

    setFieldValue('fecha', date.toISOString().split('T')[0]);
  };

  return (
    <Grid container spacing={3} sx={{ pt: 1 }}>
      <Grid item xs={12} sm={4}>
        <Autocomplete
          id="proveedor-id-autocomplete"
          options={proveedores || []}
          getOptionLabel={(option) => option.nombre}
          value={proveedores?.find((p) => p.id === values.proveedor_id) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setFieldValue('proveedor_id', newValue.id);
              const primerRubro = newValue.Rubros && newValue.Rubros.length > 0 ? newValue.Rubros[0].id : null;
              setFieldValue('rubro_gasto_id', primerRubro);
              setFieldValue('descripcion', newValue.servicio); // Rellena la descripción con el servicio del proveedor
            } else {
              setFieldValue('proveedor_id', null);
              setFieldValue('rubro_gasto_id', null);
              setFieldValue('descripcion', ''); // Limpia la descripción si se quita el proveedor
            }
          }}
          loading={isLoadingProveedores}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Proveedor"
              autoFocus
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingProveedores ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          select
          fullWidth
          label="Rubro"
          // Evita el warning de "out-of-range" esperando a que los rubros se carguen.
          // Si está cargando, el valor es '', si no, usa el valor de formik.
          value={isLoadingRubros ? '' : values.rubro_gasto_id}
          onChange={(e) => setFieldValue('rubro_gasto_id', e.target.value)}
          disabled={isLoadingRubros}
          error={Boolean(getIn(touched, 'rubro_gasto_id') && getIn(errors, 'rubro_gasto_id'))}
          helperText={getIn(touched, 'rubro_gasto_id') && getIn(errors, 'rubro_gasto_id')}
        >
          <MenuItem value="">
            <em>Seleccione un rubro</em>
          </MenuItem>
          {(rubros || []).map((rubro) => (
            <MenuItem key={rubro.id} value={rubro.id}>
              {rubro.rubro}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Nro. Comprobante"
          {...getFieldProps('comprobante')}
          error={Boolean(getIn(touched, 'comprobante') && getIn(errors, 'comprobante'))}
          helperText={getIn(touched, 'comprobante') && getIn(errors, 'comprobante')}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          fullWidth
          label="Descripción"
          variant="outlined" // Forzar la variante para que el InputAdornment se muestre correctamente
          {...getFieldProps('descripcion')}
          error={Boolean(getIn(touched, 'descripcion') && getIn(errors, 'descripcion'))}
          helperText={getIn(touched, 'descripcion') && getIn(errors, 'descripcion')}
          InputProps={{
            endAdornment: values.descripcion ? (
              <InputAdornment position="end">
                <IconButton aria-label="borrar descripción" onClick={() => setFieldValue('descripcion', '')} edge="end" size="small">
                  <CloseOutlined />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          type="number"
          label="Monto"
          disabled={values.id !== 0 && values.estado !== 'impago'}
          {...getFieldProps('monto')}
          error={Boolean(getIn(touched, 'monto') && getIn(errors, 'monto'))}
          onBlur={(e) => {
            handleBlur(e);
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              setFieldValue('monto', value.toFixed(2));
            } else if (e.target.value === '') {
              // Allow clearing the field
              setFieldValue('monto', '');
            }
          }}
          helperText={getIn(touched, 'monto') && getIn(errors, 'monto')}
          inputProps={{
            step: '0.01'
          }}
          sx={{
            // hide spin buttons
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              display: 'none'
            },
            '& input[type=number]': {
              MozAppearance: 'textfield'
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <TextField
            fullWidth
            type="date"
            label="Fecha del Gasto"
            InputLabelProps={{ shrink: true }}
            {...getFieldProps('fecha')}
            error={Boolean(getIn(touched, 'fecha') && getIn(errors, 'fecha'))}
            helperText={getIn(touched, 'fecha') && getIn(errors, 'fecha')}
            sx={{
              '& .MuiInputBase-input': {
                pr: '80px' // Padding to avoid text overlapping buttons
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 5,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              height: '60%',
              borderLeft: '1px solid lightgray',
              pl: 0.5
            }}
          >
            <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleDateChange(-1)}>
              <MinusOutlined style={{ fontSize: '0.7rem' }} />
            </IconButton>
            <IconButton size="small" sx={{ p: 0.2 }} onClick={() => handleDateChange(1)}>
              <PlusOutlined style={{ fontSize: '0.7rem' }} />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField select fullWidth label="Tipo de Gasto" {...getFieldProps('tipo_gasto')}>
          {(['ordinario', 'extraordinario'] as GastoTipo[]).map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField select fullWidth label="Estado" {...getFieldProps('estado')} disabled>
          {(['impago', 'parcial', 'pagado'] as GastoEstado[]).map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          type="month"
          label="Período Aplica (Opcional)"
          InputLabelProps={{ shrink: true }}
          name="periodo_aplica"
          value={values.periodo_aplica ? values.periodo_aplica.substring(0, 7) : ''}
          onChange={(e) => {
            const monthValue = e.target.value;
            setFieldValue('periodo_aplica', monthValue ? `${monthValue}-01` : null);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default GastoForm;
