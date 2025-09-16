import {
  Grid,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Typography,
  Box,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { useState } from 'react';

// project import
import { Proveedor, ProveedorRubro } from 'types/proveedor';
import { Rubro } from 'types/rubro';
import { useGetRubros } from 'services/api/rubrosapi';
import { useGetProveedorRubros, useCreateProveedorRubro, useDeleteProveedorRubro } from 'services/api/proveedorRubroapi';
import useConsorcio from 'hooks/useConsorcio';

// assets
import { DeleteOutlined } from '@ant-design/icons';

interface ProveedorRubrosFormProps {
  proveedor: Proveedor;
}

const ProveedorRubrosForm = ({ proveedor }: ProveedorRubrosFormProps) => {
  const { selectedConsorcio } = useConsorcio();

  // ==============================|| API & STATE ||============================== //

  const { data: allRubros = [], isLoading: isLoadingRubros } = useGetRubros(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id
  });

  const { data: existingAssociations = [], isLoading: isLoadingAssociations } = useGetProveedorRubros(
    { proveedor_id: proveedor?.id },
    { enabled: !!proveedor?.id }
  );

  const createAssociation = useCreateProveedorRubro();
  const deleteAssociation = useDeleteProveedorRubro();

  const [selectedRubro, setSelectedRubro] = useState<number | ''>('');

  // ==============================|| HANDLERS ||============================== //

  const handleAdd = async () => {
    if (!selectedRubro || !proveedor) return;

    try {
      await createAssociation.mutateAsync({
        proveedor_id: proveedor.id,
        rubro_id: Number(selectedRubro),
        principal: false // Defaulting principal to false
      });
      setSelectedRubro('');
    } catch (error) {
      console.error(`Error al añadir rubro:`, error);
    }
  };

  const handleDelete = async (associationId: number) => {
    try {
      await deleteAssociation.mutateAsync(associationId);
    } catch (error) {
      console.error('Error al eliminar la asociación:', error);
    }
  };

  const getRubroName = (rubro_id: number) => {
    const rubro = allRubros.find((r) => r.id === rubro_id);
    return rubro ? rubro.rubro : `Rubro ID: ${rubro_id}`;
  };

  // ==============================|| RENDER ||============================== //

  const associatedRubroIds = existingAssociations.map((a) => a.rubro_id);
  const availableRubros = allRubros.filter((r) => !associatedRubroIds.includes(r.id));

  if (isLoadingAssociations || isLoadingRubros) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Rubros Asociados
      </Typography>
      <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <FormControl fullWidth size="small">
            <InputLabel>Seleccionar Rubro</InputLabel>
            <Select value={selectedRubro} onChange={(e) => setSelectedRubro(e.target.value as number)} label="Seleccionar Rubro">
              {availableRubros.map((rubro: Rubro) => (
                <MenuItem key={rubro.id} value={rubro.id}>
                  {rubro.rubro}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={handleAdd} disabled={!selectedRubro || createAssociation.isLoading}>
            Añadir
          </Button>
        </Grid>
      </Grid>
      <List dense sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1, minHeight: 52 }}>
        {existingAssociations.map((assoc: ProveedorRubro) => (
          <ListItem key={assoc.id}>
            <ListItemText primary={getRubroName(assoc.rubro_id)} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(assoc.id)} disabled={deleteAssociation.isLoading}>
                <DeleteOutlined />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProveedorRubrosForm;
