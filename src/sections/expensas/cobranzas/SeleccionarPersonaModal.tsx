import { useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import useConsorcio from 'hooks/useConsorcio';
import { useGetPersonas } from 'services/api/personasapi';
import { Persona } from 'types/persona';

interface SeleccionarPersonaModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (persona: Persona) => void;
  excludedIds?: number[];
}

const SeleccionarPersonaModal = ({ open, onClose, onSelect, excludedIds = [] }: SeleccionarPersonaModalProps) => {
  const { selectedConsorcio } = useConsorcio();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const { data: allPersonas = [], isLoading: isLoadingPersonas } = useGetPersonas(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open
  });

  const availablePersonas = allPersonas.filter((p) => p.id !== undefined && !excludedIds.includes(p.id));

  const handleSelect = () => {
    if (selectedPersona) {
      onSelect(selectedPersona);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Seleccionar Persona</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Autocomplete
            options={availablePersonas}
            getOptionLabel={(option) => `${option.apellido} ${option.nombre} (${option.identificacion})`}
            value={selectedPersona}
            onChange={(event, newValue) => {
              setSelectedPersona(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar persona en el consorcio"
                disabled={isLoadingPersonas}
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
            noOptionsText="No hay personas disponibles"
            disabled={isLoadingPersonas}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSelect} variant="contained" disabled={!selectedPersona}>
          Seleccionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeleccionarPersonaModal;
