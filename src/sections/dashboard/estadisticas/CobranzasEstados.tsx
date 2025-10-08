import { ReactElement } from 'react';

// material-ui
import {
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

// project import
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// ==============================|| STYLES ||============================== //

// Estilo para el avatar del ícono
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// Estilo para la sección de acción secundaria (valor y porcentaje)
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| TYPES ||============================== //

export interface CobranzasEstadosItem {
  id: string | number;
  icon: ReactElement;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  value: string | number;
  percentage: string | number;
}

interface CobranzasEstadosProps {
  cardTitle: string;
  items: CobranzasEstadosItem[];
}

// ==============================|| DYNAMIC LIST CARD - COBRANZAS ESTADOS ||============================== //

function CobranzasEstados({ cardTitle, items }: CobranzasEstadosProps) {
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">{cardTitle}</Typography>
        </Grid>
        <Grid item />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <List
          component="nav"
          sx={{
            p: 0,
            '& .MuiListItemButton-root': {
              py: 1.5,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
            }
          }}
        >
          {items.map((item, index) => (
            <ListItemButton key={item.id} divider={index < items.length - 1}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: item.iconColor,
                    bgcolor: item.iconBgColor
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">{item.title}</Typography>} secondary={item.subtitle} />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    {item.value}
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    {item.percentage}
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>
      </MainCard>
    </>
  );
}

export default CobranzasEstados;