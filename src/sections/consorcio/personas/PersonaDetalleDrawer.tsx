import { Divider, Typography } from '@mui/material';
import ViewDrawer from 'components/drawers/ViewDrawer';
import { Persona } from 'types/persona';
import PersonaUnidadesDrawer from './PersonaUnidadesDrawer';

interface PersonaDetalleDrawerProps {
  open: boolean;
  onClose: () => void;
  persona: Persona | null;
}

const PersonaDetalleDrawer = ({ open, onClose, persona }: PersonaDetalleDrawerProps) => {
  if (!persona) {
    return null;
  }

  const items = [
    { label: 'Nombre Completo', value: `${persona.nombre} ${persona.apellido}` },
    [
      { label: 'Tipo de Persona', value: persona.tipo_persona },
      { label: 'Teléfono', value: persona.telefono || '-' }
    ],
    [
      { label: 'Tipo Identificación', value: persona.tipo_identificacion || '-' },
      { label: 'Identificación', value: persona.identificacion || '-' }
    ],
    { label: 'Email', value: persona.Usuario?.email || '-' },
    { label: 'Domicilio', value: persona.Domicilio?.direccion || '-' },
    {
      label: 'Localidad',
      value: persona.Domicilio ? `${persona.Domicilio.Localidad?.nombre || '-'}, ${persona.Domicilio.Provincia?.nombre || '-'}` : '-'
    }
  ] as const;

  return (
    <ViewDrawer open={open} onClose={onClose} title="Detalles de la Persona" items={items}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ px: 2, mb: 1 }}>
        Unidades Asociadas
      </Typography>
      <PersonaUnidadesDrawer persona={persona} />
    </ViewDrawer>
  );
};

export default PersonaDetalleDrawer;
