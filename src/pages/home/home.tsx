import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import OrdersList from 'sections/dashboard/analytics/OrdersList';
import TransactionHistory from 'sections/dashboard/analytics/TransactionHistory';

import WelcomeBanner from 'sections/dashboard/analytics/WelcomeBanner';

const HomeDashboard = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12}>
        <WelcomeBanner />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Estado del Periodo Actual</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersList />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <TransactionHistory />
      </Grid>
    </Grid>
  );
};

export default HomeDashboard;
