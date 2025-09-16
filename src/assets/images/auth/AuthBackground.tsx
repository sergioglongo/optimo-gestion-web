// material-ui
// import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// types
// import { ThemeDirection } from 'types/config';
import CondoImage from 'assets/images/logos/Logo Optimo Gestion edif trans.png';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  // const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 20
        // transform: theme.direction === ThemeDirection.RTL ? 'rotate(180deg)' : 'inherit'
      }}
    >
      <img src={CondoImage} alt="Welcome" height={'400px'} />
    </Box>
  );
};

export default AuthBackground;
