import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project import
import { Proveedor, ProveedorSubmitData } from 'types/proveedor';
import Modal from 'components/Modal/ModalBasico';
import ProveedorForm from './ProveedorForm';
import { useCreateProveedor, useUpdateProveedor } from 'services/api/proveedoresapi';
import useConsorcio from 'hooks/useConsorcio';

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
    Rubros: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required('El rubro es requerido')
        })
      )
      .min(1, 'El rubro es requerido'),
    identificacion: Yup.string().nullable().max(50, 'La identificación es muy larga'),
    telefono: Yup.string().nullable().max(50, 'El teléfono es muy largo'),
    email: Yup.string().email('Debe ser un email válido').nullable().max(255),
    CBU: Yup.string().nullable(),
    cuenta_id: Yup.number().nullable(),
    Domicilio: Yup.object().shape({
      direccion: Yup.string().max(255, 'La dirección es muy larga').nullable(),
      localidad: Yup.string().nullable(),
      provincia: Yup.string().nullable()
    })
  });

  const formik = useFormik<Proveedor>({
    initialValues: {
      id: proveedor?.id || 0,
      nombre: proveedor?.nombre || '',
      servicio: proveedor?.servicio || '',
      consorcio_id: selectedConsorcio?.id || 0,
      tipo_identificacion: proveedor?.tipo_identificacion || 'cuit',
      identificacion: proveedor?.identificacion || null,
      Domicilio: isCreating
        ? {
            // id: 0, // No se envía el id al crear un nuevo domicilio
            direccion: '',
            provincia: selectedConsorcio?.Domicilio?.provincia || '',
            localidad: selectedConsorcio?.Domicilio?.localidad || ''
          }
        : proveedor?.Domicilio || null,
      CBU: proveedor?.CBU || null,
      cuenta_id: proveedor?.cuenta_id || null,
      telefono: proveedor?.telefono || null,
      Rubros: proveedor?.Rubros || [],
      email: proveedor?.email || null,
      activo: proveedor?.activo ?? true
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!selectedConsorcio?.id) {
          return;
        }

        const submissionData: ProveedorSubmitData = {
          ...values,
          Rubros: values.Rubros?.map((r) => (typeof r === 'number' ? r : r.id)) || []
        };

        if (isCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          await createProveedorMutation.mutateAsync({ proveedorData: submissionData as any, consorcio_id: values.consorcio_id });
        } else {
          await updateProveedorMutation.mutateAsync({ proveedorId: proveedor!.id, proveedorData: submissionData as any });
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
