// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthResetPassword from 'sections/auth/auth-forms/AuthResetPassword';
import { firstCapitalized } from 'utils/textFormat';

// ================================|| RESET PASSWORD ||================================ //

const ResetPassword = () => {
  const intl = useIntl();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
            <Typography variant="h3">{firstCapitalized(intl.formatMessage({ id: 'reset-password' }))}</Typography>
            <Typography color="secondary">{firstCapitalized(intl.formatMessage({ id: 'choose-password' }))}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthResetPassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default ResetPassword;
