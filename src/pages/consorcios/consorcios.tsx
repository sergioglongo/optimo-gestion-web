import { Grid } from '@mui/material';
import ConsorciosList from 'sections/parameters/consorcios/ConsorciosList';

const ConsorciosMain = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12}>
        <ConsorciosList striped />
      </Grid>
    </Grid>
  );
};

export default ConsorciosMain;
