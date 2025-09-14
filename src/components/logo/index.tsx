import { Link } from 'react-router-dom';
import { To } from 'history';

// material-ui
import { ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import LogoOptimoGestionTextoTrans from 'assets/images/logos/Logo Optimo Gestion texto trans.png';
import LogoOptimoGestionTrans from 'assets/images/logos/Logo Optimo Gestion trans.png';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

const LogoSection = ({ reverse, isIcon, sx, to }: Props) => {
  const { isLoggedIn } = useAuth();

  return (
    <ButtonBase disableRipple {...(isLoggedIn && { component: Link, to: !to ? APP_DEFAULT_PATH : to, sx })}>
      {isIcon ? (
        <img src={LogoOptimoGestionTrans} alt="Logo Icon" style={{ height: '40px' }} />
      ) : (
        <img src={LogoOptimoGestionTextoTrans} alt="Logo" style={{ height: '90px', paddingTop:20}} />
      )}
    </ButtonBase>
  );
};

export default LogoSection;
