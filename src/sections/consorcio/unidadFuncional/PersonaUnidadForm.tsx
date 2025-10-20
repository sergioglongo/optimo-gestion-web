import {
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  ListItemSecondaryAction,
  Autocomplete,
  TextField
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

// project import
import { unidadFuncional, PersonaUnidad, TipoPersonaUnidad } from 'types/unidadFuncional';
import { Persona } from 'types/persona';
import { useGetPersonas } from 'services/api/personasapi';
import { useGetPersonaUnidades, useCreatePersonaUnidad, useDeletePersonaUnidad } from 'services/api/personaUnidadapi';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { DeleteOutlined } from '@ant-design/icons';

interface PersonaUnidadFormProps {
  unidadFuncional: unidadFuncional;
  open?: boolean;
}

const PersonaUnidadForm = ({ unidadFuncional, open = true }: PersonaUnidadFormProps) => {
  const { selectedConsorcio } = useConsorcio();
  const theme = useTheme();

  // ==============================|| API & STATE ||============================== //

  const { data: allPersonas = [], isLoading: isLoadingPersonas } = useGetPersonas(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open
  });

  const { data: existingAssociations = [], isLoading: isLoadingAssociations } = useGetPersonaUnidades(
    { unidad_funcional_id: unidadFuncional?.id },
    { enabled: !!unidadFuncional?.id && open }
  );

  const createAssociation = useCreatePersonaUnidad();
  const deleteAssociation = useDeletePersonaUnidad();

  const [selectedPropietario, setSelectedPropietario] = useState<Persona | null>(null);
  const [selectedInquilino, setSelectedInquilino] = useState<Persona | null>(null);
  const [selectedHabitante, setSelectedHabitante] = useState<Persona | null>(null);

  // ==============================|| HANDLERS ||============================== //

  const handleAdd = async (persona: Persona | null, tipo: TipoPersonaUnidad) => {
    if (!persona || !unidadFuncional || persona.id === undefined) return;

    try {
      await createAssociation.mutateAsync({
        persona_id: persona.id,
        unidad_funcional_id: unidadFuncional.id,
        tipo
      });

      if (tipo === 'propietario') setSelectedPropietario(null);
      if (tipo === 'inquilino') setSelectedInquilino(null);
      if (tipo === 'habitante') setSelectedHabitante(null);
    } catch (error) {
      console.error(`Error al añadir ${tipo}:`, error);
    }
  };

  const handleDelete = async (associationId: number) => {
    try {
      await deleteAssociation.mutateAsync(associationId);
    } catch (error) {
      console.error('Error al eliminar la asociación:', error);
    }
  };

  const getPersonaName = (persona_id: number) => {
    const persona = allPersonas.find((p) => p.id === persona_id);
    return persona ? `${persona.apellido} ${persona.nombre}` : `Persona ID: ${persona_id}`;
  };

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    trim: true,
    stringify: (option: Persona) => `${option.apellido} ${option.nombre}`
  });

  // ==============================|| RENDER ||============================== //

  const renderAssociationSection = (
    title: string,
    tipo: TipoPersonaUnidad,
    selectedPersona: Persona | null,
    setSelectedPersona: (persona: Persona | null) => void,
    buttonLabel: string = 'Añadir'
  ) => {
    // Filter associations for the current type (propietario, inquilino, habitante)
    const associationsForType = existingAssociations.filter((a: any) => a.PersonaTipo?.nombre === tipo);

    // A person can only have one role per unit. Get all IDs of people already associated with this unit.
    const allAssociatedPersonIds = existingAssociations.map((a) => a.persona_id);

    // People available in the dropdown are those not already associated with this unit in any role.
    const availablePersonas = allPersonas.filter((p) => p.id !== undefined && !allAssociatedPersonIds.includes(p.id));

    // For single-association types (propietario, inquilino), check if an association already exists.
    const isSingleAssociationType = tipo === 'propietario' || tipo === 'inquilino';
    const canAdd = !isSingleAssociationType || associationsForType.length === 0;

    return (
      <>
        <Box borderBottom={1} borderColor="darkgrey" padding={0} width={'100%'}>
          <Typography padding={1} variant="h5">
            {title}
          </Typography>
        </Box>
        {canAdd && (
          <Grid container spacing={1} alignItems="center" sx={{ ml: 1, mt: 1 }}>
            <Grid item xs={8}>
              <Autocomplete
                filterOptions={filterOptions}
                options={availablePersonas}
                getOptionLabel={(option) => `${option.apellido} ${option.nombre}`}
                value={selectedPersona}
                onChange={(event, newValue) => {
                  setSelectedPersona(newValue);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Seleccionar ${title}`}
                    size="small"
                    disabled={isLoadingPersonas || createAssociation.isLoading}
                  />
                )}
                noOptionsText="No hay personas disponibles"
                disabled={isLoadingPersonas || createAssociation.isLoading}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                onClick={() => handleAdd(selectedPersona, tipo)}
                disabled={!selectedPersona || createAssociation.isLoading}
              >
                {buttonLabel}
              </Button>
            </Grid>
          </Grid>
        )}
        <List dense>
          {associationsForType.map((assoc: PersonaUnidad) => (
            <ListItem key={assoc.id}>
              <ListItemText primary={getPersonaName(assoc.persona_id)} primaryTypographyProps={{ variant: 'h5' }} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(assoc.id)} disabled={deleteAssociation.isLoading}>
                  <DeleteOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  if (isLoadingAssociations) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {selectedConsorcio && (
        <Grid item xs={12}>
          <Box sx={{ p: 1, borderRadius: 1, textAlign: 'center', color: 'white', backgroundColor: theme.palette.primary.main }}>
            <Typography variant="body1">
              <strong>Consorcio {selectedConsorcio.nombre}</strong>
            </Typography>
          </Box>
        </Grid>
      )}
      {/* Columna Izquierda: Propietario e Inquilino */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={0}>
          <Box border={1} borderColor="lightgray" borderRadius={1} padding={0} width={'100%'}>
            <Grid item xs={12}>
              {renderAssociationSection('Propietario', 'propietario', selectedPropietario, setSelectedPropietario, 'Asignar')}
            </Grid>
          </Box>
          {unidadFuncional.alquilada && (
            <Box border={1} borderColor="lightgray" borderRadius={1} padding={0} width={'100%'} marginTop={1}>
              <Grid item xs={12}>
                {renderAssociationSection('Inquilino', 'inquilino', selectedInquilino, setSelectedInquilino, 'Asignar')}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
      {/* Columna Derecha: Habitantes */}
      <Grid item xs={12} md={6} padding={0}>
        <Box border={1} borderColor="lightgray" borderRadius={1} padding={0} marginTop={0}>
          {renderAssociationSection('Habitante', 'habitante', selectedHabitante, setSelectedHabitante)}
        </Box>
      </Grid>
    </Grid>
  );
};

export default PersonaUnidadForm;
