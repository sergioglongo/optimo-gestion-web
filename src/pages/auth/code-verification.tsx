// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthCodeVerification from 'sections/auth/auth-forms/AuthCodeVerification';
import { firstCapitalized } from 'utils/textFormat';

// ================================|| CODE VERIFICATION ||================================ //

const CodeVerification = () => {
  let email = window.localStorage.getItem('email');
  let finalArr: string[] = [];
  const intl = useIntl();

  if (email) {
    let emailSplit = email.split('');
    let len = emailSplit.indexOf('@');
    emailSplit.forEach((item, pos) => {
      pos >= 1 && pos <= len - 2 ? finalArr.push('*') : finalArr.push(emailSplit[pos]);
    });
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="h3">{firstCapitalized(intl.formatMessage({ id: 'verification-code' }))}</Typography>
            <Typography color="secondary">{firstCapitalized(intl.formatMessage({ id: 'send-you-email' }))}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography>We`ve send you code on jone. {email && finalArr.length > 0 ? finalArr.join('') : '****@company.com'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <AuthCodeVerification />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default CodeVerification;
