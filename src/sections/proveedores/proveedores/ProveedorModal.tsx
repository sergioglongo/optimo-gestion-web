import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project import
import { Proveedor } from 'types/proveedor';
import Modal from 'components/Modal/ModalBasico';
import ProveedorForm from './ProveedorForm';
import { useCreateProveedor, useUpdateProveedor } from 'services/api/proveedoresapi';
import useConsorcio from 'hooks/useConsorcio';

type ProveedorCreateData = Omit<Proveedor, 'id'>;

// ==============================|| PROVEEDOR MODAL ||============================== //

interface ProveedorModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  proveedor: Proveedor | null;
}

const ProveedorModal = ({ open, modalToggler, proveedor }: ProveedorModalProps) => {
  const isCreating = !proveedor;
  const { selectedConsorcio } = useConsorcio();

  const createProveedorMutation = useCreateProveedor();
  const updateProveedorMutation = useUpdateProveedor();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    servicio: Yup.string().max(255).required('El servicio es requerido'),
    identificacion: Yup.string().nullable(),
    CBU: Yup.string().nullable()
  });

  const formik = useFormik<ProveedorCreateData>({
    initialValues: {
      nombre: proveedor?.nombre || '',
      servicio: proveedor?.servicio || '',
      consorcio_id: selectedConsorcio?.id || 0,
      tipo_identificacion: proveedor?.tipo_identificacion || 'cuit',
      identificacion: proveedor?.identificacion || null,
      CBU: proveedor?.CBU || null
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!selectedConsorcio?.id) {
          return;
        }

        if (isCreating) {
          await createProveedorMutation.mutateAsync({ proveedorData: values, consorcio_id: selectedConsorcio.id });
        } else {
          await updateProveedorMutation.mutateAsync({ proveedorId: proveedor!.id, proveedorData: values });
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

  return (
    <Modal
      open={open}
      onClose={() => {
        modalToggler(false);
        formik.resetForm();
      }}
      title={isCreating ? 'Nuevo Proveedor' : 'Editar Proveedor'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <ProveedorForm proveedor={proveedor} open={open} />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default ProveedorModal;
