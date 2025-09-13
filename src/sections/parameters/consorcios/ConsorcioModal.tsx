import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project import
import { Consorcio } from 'types/consorcio';

// ==============================|| CONSORCIO MODAL ||============================== //

interface ConsorcioModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  consorcio: Consorcio | null;
}

const ConsorcioModal = ({ open, modalToggler, consorcio }: ConsorcioModalProps) => {
  const isCreating = !consorcio;

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    direccion: Yup.string().max(255).required('La dirección es requerida'),
    tipo: Yup.string().max(50).required('El tipo es requerido')
  });

  const formik = useFormik({
    initialValues: {
      nombre: consorcio?.nombre || '',
      direccion: consorcio?.direccion || '',
      tipo: consorcio?.tipo || ''
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        // Aquí iría la lógica para crear o actualizar el consorcio
        console.log(values);
        setSubmitting(false);
        modalToggler(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={() => modalToggler(false)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{isCreating ? 'Nuevo Consorcio' : 'Editar Consorcio'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  {...getFieldProps('nombre')}
                  error={Boolean(touched.nombre && errors.nombre)}
                  helperText={touched.nombre && errors.nombre}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  {...getFieldProps('direccion')}
                  error={Boolean(touched.direccion && errors.direccion)}
                  helperText={touched.direccion && errors.direccion}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tipo"
                  {...getFieldProps('tipo')}
                  error={Boolean(touched.tipo && errors.tipo)}
                  helperText={touched.tipo && errors.tipo}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => modalToggler(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isCreating ? 'Agregar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default ConsorcioModal;
