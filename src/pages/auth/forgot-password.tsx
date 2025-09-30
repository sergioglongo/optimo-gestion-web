import { Link } from 'react-router-dom';

// third-party
import { useIntl } from 'react-intl';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthForgotPassword from 'sections/auth/auth-forms/AuthForgotPassword';
import { firstCapitalized } from 'utils/textFormat';

// ================================|| FORGOT PASSWORD ||================================ //

const ForgotPassword = () => {
  const { isLoggedIn } = useAuth();
  const intl = useIntl();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{firstCapitalized(intl.formatMessage({ id: 'forgot-password' }))}</Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              {firstCapitalized(intl.formatMessage({ id: 'back-to-login' }))}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthForgotPassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default ForgotPassword;
