import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useIntl } from 'react-intl';

// project import
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';

// types
import { useForgotPassword } from 'services/api/authApi';
import { SnackbarProps } from 'types/snackbar';
import firstCapitalized from 'utils/textFormat';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const intl = useIntl();

  const { mutate, isLoading } = useForgotPassword();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          mutate(
            { email: values.email },
            {
              onSuccess: (data) => {
                setStatus({ success: true });
                setSubmitting(false);
                openSnackbar({
                  open: true,
                  message: 'Se ha enviado un correo para reestablecer la contraseña.',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  }
                } as SnackbarProps);
                setTimeout(() => {
                  navigate('/auth/check-mail', { replace: true });
                }, 1500);
              },
              onError: (err: any) => {
                if (scriptedRef.current) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }
            }
          );
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">{firstCapitalized(intl.formatMessage({ id: 'email-address' }))}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={firstCapitalized(intl.formatMessage({ id: 'type-email-address' }))}
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-forgot">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">{intl.formatMessage({ id: 'do-not-forgot-to-check-spam-box' })}</Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {intl.formatMessage({ id: 'send-password-reset-email' })}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
