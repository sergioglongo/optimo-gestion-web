import { Box, Grid, Stack, Typography, Chip } from '@mui/material';

// types
import { Gasto } from 'types/gasto';

interface GastosAdminRowProps {
  data: Gasto;
}

const GastosAdminRow = ({ data }: GastosAdminRowProps) => {
  const monto = Number(data.monto) || 0;
  const saldado = Number(data.saldado) || 0;
  const adeudado = monto - saldado;

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="textSecondary">
              Tipo
            </Typography>
            <Chip color={data.tipo_gasto === 'ordinario' ? 'primary' : 'warning'} label={data.tipo_gasto} size="small" variant="light" />
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="textSecondary">
              Asignado a
            </Typography>
            <Typography variant="body2">{data.unidad_asignada ? data.unidad_asignada.etiqueta : 'Consorcio'}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={4} sm={3} sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="textSecondary">
            Monto
          </Typography>
          <Typography variant="body2">${monto.toLocaleString('es-AR')}</Typography>
        </Grid>
        <Grid item xs={4} sm={3} sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="textSecondary">
            Saldado
          </Typography>
          <Typography variant="body2" color="success.dark">
            ${saldado.toLocaleString('es-AR')}
          </Typography>
        </Grid>
        <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="textSecondary">
            Adeudado
          </Typography>
          <Typography variant="body2" color={adeudado > 0 ? 'error.main' : 'inherit'}>
            ${adeudado.toLocaleString('es-AR')}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GastosAdminRow;
