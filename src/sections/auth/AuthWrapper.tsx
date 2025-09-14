import { ReactNode } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import AuthFooter from 'components/cards/AuthFooter';
// import Logo from 'components/logo';
import AuthCard from './AuthCard';
import LogoOptimoGestionTextoTrans from 'assets/images/logos/Logo Optimo Gestion texto trans.png';

// assets
// import AuthBackground from 'assets/images/auth/AuthBackground';

interface Props {
  children: ReactNode;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }: Props) => (
  <Box sx={{ minHeight: '100vh' }}>
    {/* <AuthBackground /> */}
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12} sx={{ width: '100%', textAlign: 'center' }}>
        <img src={LogoOptimoGestionTextoTrans} alt="Logo" style={{ maxWidth: '350px', paddingTop: 20 }} />
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} container justifyContent="center" alignItems="center" sx={{ minHeight: { xs: 'calc(100vh - 210px)' } }}>
          <Grid item sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', marginX: 2 }}>
            <AuthCard>{children}</AuthCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  </Box>
);

export default AuthWrapper;
