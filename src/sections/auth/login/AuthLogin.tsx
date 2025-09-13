import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSignIn } from 'services/api/authApi';
import { useDispatch } from 'react-redux'; // Added this import

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { setConsorcios } from 'store/slices/consorcio'; // Added this import

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| LOGIN ||============================ //

const AuthLogin = ({ isDemo = false }: { isDemo?: boolean }) => {
  const [checked, setChecked] = React.useState(false);
  const dispatch = useDispatch(); // Added this line

  const { login } = useAuth();
  const scriptedRef = useScriptRef();

  const { mutate, isLoading } = useSignIn();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: 'sergiolongodev@gmail.com',
          password: '1234',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Formato de email inválido').max(255).required('Email es requerido'),
          password: Yup.string().max(255).required('La contraseña es requerida')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          await mutate(
            { email: values.email, password: values.password },
            {
              onSuccess: async (data) => {
                const { token, usuario, consorcios } = data.result; // Added consorcios
                await login(usuario, token);

                // Dispatch consorcios to the store
                if (consorcios) {
                  dispatch(setConsorcios(consorcios));
                }

                if (scriptedRef.current) {
                  setStatus({ success: true });
                  setSubmitting(false);
                }
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
                  <InputLabel htmlFor="email-login">Ingrese el Email</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ingrese el email"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Contraseña</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Ingrese contraseña"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Mantenerme conectado</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to={isDemo ? '/auth/forgot-password' : '/forgot-password'} >
                    restaurar contraseña?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Iniciar
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

export default AuthLogin;
