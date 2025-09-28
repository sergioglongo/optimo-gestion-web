import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { useGetPersonaUnidades } from 'services/api/personaUnidadapi';
import { Persona } from 'types/persona';

interface Props {
  persona: Persona | null;
}

const PersonaUnidadesDrawer = ({ persona }: Props) => {
  const theme = useTheme();
  const { data: personaUnidades, isLoading } = useGetPersonaUnidades({ persona_id: persona?.id }, { enabled: !!persona?.id });

  const chipColors: ('primary' | 'secondary' | 'success' | 'warning' | 'info')[] = ['primary', 'success', 'info', 'warning', 'secondary'];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!personaUnidades || personaUnidades.length === 0) {
    return <Typography sx={{ p: 2 }}>Esta persona no está asociada a ninguna unidad.</Typography>;
  }

  return (
    <MainCard sx={{ mt: 1, border: `1px solid ${theme.palette.primary.main}`, boxShadow: theme.shadows[2] }}>
      <Stack direction="row" flexWrap="wrap" spacing={0}>
        {personaUnidades.map((pu, index) => (
          <Chip
            key={pu.id}
            label={`${pu.UnidadOperativa?.etiqueta || `Unidad ID: ${pu.unidad_operativa_id}`} (${pu.tipo})`}
            variant="light"
            color={chipColors[index % chipColors.length]}
          />
        ))}
      </Stack>
    </MainCard>
  );
};

export default PersonaUnidadesDrawer;
