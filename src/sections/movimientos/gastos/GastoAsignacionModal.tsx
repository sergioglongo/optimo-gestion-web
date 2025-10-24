import { useEffect, useState } from 'react';
import {
  // MUI components
  Box,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  CircularProgress,
  Autocomplete,
  TextField
} from '@mui/material';

// project import
import Modal from 'components/Modal/ModalBasico';
import useConsorcio from 'hooks/useConsorcio';
import { Gasto } from 'types/gasto';
import { unidadFuncional } from 'types/unidadFuncional';
import { useGetUnidadesFuncionals } from 'services/api/unidadFuncionalapi';
import { useGetGastoAsignaciones, useAssignGastoToUnidades } from 'services/api/gastosapi';

// assets
import { DeleteOutlined } from '@ant-design/icons';

interface GastoAsignacionModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  gasto: Gasto | null;
}

const GastoAsignacionModal = ({ open, modalToggler, gasto }: GastoAsignacionModalProps) => {
  const { selectedConsorcio } = useConsorcio();
  const [unidadParaAgregar, setUnidadParaAgregar] = useState<unidadFuncional | null>(null);
  const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState<unidadFuncional[]>([]);

  // ==============================|| API & STATE ||============================== //
  const { data: allUnidades = [], isLoading: isLoadingUnidades } = useGetUnidadesFuncionals(
    { consorcio_id: selectedConsorcio?.id || 0 },
    {
      enabled: !!selectedConsorcio?.id && open && !!gasto
    }
  );

  const { data: existingAssignments = [], isLoading: isLoadingAssignments } = useGetGastoAsignaciones(
    { gasto_id: gasto?.id },
    { enabled: !!gasto?.id && open }
  );

  const assignBulkMutation = useAssignGastoToUnidades();

  useEffect(() => {
    if (open) {
      if (existingAssignments.length > 0 && allUnidades.length > 0) {
        const asignadas = allUnidades.filter((u) => existingAssignments.some((a) => a.unidad_funcional_id === u.id));
        setUnidadesSeleccionadas(asignadas);
      } else {
        setUnidadesSeleccionadas([]);
      }
    }
  }, [existingAssignments, allUnidades, open]); // Se quita unidadesSeleccionadas para evitar el loop

  // ==============================|| HANDLERS ||============================== //

  const handleAddUnidad = () => {
    if (unidadParaAgregar && !unidadesSeleccionadas.some((u) => u.id === unidadParaAgregar.id)) {
      setUnidadesSeleccionadas([...unidadesSeleccionadas, unidadParaAgregar]);
      setUnidadParaAgregar(null);
    }
  };

  const handleRemoveUnidad = (unidadId: number) => {
    setUnidadesSeleccionadas(unidadesSeleccionadas.filter((u) => u.id !== unidadId));
  };

  const handleConfirm = async () => {
    if (!gasto || !selectedConsorcio) return;

    const unidadesIds = unidadesSeleccionadas.map((u) => u.id);

    await assignBulkMutation.mutateAsync(
      {
        gasto_id: gasto.id,
        consorcio_id: selectedConsorcio.id,
        unidades_ids: unidadesIds
      },
      {
        onSuccess: () => {
          modalToggler(false);
        },
        onError: (error) => {
          console.error('Error al asignar el gasto a las unidades:', error);
        }
      }
    );
  };

  const getUnidadLabel = (unidad: unidadFuncional) => {
    const personName = unidad.inquilino
      ? ` - ${unidad.inquilino.nombre} ${unidad.inquilino.apellido}`
      : unidad.propietario
      ? ` - ${unidad.propietario.nombre} ${unidad.propietario.apellido}`
      : '';
    return `${unidad.etiqueta}${personName}`;
  };

  // ==============================|| RENDER ||============================== //

  const availableUnidades = allUnidades.filter((u) => !unidadesSeleccionadas.some((selected) => selected.id === u.id));

  const isLoading = isLoadingUnidades || isLoadingAssignments || assignBulkMutation.isLoading;

  return (
    <Modal
      open={open}
      onClose={() => modalToggler(false)}
      title={`Asignar Gasto a Unidades`}
      confirmButtonLabel="Asignar"
      onConfirm={handleConfirm}
      isSubmitting={assignBulkMutation.isLoading}
      cancelButtonLabel="Cancelar"
      maxWidth="xs"
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        gasto && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 1, mb: 2, backgroundColor: 'primary.lighter', textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom color="primary.darker" mb="0">
                {gasto.descripcion}
              </Typography>
              <Typography variant="h3" color="primary.dark">
                ${Number(gasto.monto).toLocaleString('es-AR')}
              </Typography>
            </Box>

            <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs>
                <Autocomplete
                  id="unidad-funcional-autocomplete"
                  options={availableUnidades}
                  getOptionLabel={getUnidadLabel}
                  value={unidadParaAgregar}
                  onChange={(event, newValue) => {
                    setUnidadParaAgregar(newValue);
                  }}
                  loading={isLoadingUnidades}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar Unidad Funcional"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingUnidades ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs="auto">
                <Button variant="contained" onClick={handleAddUnidad} disabled={!unidadParaAgregar}>
                  Añadir
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Unidades a asignar ({unidadesSeleccionadas.length})
            </Typography>
            <List sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1, minHeight: 52, p: 0, mb: 2 }}>
              {unidadesSeleccionadas.length > 0 ? (
                unidadesSeleccionadas.map((unidad) => (
                  <ListItem key={unidad.id} divider sx={{ backgroundColor: 'warning.lighter' }}>
                    <ListItemText primary={getUnidadLabel(unidad)} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveUnidad(unidad.id)} color="error">
                        <DeleteOutlined />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Aún no hay unidades seleccionadas." sx={{ textAlign: 'center', color: 'text.secondary' }} />
                </ListItem>
              )}
            </List>
          </Box>
        )
      )}
    </Modal>
  );
};

export default GastoAsignacionModal;
