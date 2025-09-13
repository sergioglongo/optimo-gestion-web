import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Avatar, Chip, ListItemButton, ListItemText, Typography } from '@mui/material';

// project import
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { activeComponent, openComponentDrawer } from 'store/slices/menu';

// types
import { LinkTarget, NavItemType } from 'types/menu';
import { ThemeMode } from 'types/config';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface Props {
  item: NavItemType;
}

const NavItem = ({ item }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { openedComponent: openComponent } = useAppSelector((state) => state.menu);

  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

  let itemTarget: LinkTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = (id: string) => {
    dispatch(activeComponent({ openedComponent: id }));
    matchesMD && dispatch(openComponentDrawer({ isComponentDrawerOpened: false }));
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch(activeComponent({ openedComponent: item.id! }));
    }
    // eslint-disable-next-line
  }, [dispatch, item.id]);

  const textColor = theme.palette.mode === ThemeMode.DARK ? 'grey.400' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === ThemeMode.DARK ? 'text.primary' : 'primary.main';

  return (
    <ListItemButton
      component={Link}
      to={item.url!}
      target={itemTarget}
      disabled={item.disabled}
      onClick={() => itemHandler(item.id!)}
      selected={openComponent === item.id}
      sx={{
        pl: 4,
        py: 1,
        mb: 0.5,
        '&:hover': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter'
        },
        '&.Mui-selected': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter',
          borderRight: `2px solid ${theme.palette.primary.main}`,
          '&:hover': {
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter'
          }
        }
      }}
    >
      <ListItemText
        primary={
          <Typography variant="h6" sx={{ color: openComponent === item.id ? iconSelectedColor : textColor }}>
            {item.title}
          </Typography>
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
