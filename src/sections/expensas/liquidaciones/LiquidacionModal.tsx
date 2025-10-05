import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';

// project import
import { Liquidacion } from 'types/liquidacion'; // Asumiendo que existe
import Modal from 'components/Modal/ModalBasico';
import LiquidacionForm from './nueva/LiquidacionNuevaPrincipal';
import { useCreateLiquidacion, useUpdateLiquidacion } from 'services/api/liquidacionapi'; // Asumiendo que existen
import useConsorcio from 'hooks/useConsorcio';

// ==============================|| LIQUIDACION MODAL ||============================== //

interface LiquidacionModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  liquidacion: Liquidacion | null;
}

const LiquidacionModal = ({ open, modalToggler, liquidacion }: LiquidacionModalProps) => {
  const isCreating = !liquidacion;
  const { selectedConsorcio } = useConsorcio();

  const createLiquidacionMutation = useCreateLiquidacion();
  const updateLiquidacionMutation = useUpdateLiquidacion();

  const validationSchema = Yup.object().shape({
    periodo: Yup.string().required('El período es requerido'),
    fecha_emision: Yup.date().required('La fecha de emisión es requerida').nullable(),
    primer_vencimiento: Yup.number().required('El día del primer vencimiento es requerido').min(1).max(31).nullable(),
    primer_vencimiento_recargo: Yup.number().required('El recargo es requerido').min(0),
    segundo_vencimiento: Yup.number().min(1).max(31).nullable(),
    segundo_vencimiento_recargo: Yup.number().min(0)
  });

  const formik = useFormik<Omit<Liquidacion, 'saldo'>>({
    // 'id' is now included as optional
    initialValues: {
      periodo: liquidacion?.periodo || '',
      fecha_emision: liquidacion?.fecha_emision || new Date().toISOString().split('T')[0],
      consorcio_id: selectedConsorcio?.id || 0,
      estado: liquidacion?.estado || 'borrador',
      total: liquidacion?.total || 0,
      fecha_cierre: liquidacion?.fecha_cierre || null,
      primer_vencimiento: liquidacion?.primer_vencimiento || null,
      primer_vencimiento_recargo: liquidacion?.primer_vencimiento_recargo || 0,
      segundo_vencimiento: liquidacion?.segundo_vencimiento || null,
      segundo_vencimiento_recargo: liquidacion?.segundo_vencimiento_recargo || 0,
      id: liquidacion?.id || 0 // Explicitly set id, which is number
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!selectedConsorcio?.id) {
          return;
        }

        const dataToSend = { ...values, saldo: values.total }; // Asumiendo que el saldo inicial es el total
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...liquidacionDataForCreate } = dataToSend; // Omit id for creation

        if (isCreating) {
          await createLiquidacionMutation.mutateAsync({ liquidacionData: liquidacionDataForCreate, consorcio_id: values.consorcio_id });
        } else {
          await updateLiquidacionMutation.mutateAsync({ liquidacionId: liquidacion!.id, liquidacionData: dataToSend });
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
      onClose={() => modalToggler(false)}
      title={isCreating ? 'Nueva Liquidación' : 'Editar Liquidación'}
      onConfirm={formik.handleSubmit}
      isSubmitting={formik.isSubmitting}
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate>
          <LiquidacionForm />
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default LiquidacionModal;
