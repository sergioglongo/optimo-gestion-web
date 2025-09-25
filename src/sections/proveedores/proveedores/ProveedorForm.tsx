import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Select,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  ListItemSecondaryAction
  // Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormikContext, getIn } from 'formik';
import { useState } from 'react';

// project import
import { Proveedor, TipoIdentificacionProveedor } from 'types/proveedor';
import { Rubro } from 'types/rubro';
import { Cuenta } from 'types/cuenta';
import { useGetRubros } from 'services/api/rubrosapi';
import { useGetProveedorRubros, useCreateProveedorRubro, useDeleteProveedorRubro } from 'services/api/proveedorRubroapi';
import useConsorcio from 'hooks/useConsorcio';

import { useGetCuentas } from 'services/api/cuentasapi';
// assets
import { DeleteOutlined } from '@ant-design/icons';

interface ProveedorFormProps {
  proveedor: Proveedor | null;
  open: boolean;
}

const ProveedorForm = ({ proveedor, open }: ProveedorFormProps) => {
  const theme = useTheme();
  const { errors, touched, getFieldProps, values } = useFormikContext<any>();
  const { selectedConsorcio } = useConsorcio();

  const { data: cuentas = [] } = useGetCuentas(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open
  });

  // --- Lógica de Asociación de Rubros (basada en PersonaUnidadForm) ---

  const { data: allRubros = [] } = useGetRubros(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open && !!proveedor
  });

  const { data: existingAssociations = [] } = useGetProveedorRubros({ proveedor_id: proveedor?.id }, { enabled: !!proveedor?.id && open });

  const createAssociation = useCreateProveedorRubro();
  const deleteAssociation = useDeleteProveedorRubro();

  const [selectedRubro, setSelectedRubro] = useState<number | ''>('');

  const handleAddRubro = async () => {
    if (!selectedRubro || !proveedor) return;
    try {
      await createAssociation.mutateAsync({
        proveedor_id: proveedor.id,
        rubro_id: Number(selectedRubro),
        principal: false // O manejar la lógica de 'principal' si es necesario
      });
      setSelectedRubro('');
    } catch (error) {
      console.error('Error al añadir rubro:', error);
    }
  };

  const handleDeleteRubro = async (associationId: number) => {
    try {
      await deleteAssociation.mutateAsync(associationId);
    } catch (error) {
      console.error('Error al eliminar la asociación del rubro:', error);
    }
  };

  const getRubroName = (rubro_id: number) => {
    const rubro = allRubros.find((r) => r.id === rubro_id);
    return rubro ? rubro.rubro : `Rubro ID: ${rubro_id}`;
  };

  const associatedRubroIds = existingAssociations.map((a) => a.rubro_id);
  const availableRubros = allRubros.filter((r) => !associatedRubroIds.includes(r.id));
  const canAddRubro = existingAssociations.length === 0;

  // --- Fin Lógica de Asociación ---

  return (
    <Grid container spacing={3}>
      {selectedConsorcio && (
        <Grid item xs={12}>
          <Box sx={{ p: 1, borderRadius: 1, textAlign: 'center', color: 'white', backgroundColor: theme.palette.primary.main }}>
            <Typography variant="body1">
              <strong>Consorcio {selectedConsorcio.nombre}</strong>
            </Typography>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre"
          {...getFieldProps('nombre')}
          error={Boolean(getIn(touched, 'nombre') && getIn(errors, 'nombre'))}
          helperText={getIn(touched, 'nombre') && getIn(errors, 'nombre')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Servicio / Descripción"
          {...getFieldProps('servicio')}
          error={Boolean(getIn(touched, 'servicio') && getIn(errors, 'servicio'))}
          helperText={getIn(touched, 'servicio') && getIn(errors, 'servicio')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField select fullWidth label="Tipo de Identificación" {...getFieldProps('tipo_identificacion')}>
          {(['documento', 'cuit', 'cuil', 'otro'] as TipoIdentificacionProveedor[]).map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField fullWidth label="Identificación" {...getFieldProps('identificacion')} value={values.identificacion || ''} />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="CBU / Alias (Opcional)"
          {...getFieldProps('CBU')}
          value={values.CBU || ''}
          InputProps={{ sx: { '.MuiInputBase-input': { py: 1.3 } } }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Cuenta Principal"
          {...getFieldProps('cuenta_id')}
          value={values.cuenta_id || ''}
          InputProps={{ sx: { '.MuiInputBase-input': { py: 2 } } }}
        >
          <MenuItem value="">Sin cuenta principal</MenuItem>
          {cuentas.map((cuenta: Cuenta) => (
            <MenuItem key={cuenta.id} value={cuenta.id}>{`${cuenta.descripcion} (${cuenta.tipo})`}</MenuItem>
          ))}
        </TextField>
      </Grid>
      {proveedor && (
        <Grid item xs={6}>
          {canAddRubro && (
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                <FormControl fullWidth size="small">
                  <InputLabel>Rubro</InputLabel>
                  <Select value={selectedRubro} onChange={(e) => setSelectedRubro(e.target.value as number)} label="Rubro" sx={{ py: 1.2 }}>
                    {availableRubros.map((rubro: Rubro) => (
                      <MenuItem key={rubro.id} value={rubro.id}>
                        {rubro.rubro}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs="auto">
                <Button variant="contained" onClick={handleAddRubro} disabled={!selectedRubro || createAssociation.isLoading}>
                  Añadir
                </Button>
              </Grid>
            </Grid>
          )}
          {existingAssociations.length > 0 && (
            <Box sx={{ position: 'relative', mt: 0 }} width={'100%'}>
              <Typography
                variant="caption"
                component="label"
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: 12,
                  zIndex: 1,
                  px: 0.5,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.secondary
                }}
              >
                Rubro
              </Typography>
              <Box border={1} borderColor="lightgray" borderRadius={1} padding={0} width={'100%'}>
                <List dense>
                  {existingAssociations.map((assoc) => (
                    <ListItem key={assoc.id}>
                      <ListItemText primary={getRubroName(assoc.rubro_id)} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDeleteRubro(assoc.id)} disabled={deleteAssociation.isLoading}>
                          <DeleteOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default ProveedorForm;
