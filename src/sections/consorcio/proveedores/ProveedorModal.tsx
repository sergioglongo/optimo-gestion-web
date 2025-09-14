import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Proveedor } from 'types/proveedor';
import Modal from 'components/Modal/ModalBasico';
import ProveedorForm from './ProveedorForm';
import { useCreateProveedor, useUpdateProveedor } from 'services/api/proveedoresapi';
import { RootState } from 'store';

// ==============================|| PROVEEDOR MODAL ||============================== //

interface ProveedorModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  proveedor: Proveedor | null;
}

const ProveedorModal = ({ open, modalToggler, proveedor }: ProveedorModalProps) => {
  const isCreating = !proveedor;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createProveedorMutation = useCreateProveedor();
  const updateProveedorMutation = useUpdateProveedor();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    servicio: Yup.string().max(255).required('El servicio es requerido'),
    tipo_identificacion: Yup.string().oneOf(['documento', 'cuit', 'cuil', 'otro']),
    identificacion: Yup.string().nullable(),
    CBU: Yup.string().nullable()
  });

  const formik = useFormik<Omit<Proveedor, 'id' | 'consorcio_id'> & { id?: number; consorcio_id: number | null }>({
    initialValues: {
      id: proveedor?.id,
      nombre: proveedor?.nombre || '',
      servicio: proveedor?.servicio || '',
      consorcio_id: selectedConsorcio?.id || null,
      tipo_identificacion: proveedor?.tipo_identificacion || 'cuit',
      identificacion: proveedor?.identificacion || null,
      CBU: proveedor?.CBU || null
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!selectedConsorcio?.id) {
          throw new Error('No hay un consorcio seleccionado.');
        }
        const finalValues = { ...values, consorcio_id: selectedConsorcio.id };

        if (isCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...dataToCreate } = finalValues;
          await createProveedorMutation.mutateAsync({ proveedorData: dataToCreate, consorcio_id: selectedConsorcio?.id });
        } else {
          await updateProveedorMutation.mutateAsync({ proveedorId: proveedor!.id, proveedorData: finalValues });
        }
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
      onClose={() => modalToggler(false)}
      title={isCreating ? 'Nuevo Proveedor' : 'Editar Proveedor'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <ProveedorForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default ProveedorModal;
