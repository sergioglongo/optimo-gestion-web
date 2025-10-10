import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { TipounidadFuncional } from 'types/unidadFuncional';
import Modal from 'components/Modal/ModalBasico';
import TipounidadFuncionalForm from './TipoUnidadFuncionalForm';
import { useCreateTipounidadFuncional, useUpdateTipounidadFuncional } from 'services/api/tipoUnidadFuncionalapi';
import { RootState } from 'store';
// ==============================|| TIPO UNIDAD FUNCIONAL MODAL ||============================== //
interface TiposunidadFuncionalModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  tipo: TipounidadFuncional | null;
}

const TiposunidadFuncionalModal = ({ open, modalToggler, tipo }: TiposunidadFuncionalModalProps) => {
  const isCreating = !tipo;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createTipoMutation = useCreateTipounidadFuncional();
  const updateTipoMutation = useUpdateTipounidadFuncional();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre del tipo es requerido'),
    indice: Yup.number().moreThan(0, 'El índice debe ser mayor que 0').required('El índice es requerido')
  });

  const formik = useFormik<Omit<TipounidadFuncional, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: tipo?.id,
      nombre: tipo?.nombre || '',
      consorcio_id: selectedConsorcio?.id || null,
      indice: tipo?.indice || 0
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
          await createTipoMutation.mutateAsync(dataToCreate);
        } else {
          await updateTipoMutation.mutateAsync({ tipounidadFuncionalId: tipo!.id, tipounidadFuncionalData: finalValues });
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
      title={isCreating ? 'Nuevo Tipo de Unidad' : 'Editar Tipo de Unidad'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <TipounidadFuncionalForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default TiposunidadFuncionalModal;
