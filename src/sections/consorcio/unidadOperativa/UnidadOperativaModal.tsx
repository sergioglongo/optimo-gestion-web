import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

// material-ui
import { Box, Collapse, Divider, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// project import
import { TipoUnidadOperativa, UnidadOperativa } from 'types/unidadOperativa';
import Modal from 'components/Modal/ModalBasico';
import UnidadOperativaForm from './UnidadOperativaForm';
import { useCreateUnidadOperativa, useUpdateUnidadOperativa } from 'services/api/unidadOperativaapi'; // Assuming new API hooks
import PersonaUnidadForm from './PersonaUnidadForm';

// assets
import { DownOutlined, UpOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import useConsorcio from 'hooks/useConsorcio';

// ==============================|| UNIDAD OPERATIVA MODAL ||============================== //

interface UnidadOperativaModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  unidadOperativa: UnidadOperativa | null;
  tiposUnidadOperativa: TipoUnidadOperativa[];
}

const UnidadOperativaModal = ({ open, modalToggler, unidadOperativa, tiposUnidadOperativa }: UnidadOperativaModalProps) => {
  const isCreating = !unidadOperativa;
  const { selectedConsorcio } = useConsorcio();
  const [isPersonaFormOpen, setPersonaFormOpen] = useState(false);

  const createUnidadOperativaMutation = useCreateUnidadOperativa();
  const updateUnidadOperativaMutation = useUpdateUnidadOperativa();

  const validationSchema = Yup.object().shape({
    etiqueta: Yup.string().max(255).nullable(),
    tipo_unidad_operativa_id: Yup.number().required('El tipo es requerido'),
    identificador1: Yup.string().nullable(),
    identificador2: Yup.string().nullable(),
    identificador3: Yup.string().nullable(),
    liquidar_a: Yup.string().oneOf(['propietario', 'inquilino', 'ambos']).required('El campo liquidar a es requerido'),
    prorrateo: Yup.number().min(0).required('El prorrateo es requerido'),
    prorrateo_automatico: Yup.boolean().required('El campo prorrateo automático es requerido'),
    Intereses: Yup.boolean().required('El campo Intereses es requerido'),
    alquilada: Yup.boolean().required('El campo alquilada es requerido'),
    notas: Yup.string().nullable()
  });

  const formik = useFormik<Omit<UnidadOperativa, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: unidadOperativa?.id,
      etiqueta: unidadOperativa?.etiqueta || null,
      tipo_unidad_operativa_id: unidadOperativa?.tipo_unidad_operativa_id || null,
      identificador1: unidadOperativa?.identificador1 || null,
      identificador2: unidadOperativa?.identificador2 || null,
      identificador3: unidadOperativa?.identificador3 || null,
      liquidar_a: unidadOperativa?.liquidar_a || 'propietario',
      prorrateo: unidadOperativa?.prorrateo || 0,
      prorrateo_automatico: unidadOperativa?.prorrateo_automatico ?? true,
      Intereses: unidadOperativa?.Intereses || true,
      alquilada: unidadOperativa?.alquilada || false,
      notas: unidadOperativa?.notas || null,
      consorcio_id: selectedConsorcio?.id || null
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!selectedConsorcio?.id) {
          throw new Error('No hay un consorcio seleccionado.');
        }
        const finalValues = { ...values, consorcio_id: selectedConsorcio.id };

        if (isCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...dataToCreate } = finalValues;
          await createUnidadOperativaMutation.mutateAsync({ unidadOperativaData: dataToCreate, consorcio_id: selectedConsorcio?.id });
        } else {
          await updateUnidadOperativaMutation.mutateAsync({ unidadOperativaId: unidadOperativa!.id, unidadOperativaData: finalValues });
        }
        resetForm();
        modalToggler(false);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, isSubmitting } = formik;

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm(); // Reset Formik state on close
      }}
      title={isCreating ? 'Nueva Unidad Operativa' : 'Editar Unidad Operativa'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <UnidadOperativaForm tiposUnidadOperativa={tiposUnidadOperativa} />
        </Form>
      </FormikProvider>
      {unidadOperativa && (
        <>
          <Divider sx={{ my: 2 }} />
          <ListItemButton
            onClick={() => setPersonaFormOpen(!isPersonaFormOpen)}
            sx={{ bgcolor: 'primary.lighter', '&:hover': { bgcolor: 'primary.light' }, borderRadius: 1 }}
          >
            <ListItemIcon>
              <UsergroupAddOutlined />
            </ListItemIcon>
            <ListItemText primary="Asociar Personas" />
            {isPersonaFormOpen ? <UpOutlined /> : <DownOutlined />}
          </ListItemButton>
          <Collapse in={isPersonaFormOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 2 }}>
              <PersonaUnidadForm unidadOperativa={unidadOperativa} open={isPersonaFormOpen} />
            </Box>
          </Collapse>
        </>
      )}
    </Modal>
  );
};

export default UnidadOperativaModal;
