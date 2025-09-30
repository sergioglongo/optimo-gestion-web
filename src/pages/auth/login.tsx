import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/login/AuthLogin';
import { firstCapitalized } from 'utils/textFormat';
import { useIntl } from 'react-intl';

// ================================|| LOGIN ||================================ //

const Login = () => {
  const { isLoggedIn } = useAuth();
  const intl = useIntl();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{firstCapitalized(intl.formatMessage({ id: 'starting' }))}</Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              {firstCapitalized(intl.formatMessage({ id: 'dont-have-an-account' }))}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin isDemo={isLoggedIn} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
