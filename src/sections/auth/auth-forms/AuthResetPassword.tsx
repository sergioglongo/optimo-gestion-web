import { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'api/snackbar';

// types
import { SnackbarProps } from 'types/snackbar';
import { useResetPassword } from 'services/api/authApi';
import { StringColorProps } from 'types/password';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { firstCapitalized } from 'utils/textFormat';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const { token } = useParams();
  const intl = useIntl();

  const { mutate, isLoading } = useResetPassword();
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .max(255)
          .required(`${firstCapitalized(intl.formatMessage({ id: 'password-required' }))}`),
        confirmPassword: Yup.string()
          .required(`${firstCapitalized(intl.formatMessage({ id: 'confirm-password-required' }))}`)
          .test(
            'confirmPassword',
            `${firstCapitalized(intl.formatMessage({ id: 'both-password-match' }))}`,
            (confirmPassword, yup) => yup.parent.password === confirmPassword
          )
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        mutate(
          { password: values.password, token: token! },
          {
            onSuccess: () => {
              setStatus({ success: true });
              setSubmitting(false);
              openSnackbar({
                open: true,
                message: `${firstCapitalized(intl.formatMessage({ id: 'password-restablished-successful' }))}`,
                variant: 'alert',
                alert: {
                  color: 'success'
                }
              } as SnackbarProps);

              setTimeout(() => {
                navigate('/login', { replace: true });
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
                <InputLabel htmlFor="password-reset">{firstCapitalized(intl.formatMessage({ id: 'password' }))}</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-reset"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
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
                  placeholder={firstCapitalized(intl.formatMessage({ id: 'enter-password' }))}
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error id="helper-text-password-reset">
                  {errors.password}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password-reset">{firstCapitalized(intl.formatMessage({ id: 'confirm-password' }))}</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  id="confirm-password-reset"
                  type="password"
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={firstCapitalized(intl.formatMessage({ id: 'enter-password' }))}
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirm-password-reset">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                  {firstCapitalized(intl.formatMessage({ id: 'reset-password' }))}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
