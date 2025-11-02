import { Form, FormikProvider, useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

// project import
import { Persona } from 'types/persona';
import Modal from 'components/Modal/ModalBasico';
import PersonaForm from './PersonaForm'; // Assuming PersonaForm is adapted for these changes
import ConfirmationDialog from 'components/Modal/ConfirmationDialog';
import { useCreatePersona, useUpdatePersona, useGetPersonas } from 'services/api/personasapi';
import { RootState } from 'store';

// ==============================|| PERSONA MODAL ||============================== //

interface PersonasModalProps {
  open: boolean;
  modalToggler: (open: boolean) => void;
  persona: Persona | null;
}

const PersonasModal = ({ open, modalToggler, persona }: PersonasModalProps) => {
  const isCreating = !persona;
  const { selectedConsorcio } = useSelector((state: RootState) => state.consorcio);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data: allPersonas = [] } = useGetPersonas(selectedConsorcio?.id || 0, {
    enabled: !!selectedConsorcio?.id && open
  });

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [formValuesToSubmit, setFormValuesToSubmit] = useState<Persona | null>(null);
  const [confirmationContent, setConfirmationContent] = useState('');

  const createPersonaMutation = useCreatePersona();
  const updatePersonaMutation = useUpdatePersona();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre es requerido'),
    apellido: Yup.string()
      .max(255)
      .when('tipo_persona', {
        is: 'persona fisica',
        then: (schema) => schema.required('El apellido es requerido'),
        otherwise: (schema) => schema.nullable()
      }),
    tipo_persona: Yup.string().oneOf(['persona fisica', 'persona juridica']).required('El tipo es requerido'),
    tipo_identificacion: Yup.string().nullable(),
    identificacion: Yup.string().nullable().max(50, 'La identificación es muy larga'),
    Domicilio: Yup.object().shape({
      direccion: Yup.string().max(255, 'La dirección es muy larga').nullable(), //
      provincia_id: Yup.string().nullable(),
      localidad_id: Yup.string().nullable()
    }),
    telefono: Yup.string().nullable(),
    email: Yup.string().email('Debe ser un email válido').nullable()
  });

  const initialValues: Persona = {
    id: persona?.id,
    nombre: persona?.nombre || '',
    apellido: persona?.apellido || '',
    tipo_persona: persona?.tipo_persona || 'persona fisica',
    consorcio_id: persona?.consorcio_id || selectedConsorcio?.id || 0,
    tipo_identificacion: persona?.tipo_identificacion || 'documento',
    identificacion: persona?.identificacion || '',
    Domicilio: isCreating
      ? {
          // id: 0, // No se envía el id al crear un nuevo domicilio
          direccion: selectedConsorcio?.Domicilio?.direccion || null,
          provincia_id: selectedConsorcio?.Domicilio?.provincia_id || null,
          localidad_id: selectedConsorcio?.Domicilio?.localidad_id || null
        }
      : persona?.Domicilio || null,
    telefono: persona?.telefono || '',
    email: persona?.email || '',
    activa: persona?.activa ?? true
  };

  const proceedWithSubmit = async (values: Persona, { setSubmitting, resetForm }: FormikHelpers<Persona>) => {
    try {
      if (!selectedConsorcio?.id) {
        throw new Error('No hay un consorcio seleccionado.');
      }

      if (isCreating) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...personaData } = values;
        const finalPersonaData = { ...personaData, consorcio_id: selectedConsorcio.id, activa: personaData.activa ?? true };
        await createPersonaMutation.mutateAsync({ personaData: finalPersonaData });
      } else {
        const personaData: Partial<Persona> = { ...values, consorcio_id: selectedConsorcio.id };
        if (!personaData.id) throw new Error('El ID de la persona es requerido para actualizar.');
        await updatePersonaMutation.mutateAsync({ personausuario: personaData });
      }
      queryClient.invalidateQueries({ queryKey: ['personas'] });
      resetForm();
      modalToggler(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<Persona>({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, formikHelpers) => {
      try {
        if (!selectedConsorcio?.id) {
          throw new Error('No hay un consorcio seleccionado.');
        }

        // --- 1. Verificación de duplicados por Nombre y Apellido ---
        const trimmedNombre = values.nombre.trim().toLowerCase();
        const trimmedApellido = values.apellido ? values.apellido.trim().toLowerCase() : '';

        const nameDuplicate = allPersonas.find(
          (p) =>
            p.nombre.trim().toLowerCase() === trimmedNombre &&
            (p.apellido || '').trim().toLowerCase() === trimmedApellido &&
            (isCreating || p.id !== values.id) // Excluir la persona actual en modo edición
        );

        if (nameDuplicate) {
          setConfirmationContent('Ya existe una persona con el mismo nombre y apellido. ¿Desea continuar de todas formas?');
          setFormValuesToSubmit(values);
          setConfirmDialogOpen(true);
          formikHelpers.setSubmitting(false);
          return; // Detener la ejecución
        }

        // --- 2. Verificación de duplicados por Identificación (solo si no hay duplicado de nombre) ---
        const trimmedIdentificacion = values.identificacion ? values.identificacion.trim() : '';
        if (values.tipo_identificacion && trimmedIdentificacion) {
          const idDuplicate = allPersonas.find(
            (p) =>
              p.tipo_identificacion === values.tipo_identificacion &&
              p.identificacion?.trim() === trimmedIdentificacion &&
              (isCreating || p.id !== values.id)
          );

          if (idDuplicate) {
            setConfirmationContent(
              `La identificación ${values.tipo_identificacion}: ${trimmedIdentificacion} ya está asignada a ${idDuplicate.nombre} ${idDuplicate.apellido}. ¿Desea continuar de todas formas?`
            );
            setFormValuesToSubmit(values);
            setConfirmDialogOpen(true);
            formikHelpers.setSubmitting(false);
            return; // Detener la ejecución
          }
        }

        // Si no hay duplicados, proceder con el envío
        await proceedWithSubmit(values, formikHelpers);
      } catch (error) {
        console.error(error);
        formikHelpers.setSubmitting(false);
      }
    }
  });

  const { handleSubmit, isSubmitting, ...formikRest } = formik;

  const handleConfirmDuplicate = async () => {
    if (formValuesToSubmit) {
      // Reconstruimos las 'formikHelpers' para pasarlas a la función de envío
      const formikHelpers: FormikHelpers<Persona> = {
        ...formikRest,
        setSubmitting: formik.setSubmitting,
        resetForm: formik.resetForm
      };
      await proceedWithSubmit(formValuesToSubmit, formikHelpers);
    }
    setConfirmDialogOpen(false);
    setFormValuesToSubmit(null);
    setConfirmationContent('');
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          modalToggler(false);
          formik.resetForm();
        }}
        title={isCreating ? 'Nueva Persona' : 'Editar Persona'}
        cancelButtonLabel="Cancelar"
        confirmButtonLabel={isCreating ? 'Agregar' : 'Guardar'}
        onConfirm={handleSubmit}
        isSubmitting={isSubmitting || !selectedConsorcio}
      >
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate>
            <PersonaForm />
          </Form>
        </FormikProvider>
      </Modal>
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDuplicate}
        title="Confirmar Creación"
        content={confirmationContent}
        confirmText="continue"
        confirmColor="warning"
        titleBgColor={theme.palette.warning.main}
        titleColor={theme.palette.primary.contrastText}
        cancelColor="error"
        maxWidth="xs"
      />
    </>
  );
};

export default PersonasModal;
