import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';

// project import
import { TipoUnidadFuncional, unidadFuncional } from 'types/unidadFuncional';
import Modal from 'components/Modal/ModalBasico';
import UnidadFuncionalForm from './UnidadFuncionalForm';
import { useCreateunidadFuncional, useUpdateunidadFuncional } from 'services/api/unidadFuncionalapi';

// assets
import useConsorcio from 'hooks/useConsorcio';

// ==============================|| UNIDAD FUNCIONAL MODAL ||============================== //

interface unidadFuncionalModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  unidadFuncional: unidadFuncional | null;
  tiposunidadFuncional: TipoUnidadFuncional[];
}

const UnidadFuncionalModal = ({ open, modalToggler, unidadFuncional, tiposunidadFuncional }: unidadFuncionalModalProps) => {
  const isCreating = !unidadFuncional;
  const { selectedConsorcio } = useConsorcio();
  const queryClient = useQueryClient();

  const createunidadFuncionalMutation = useCreateunidadFuncional();
  const updateunidadFuncionalMutation = useUpdateunidadFuncional();

  const validationSchema = Yup.object().shape({
    etiqueta: Yup.string().max(255).nullable(),
    tipo_unidad_funcional_id: Yup.number().required('El tipo es requerido'),
    identificador1: Yup.string().nullable(),
    identificador2: Yup.string().nullable(),
    identificador3: Yup.string().nullable(),
    liquidar_a: Yup.string().oneOf(['propietario', 'inquilino', 'ambos']).required('El campo liquidar a es requerido'),
    prorrateo: Yup.number().min(0).required('El prorrateo es requerido'),
    prorrateo_automatico: Yup.boolean().required('El campo prorrateo automático es requerido'),
    Intereses: Yup.boolean().required('El campo Intereses es requerido'),
    alquilada: Yup.boolean().required('El campo alquilada es requerido'),
    notas: Yup.string().nullable(),
    cuenta_id: Yup.number().nullable()
  });

  const formik = useFormik<Omit<unidadFuncional, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: unidadFuncional?.id,
      etiqueta: unidadFuncional?.etiqueta || '',
      tipo_unidad_funcional_id: unidadFuncional?.tipo_unidad_funcional_id || null,
      identificador1: unidadFuncional?.identificador1 || '',
      identificador2: unidadFuncional?.identificador2 || '',
      identificador3: unidadFuncional?.identificador3 || '',
      liquidar_a: unidadFuncional?.liquidar_a || 'propietario',
      prorrateo: unidadFuncional?.prorrateo || 0,
      prorrateo_automatico: unidadFuncional?.prorrateo_automatico ?? true,
      Intereses: unidadFuncional?.Intereses || true,
      alquilada: unidadFuncional?.alquilada || false,
      notas: unidadFuncional?.notas || '',
      cuenta_id: unidadFuncional?.cuenta_id || null,
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
          await createunidadFuncionalMutation.mutateAsync({ unidadFuncionalData: dataToCreate, consorcio_id: selectedConsorcio?.id });
        } else {
          await updateunidadFuncionalMutation.mutateAsync({ unidadFuncionalId: unidadFuncional!.id, unidadFuncionalData: finalValues });
        }
        queryClient.invalidateQueries({ queryKey: ['unidadesFuncionals'] });
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
      title={isCreating ? 'Nueva Unidad Funcional' : 'Editar Unidad Funcional'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <UnidadFuncionalForm tiposunidadFuncional={tiposunidadFuncional} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default UnidadFuncionalModal;
