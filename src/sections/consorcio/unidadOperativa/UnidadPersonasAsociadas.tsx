import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { useGetPersonaUnidades } from 'services/api/personaUnidadapi';
import { TipoPersonaUnidad, UnidadOperativa } from 'types/unidadOperativa';

interface Props {
  unidad: UnidadOperativa | null;
}

const UnidadPersonasAsociadas = ({ unidad }: Props) => {
  const theme = useTheme();
  const { data: personaUnidades, isLoading } = useGetPersonaUnidades({ unidad_operativa_id: unidad?.id }, { enabled: !!unidad?.id });

  const getColorForTipo = (tipo: TipoPersonaUnidad) => {
    if (tipo === 'propietario') return 'primary';
    if (tipo === 'inquilino') return 'success';
    return 'info'; // para 'habitante'
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!personaUnidades || personaUnidades.length === 0) {
    return <Typography sx={{ p: 2 }}>Esta unidad no tiene personas asociadas.</Typography>;
  }

  return (
    <MainCard sx={{ mt: 1, border: `1px solid ${theme.palette.primary.main}`, boxShadow: theme.shadows[2] }}>
      <Stack direction="row" flexWrap="wrap" spacing={0}>
        {personaUnidades.map((pu) => (
          <Chip
            key={pu.id}
            label={`${pu.Persona ? `${pu.Persona.nombre} ${pu.Persona.apellido}` : `ID: ${pu.persona_id}`} (${pu.tipo})`}
            variant="light"
            color={getColorForTipo(pu.tipo)}
          />
        ))}
      </Stack>
    </MainCard>
  );
};

export default UnidadPersonasAsociadas;
