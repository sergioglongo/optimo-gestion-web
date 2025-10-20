import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { useGetPersonaUnidades } from 'services/api/personaUnidadapi';
import { Persona } from 'types/persona';
import { useMemo } from 'react';

interface Props {
  persona: Persona | null;
}

const PersonaUnidadesDrawer = ({ persona }: Props) => {
  const theme = useTheme();
  const { data: personaUnidades, isLoading } = useGetPersonaUnidades({ persona_id: persona?.id }, { enabled: !!persona?.id });

  const identificadorColorMap = useMemo(() => {
    if (!personaUnidades) return {};

    const chipColors: ('primary' | 'success' | 'info' | 'warning' | 'secondary')[] = ['primary', 'success', 'info', 'warning', 'secondary'];
    const uniqueIdentificadores = [...new Set(personaUnidades.map((pu) => pu.UnidadFuncional?.identificador1).filter(Boolean))];
    const map: { [key: string]: (typeof chipColors)[number] } = {};

    uniqueIdentificadores.forEach((identificador, index) => {
      if (identificador) {
        map[identificador] = chipColors[index % chipColors.length];
      }
    });
    return map;
  }, [personaUnidades]);

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
      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {personaUnidades.map((pu) => (
          <Chip
            key={pu.id}
            label={`${pu.UnidadFuncional?.etiqueta} (${pu.PersonaTipo?.nombre})`}
            variant="light"
            color={pu.UnidadFuncional?.identificador1 ? identificadorColorMap[pu.UnidadFuncional.identificador1] : 'default'}
          />
        ))}
      </Stack>
    </MainCard>
  );
};

export default PersonaUnidadesDrawer;
