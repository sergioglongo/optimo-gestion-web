import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Rubro } from 'types/rubro';
import Modal from 'components/Modal/ModalBasico';
import RubroForm from './RubroForm';
import { useCreateRubro, useUpdateRubro } from 'services/api/rubrosapi';
import { RootState } from 'store';
// ==============================|| RUBRO MODAL ||============================== //
interface RubrosModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  rubro: Rubro | null;
}

const RubrosModal = ({ open, modalToggler, rubro }: RubrosModalProps) => {
  const isCreating = !rubro;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createRubroMutation = useCreateRubro();
  const updateRubroMutation = useUpdateRubro();

  const validationSchema = Yup.object().shape({
    rubro: Yup.string().max(255).required('El nombre del rubro es requerido'),
    orden: Yup.number()
      .integer('El orden debe ser un número entero')
      .moreThan(0, 'El orden debe ser mayor que 0')
      .required('El orden es requerido')
  });

  const formik = useFormik<Omit<Rubro, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: rubro?.id,
      rubro: rubro?.rubro || '',
      consorcio_id: selectedConsorcio?.id || null,
      orden: rubro?.orden || 0
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
          await createRubroMutation.mutateAsync({ rubroData: dataToCreate, consorcio_id: selectedConsorcio?.id });
        } else {
          await updateRubroMutation.mutateAsync({ rubroId: rubro!.id, rubroData: finalValues });
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
        formik.resetForm();
      }}
      title={isCreating ? 'Nuevo Rubro' : 'Editar Rubro'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <RubroForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default RubrosModal;
