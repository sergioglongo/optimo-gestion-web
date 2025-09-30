import { Link } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';
import { firstCapitalized } from 'utils/textFormat';
import { useIntl } from 'react-intl';

// ================================|| CHECK MAIL ||================================ //

const CheckMail = () => {
  const intl = useIntl();

  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{firstCapitalized(intl.formatMessage({ id: 'check-your-email' }))}</Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              {firstCapitalized(intl.formatMessage({ id: 'we-have-sent-password' }))}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              {firstCapitalized(intl.formatMessage({ id: 'go-back' }))}
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default CheckMail;
