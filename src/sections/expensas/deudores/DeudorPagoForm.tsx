import { Grid, TextField, Autocomplete, IconButton, Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useFormikContext, getIn, FormikValues } from 'formik';
import { useEffect, useMemo, useState } from 'react';

// types
import { DeudorLiquidacionUnidad } from 'types/liquidacion';
import { Persona } from 'types/persona';

// API hooks
import useConsorcio from 'hooks/useConsorcio';
import { useGetCuentas } from 'services/api/cuentasapi';
import { useGetPersonaUnidades } from 'services/api/personaUnidadapi';
import SeleccionarPersonaModal from 'sections/expensas/cobranzas/SeleccionarPersonaModal';

// assets
import { MinusOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons';

interface DeudorPagoFormProps {
  deuda: DeudorLiquidacionUnidad;
  montoRestante: number;
  unidadFuncionalId: number;
}

const DeudorPagoForm = ({ deuda, montoRestante, unidadFuncionalId }: DeudorPagoFormProps) => {
  const { errors, touched, getFieldProps, values, setFieldValue, handleBlur } = useFormikContext<FormikValues>();
  const { selectedConsorcio } = useConsorcio();
  const [personaModalOpen, setPersonaModalOpen] = useState(false);

  const { data: cuentas, isLoading: isLoadingCuentas } = useGetCuentas(selectedConsorcio?.id || 0, { enabled: !!selectedConsorcio });

  const { data: personaUnidades = [], isLoading: isLoadingPersonas } = useGetPersonaUnidades(
    { unidad_funcional_id: unidadFuncionalId },
    { enabled: !!unidadFuncionalId }
  );

  const [personasExternas, setPersonasExternas] = useState<Persona[]>([]);

  const personasPagadoras: Persona[] = useMemo(() => {
    const personasMap = new Map<number, Persona>();
    personaUnidades.forEach((pu) => {
      if (pu.Persona && pu.Persona.id) personasMap.set(pu.Persona.id, pu.Persona);
    });
    personasExternas.forEach((p) => {
      if (p.id) personasMap.set(p.id, p);
    });
    return Array.from(personasMap.values());
  }, [personaUnidades, personasExternas]);

  useEffect(() => {
    if (personaUnidades.length > 0 && !values.persona_id) {
      const inquilino = personaUnidades.find((pu) => pu.tipo === 'inquilino');
      const propietario = personaUnidades.find((pu) => pu.tipo === 'propietario');
      const personaPorDefecto = inquilino?.Persona || propietario?.Persona;
      setFieldValue('persona_id', personaPorDefecto?.id || null);
    }
  }, [personaUnidades, values.persona_id, setFieldValue]);

  useEffect(() => {
    let newTipoPago = 'parcial';
    const montoIngresado = parseFloat(values.monto);
    if (!isNaN(montoIngresado) && montoIngresado > 0) {
      const montoIngresadoRounded = Math.round(montoIngresado * 100) / 100;
      const montoFinalRounded = Math.round(Number(deuda.monto_final) * 100) / 100;
      if (montoIngresadoRounded === montoFinalRounded) {
        newTipoPago = 'total';
      }
    }
    if (values.tipo_pago !== newTipoPago) {
      setFieldValue('tipo_pago', newTipoPago);
    }
  }, [values.monto, values.tipo_pago, deuda.monto_final, setFieldValue]);

  const handleDateChange = (days: number) => {
    const [year, month, day] = values.fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    setFieldValue('fecha', date.toISOString().split('T')[0]);
  };

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  return (
    <Grid container spacing={3} sx={{ pt: 1 }}>
      <Grid item xs={12} sx={{ mb: -1 }}>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'grey.50', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Pagando Deuda del Período: {deuda.Liquidacion.periodo}
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={6} sm={6}>
              <Typography variant="caption" color="textSecondary">
                Deuda a Pagar
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ${montoRestante.toLocaleString('es-AR')}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography variant="caption" color="textSecondary">
                Monto Final
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ${Number(deuda.monto_final).toLocaleString('es-AR')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Autocomplete
            id="persona-pagadora-autocomplete"
            options={personasPagadoras}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
            value={personasPagadoras.find((p) => p.id === values.persona_id) || null}
            onChange={(event, newValue) => setFieldValue('persona_id', newValue ? newValue.id : null)}
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
                      {isLoadingPersonas && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </Box>
        <Tooltip title="Buscar otra persona">
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
          onChange={(event, newValue) => setFieldValue('cuenta_id', newValue ? newValue.id : null)}
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
          {...getFieldProps('monto')}
          onBlur={(e) => {
            handleBlur(e);
            const value = parseFloat(e.target.value);
            setFieldValue('monto', !isNaN(value) ? value.toFixed(2) : '');
          }}
          error={Boolean(getIn(touched, 'monto') && getIn(errors, 'monto'))}
          helperText={getIn(touched, 'monto') && getIn(errors, 'monto')}
        />
      </Grid>
      <Grid item xs={5} sm={2}>
        <TextField
          fullWidth
          label="Tipo"
          value={values.tipo_pago.charAt(0).toUpperCase() + values.tipo_pago.slice(1)}
          InputProps={{ readOnly: true }}
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
            inputProps={{ max: getTodayDateString() }}
          />
          <Box sx={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            <IconButton size="small" onClick={() => handleDateChange(-1)}>
              <MinusOutlined />
            </IconButton>
            <IconButton size="small" onClick={() => handleDateChange(1)}>
              <PlusOutlined />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth multiline rows={2} label="Comentario (Opcional)" {...getFieldProps('comentario')} />
      </Grid>
      <SeleccionarPersonaModal
        open={personaModalOpen}
        onClose={() => setPersonaModalOpen(false)}
        excludedIds={personasPagadoras.map((p) => p.id).filter((id): id is number => id !== undefined)}
        onSelect={(persona) => {
          if (!personasPagadoras.some((p) => p.id === persona.id)) {
            setPersonasExternas((prev) => [...prev, persona]);
          }
          setFieldValue('persona_id', persona.id);
        }}
      />
    </Grid>
  );
};

export default DeudorPagoForm;
