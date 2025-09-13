// material-ui
import { Grid, Typography, Button, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';

//asset
import CondoImage from 'assets/images/consorcio/Consorcio.png';
import AIImage from 'assets/images/consorcio/AI.png';

// types
import { ThemeDirection, ThemeMode } from 'types/config';

// ==============================|| ANALYTICS - WELCOME ||============================== //

const WelcomeBanner = () => {
  const theme = useTheme();

  return (
    <MainCard
      border={false}
      sx={{
        background:
          theme.direction === ThemeDirection.RTL
            ? `linear-gradient(60.38deg, ${theme.palette.primary.lighter} 114%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.darker} 104.37%)`
            : `linear-gradient(250.38deg, ${theme.palette.primary.lighter} 2.39%, ${theme.palette.primary.light} 34.42%, ${theme.palette.primary.main} 60.95%, ${theme.palette.primary.dark} 84.83%, ${theme.palette.primary.darker} 104.37%)`
      }}
    >
      <Grid container>
        <Grid item md={6} sm={6} xs={12}>
          <Stack spacing={2} sx={{ padding: 3.4 }}>
            <Typography variant="h2" color={theme.palette.background.paper}>
              Bienvenidos a Optimo Gestión
            </Typography>
            <Typography variant="h6" color={theme.palette.background.paper}>
              La mejor forma de administrar tus consorcios sin perder tiempo.
            </Typography>
            <Box>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                sx={{
                  color: theme.palette.background.paper,
                  borderColor: theme.palette.background.paper,
                  '&:hover': {
                    color: 'background.paper',
                    borderColor: theme.palette.background.paper,
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.darker' : 'primary.main'
                  }
                }}
              >
                Condominios
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid item sm={6} xs={12} sx={{ display: { xs: 'none', sm: 'initial' } }}>
          <Stack
            sx={{ position: 'relative', pr: { sm: 3, md: 8 }, filter: 'drop-shadow(0px 8px 8px rgba(0,0,0,0.25))' }}
            justifyContent="center"
            alignItems="flex-end"
          >
            <img src={CondoImage} alt="Welcome" />
            <Box sx={{ position: 'absolute', bottom: -15, right: '5%', filter: 'drop-shadow(0px 8px 8px rgba(0,0,0,0.25))' }}>
              <img src={AIImage} alt="Welcome Arrow" width="100px" height="100px" />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default WelcomeBanner;
