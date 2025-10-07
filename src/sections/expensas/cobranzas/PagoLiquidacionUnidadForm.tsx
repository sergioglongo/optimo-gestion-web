import { Grid, TextField, Autocomplete, IconButton, Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useFormikContext, getIn, FormikValues } from 'formik';
import { useEffect, useMemo, useState } from 'react';

// types
import { LiquidacionUnidad } from 'types/liquidacion';
import { Persona } from 'types/persona';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetCuentas } from 'services/api/cuentasapi';
import { useGetPersonaUnidades } from 'services/api/personaUnidadapi';
import SeleccionarPersonaModal from './SeleccionarPersonaModal';

// assets
import { MinusOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';

interface PagoLiquidacionUnidadFormProps {
  liquidacionUnidad: LiquidacionUnidad;
  interesCalculado: number;
  montoRestante: number;
  montoTotalAdeudado: number;
}

const PagoLiquidacionUnidadForm = ({
  liquidacionUnidad,
  interesCalculado,
  montoRestante,
  montoTotalAdeudado
}: PagoLiquidacionUnidadFormProps) => {
  const { errors, touched, getFieldProps, values, setFieldValue, handleBlur } = useFormikContext<FormikValues>();
  const { selectedConsorcio } = useConsorcio();
  const [personaModalOpen, setPersonaModalOpen] = useState(false);

  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  const { data: personaUnidades = [], isLoading: isLoadingPersonas } = useGetPersonaUnidades(
    { unidad_operativa_id: liquidacionUnidad.unidad_operativa_id },
    { enabled: !!liquidacionUnidad.unidad_operativa_id }
  );

  const [personasExternas, setPersonasExternas] = useState<Persona[]>([]);

  const personasPagadoras: Persona[] = useMemo(() => {
    const personasMap = new Map<number, Persona>();
    // 1. Agregar personas asociadas a la unidad
    personaUnidades.forEach((pu) => {
      if (pu.Persona) {
        personasMap.set(pu.Persona.id, pu.Persona);
      }
    });
    // 2. Agregar personas seleccionadas externamente
    personasExternas.forEach((p) => {
      personasMap.set(p.id, p);
    });

    return Array.from(personasMap.values());
  }, [personaUnidades, personasExternas]);

  useEffect(() => {
    // Autoseleccionar la persona que paga por defecto
    if (personaUnidades.length > 0 && !values.persona_id) {
      const inquilinoAssociation = personaUnidades.find((pu) => pu.tipo === 'inquilino');
      const propietarioAssociation = personaUnidades.find((pu) => pu.tipo === 'propietario');

      // Prioridad: 1. Inquilino, 2. Propietario
      const personaPorDefecto = inquilinoAssociation?.Persona || propietarioAssociation?.Persona;
      setFieldValue('persona_id', personaPorDefecto?.id || null);
    }
  }, [personaUnidades, values.persona_id, setFieldValue]);

  useEffect(() => {
    // Determinar tipo de pago (parcial/total)
    let newTipoPago = 'parcial';
    const montoIngresado = parseFloat(values.monto);

    if (!isNaN(montoIngresado) && montoIngresado > 0) {
      // Redondear a 2 decimales para evitar problemas de precisión con punto flotante
      const montoIngresadoRounded = Math.round(montoIngresado * 100) / 100;
      const montoRestanteRounded = Math.round(montoRestante * 100) / 100;

      // Si el monto ingresado es igual al monto restante adeudado, es un pago total.
      if (montoIngresadoRounded === montoRestanteRounded) {
        newTipoPago = 'total';
      } else {
        newTipoPago = 'parcial';
      }
    }

    if (values.tipo_pago !== newTipoPago) {
      setFieldValue('tipo_pago', newTipoPago);
    }
  }, [values.monto, values.tipo_pago, montoRestante, setFieldValue]);

  const handleDateChange = (days: number) => {
    const currentDateStr = values.fecha;
    if (!currentDateStr) return;

    const [year, month, day] = currentDateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);

    setFieldValue('fecha', date.toISOString().split('T')[0]);
  };

  // Helper function to get today's date as YYYY-MM-DD string
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <Grid container spacing={3} sx={{ pt: 1 }}>
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'grey.50',
            display: { sm: 'flex' },
            justifyContent: { sm: 'space-between' },
            alignItems: { sm: 'center' }
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
              Pagando Expensa Nro: {liquidacionUnidad.id} (Unidad: {liquidacionUnidad.UnidadOperativa?.etiqueta})
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Monto Original: $
              {Number(liquidacionUnidad.monto).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            {interesCalculado > 0 && (
              <Typography variant="body1" color="error.main">
                Intereses: ${interesCalculado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: { sm: 'right' } }}>
            <Typography variant="caption" display="block">
              Monto Total
            </Typography>
            <Typography variant="h6">
              ${montoTotalAdeudado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" display="block">
              Monto Adeudado
            </Typography>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
              ${montoRestante.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Autocomplete
            id="persona-pagadora-autocomplete"
            options={personasPagadoras}
            getOptionLabel={(option) => {
              const association = personaUnidades.find((pu) => pu.persona_id === option.id);
              const tipo = association?.tipo ? ` (${association.tipo.charAt(0).toUpperCase() + association.tipo.slice(1)})` : '';
              return `${option.nombre} ${option.apellido}${tipo}`;
            }}
            value={personasPagadoras.find((p) => p.id === values.persona_id) || null}
            onChange={(event, newValue) => {
              setFieldValue('persona_id', newValue ? newValue.id : null);
            }}
            loading={isLoadingPersonas}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Persona que paga"
                error={Boolean(getIn(touched, 'persona_id') && getIn(errors, 'persona_id'))}
                helperText={getIn(touched, 'persona_id') && getIn(errors, 'persona_id')}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingPersonas ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </Box>
        <Tooltip title="Buscar otra persona del consorcio">
          <IconButton onClick={() => setPersonaModalOpen(true)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <UserAddOutlined />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          id="cuenta-id-autocomplete"
          options={cuentas || []}
          getOptionLabel={(option) => `${option.descripcion} (${option.tipo})`}
          value={cuentas?.find((c) => c.id === values.cuenta_id) || null}
          onChange={(event, newValue) => {
            setFieldValue('cuenta_id', newValue ? newValue.id : null);
          }}
          loading={isLoadingCuentas}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cuenta de Ingreso"
              error={Boolean(getIn(touched, 'cuenta_id') && getIn(errors, 'cuenta_id'))}
              helperText={getIn(touched, 'cuenta_id') && getIn(errors, 'cuenta_id')}
            />
          )}
        />
      </Grid>
      <Grid item xs={7} sm={4}>
        <TextField
          fullWidth
          type="number"
          label="Monto a Pagar"
          placeholder="0.00"
          InputLabelProps={{ shrink: true }}
          {...getFieldProps('monto')}
          onBlur={(e) => {
            handleBlur(e);
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              setFieldValue('monto', value.toFixed(2));
            } else if (e.target.value === '') {
              setFieldValue('monto', '');
            }
          }}
          error={Boolean(getIn(touched, 'monto') && getIn(errors, 'monto'))}
          helperText={getIn(touched, 'monto') && getIn(errors, 'monto')}
          inputProps={{ step: '0.01' }}
          sx={{
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { display: 'none' },
            '& input[type=number]': { MozAppearance: 'textfield' }
          }}
        />
      </Grid>
      <Grid item xs={5} sm={2}>
        <TextField
          fullWidth
          label="Tipo"
          value={(values.tipo_pago || '').charAt(0).toUpperCase() + (values.tipo_pago || '').slice(1)}
          InputProps={{
            readOnly: true
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor:
                values.tipo_pago === 'total'
                  ? '#d4edda' // pastel green
                  : values.tipo_pago === 'parcial'
                  ? '#fff3cd' // pastel yellow
                  : 'transparent'
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de Pago"
            InputLabelProps={{ shrink: true }}
            {...getFieldProps('fecha')}
            error={Boolean(getIn(touched, 'fecha') && getIn(errors, 'fecha'))}
            helperText={getIn(touched, 'fecha') && getIn(errors, 'fecha')}
            inputProps={{
              max: getTodayDateString()
            }}
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label="Comentario (Opcional)"
          {...getFieldProps('comentario')}
          error={Boolean(getIn(touched, 'comentario') && getIn(errors, 'comentario'))}
          helperText={getIn(touched, 'comentario') && getIn(errors, 'comentario')}
        />
      </Grid>
      <SeleccionarPersonaModal
        open={personaModalOpen}
        onClose={() => setPersonaModalOpen(false)}
        excludedIds={personasPagadoras.map((p) => p.id)}
        onSelect={(persona) => {
          // Añadir la persona a la lista de externas si no está ya
          if (!personasPagadoras.some((p) => p.id === persona.id)) {
            setPersonasExternas((prev) => [...prev, persona]);
          }
          // Seleccionar la persona en el formulario
          setFieldValue('persona_id', persona.id);
        }}
      />
    </Grid>
  );
};

export default PagoLiquidacionUnidadForm;
