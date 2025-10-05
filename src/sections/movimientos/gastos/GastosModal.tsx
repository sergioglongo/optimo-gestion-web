import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

// project import
import { Gasto } from 'types/gasto';
import Modal from 'components/Modal/ModalBasico';
import GastoForm from './GastoForm';
import { useCreateGasto, useUpdateGasto } from 'services/api/gastosapi';
import { RootState } from 'store';

// ==============================|| GASTO MODAL ||============================== //

interface GastosModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  gasto: Gasto | null;
}

const GastosModal = ({ open, modalToggler, gasto }: GastosModalProps) => {
  const isCreating = !gasto;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);

  const createGastoMutation = useCreateGasto();
  const updateGastoMutation = useUpdateGasto();

  const getNextMonthFirstDay = () => {
    const date = new Date();
    // Set to the first day of the current month to avoid issues with months with different numbers of days
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  };

  const validationSchema = Yup.object().shape({
    descripcion: Yup.string().max(255).required('La descripción es requerida'),
    monto: Yup.number().min(0, 'El monto no puede ser negativo').required('El monto es requerido'),
    fecha: Yup.date().required('La fecha es requerida'),
    rubro_gasto_id: Yup.number().required('El rubro es requerido'),
    proveedor_id: Yup.number().nullable(),
    tipo_gasto: Yup.string().oneOf(['ordinario', 'extraordinario']).required('El tipo es requerido'),
    estado: Yup.string().oneOf(['impago', 'parcial', 'pagado']).required('El estado es requerido'),
    periodo_aplica: Yup.date().nullable()
  });

  const formik = useFormik<Gasto>({
    // Changed type to Gasto
    initialValues: {
      consorcio_id: selectedConsorcio?.id || 0,
      descripcion: gasto?.descripcion || '',
      monto: gasto?.monto || 0,
      fecha: gasto?.fecha ? gasto.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
      rubro_gasto_id: gasto?.rubro_gasto_id || 0,
      proveedor_id: gasto?.proveedor_id || null,
      tipo_gasto: gasto?.tipo_gasto || 'ordinario',
      estado: gasto?.estado || 'impago',
      periodo_aplica: gasto?.periodo_aplica ? gasto.periodo_aplica.split('T')[0] : getNextMonthFirstDay(),
      fecha_carga: new Date().toISOString().split('T')[0],
      id: gasto?.id || 0 // Explicitly include id
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isCreating) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...gastoData } = values; // Omit id for creation
          await createGastoMutation.mutateAsync(gastoData);
        } else {
          await updateGastoMutation.mutateAsync({ gastoId: gasto!.id, gastoData: values });
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
      title={isCreating ? 'Nuevo Gasto' : 'Editar Gasto'}
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
      onConfirm={handleSubmit}
      isSubmitting={isSubmitting || !selectedConsorcio}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <GastoForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default GastosModal;
