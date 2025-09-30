import { useState } from 'react';
import {
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
  TextField,
  Divider
} from '@mui/material';
// import { useTheme } from '@mui/material/styles';

// project import
import Modal from 'components/Modal/ModalBasico';
import useConsorcio from 'hooks/useConsorcio';
import { Gasto, GastoAsignacion } from 'types/gasto';
import { UnidadOperativa } from 'types/unidadOperativa';
import { useGetUnidadesOperativas, useGetUnidadOperativa } from 'services/api/unidadOperativaapi';
import { useGetGastoAsignaciones, useCreateGastoAsignacion, useDeleteGastoAsignacion } from 'services/api/gastosapi'; // Assuming these are in gastosapi.ts

// assets
import { DeleteOutlined } from '@ant-design/icons';

interface GastoAsignacionModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  gasto: Gasto | null;
}

interface AsignacionListItemProps {
  asignacion: GastoAsignacion;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const AsignacionListItem = ({ asignacion, onDelete, isDeleting }: AsignacionListItemProps) => {
  const { data: unidad, isLoading } = useGetUnidadOperativa(asignacion.unidad_operativa_id, {
    enabled: !!asignacion.unidad_operativa_id
  });

  const getLabel = () => {
    if (isLoading) return <CircularProgress size={20} />;
    if (!unidad) return `Unidad ID: ${asignacion.unidad_operativa_id}`;

    let personName = '';
    if (unidad.inquilino) {
      personName = ` - ${unidad.inquilino.nombre} ${unidad.inquilino.apellido}`;
    } else if (unidad.propietario) {
      personName = ` - ${unidad.propietario.nombre} ${unidad.propietario.apellido}`;
    }

    return `${unidad.etiqueta}${personName}`;
  };

  return (
    <ListItem divider>
      <ListItemText primary={getLabel()} primaryTypographyProps={{ variant: 'h3', textAlign: 'center', color: 'textSecondary' }} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(asignacion.id)} disabled={isDeleting}>
          <DeleteOutlined />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const GastoAsignacionModal = ({ open, modalToggler, gasto }: GastoAsignacionModalProps) => {
  //   const theme = useTheme();
  const { selectedConsorcio } = useConsorcio();
  const [selectedUnidad, setSelectedUnidad] = useState<UnidadOperativa | null>(null);

  // ==============================|| API & STATE ||============================== //
  const { data: allUnidades = [], isLoading: isLoadingUnidades } = useGetUnidadesOperativas(
    { consorcio_id: selectedConsorcio?.id || 0 },
    {
      enabled: !!selectedConsorcio?.id && open && !!gasto
    }
  );

  const { data: existingAssignments = [], isLoading: isLoadingAssignments } = useGetGastoAsignaciones(
    { gasto_id: gasto?.id },
    { enabled: !!gasto?.id && open }
  );

  const createAssignment = useCreateGastoAsignacion();
  const deleteAssignment = useDeleteGastoAsignacion();

  // ==============================|| HANDLERS ||============================== //

  const handleAdd = async () => {
    if (!selectedUnidad || !gasto || !selectedConsorcio) return;

    try {
      await createAssignment.mutateAsync({
        gasto_id: gasto.id,
        consorcio_id: selectedConsorcio.id,
        unidad_operativa_id: selectedUnidad.id
      });
      setSelectedUnidad(null); // Reset autocomplete
    } catch (error) {
      console.error('Error al asignar la unidad:', error);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    try {
      await deleteAssignment.mutateAsync(assignmentId);
    } catch (error) {
      console.error('Error al eliminar la asignación:', error);
    }
  };

  const getUnidadLabelForAutocomplete = (unidad_operativa_id: number) => {
    const unidad = allUnidades.find((u) => u.id === unidad_operativa_id);
    if (!unidad) return `Unidad ID: ${unidad_operativa_id}`;
    // The 'propietario' object might not be fully populated in the 'allUnidades' list
    const propietario = unidad.propietario ? ` - ${unidad.propietario.nombre} ${unidad.propietario.apellido}` : '';
    return `${unidad.etiqueta}${propietario}`;
  };

  // ==============================|| RENDER ||============================== //

  const assignedUnidadIds = existingAssignments.map((a) => a.unidad_operativa_id);
  const availableUnidades = allUnidades.filter((u) => !assignedUnidadIds.includes(u.id));

  const isLoading = isLoadingUnidades || isLoadingAssignments;

  return (
    <Modal
      open={open}
      onClose={() => modalToggler(false)}
      title={`Asignar Gasto a unidad`}
      confirmButtonLabel="Cerrar"
      onConfirm={() => modalToggler(false)}
      maxWidth="xs"
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        gasto && (
          <Box sx={{ mt: 2 }}>
            {/* <Box sx={{ p: 2, borderRadius: 1, mb: 0, border: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}> */}
            <Box
              border={1}
              borderColor="lightgray"
              borderRadius={1}
              padding={0}
              width={'100%'}
              textAlign={'center'}
              sx={{ padding: 2, backgroundColor: 'primary.main' }}
            >
              <Typography variant="h4" gutterBottom color={'white'} mb="0">
                {gasto.descripcion}
              </Typography>
              <Typography variant="h4" color="secondary.main">
                {new Date(gasto.fecha).toLocaleDateString()}
              </Typography>
              <Typography variant="h4" color="white">
                ${Number(gasto.monto).toLocaleString('es-AR')}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom textAlign={'center'}>
              Elije la unidad para asignar el gasto
            </Typography>
            {existingAssignments.length === 0 ? (
              <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs>
                  <Autocomplete
                    id="unidad-operativa-autocomplete"
                    options={availableUnidades}
                    getOptionLabel={(option) => getUnidadLabelForAutocomplete(option.id)}
                    value={selectedUnidad}
                    onChange={(event, newValue) => {
                      setSelectedUnidad(newValue);
                    }}
                    loading={isLoadingUnidades}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Buscar Unidad Operativa"
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
                  <Button variant="contained" onClick={handleAdd} disabled={!selectedUnidad || createAssignment.isLoading}>
                    Añadir
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <List sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1, minHeight: 52, p: 0, mb: 2 }}>
                {existingAssignments.map((asignacion: GastoAsignacion) => (
                  <AsignacionListItem
                    key={asignacion.id}
                    asignacion={asignacion}
                    onDelete={handleDelete}
                    isDeleting={deleteAssignment.isLoading}
                  />
                ))}
              </List>
            )}
          </Box>
        )
      )}
    </Modal>
  );
};

export default GastoAsignacionModal;
