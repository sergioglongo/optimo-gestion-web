import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';

// material-ui
import { Grid } from '@mui/material';

// project import
import ProfileCard from 'sections/apps/profiles/user/ProfileCard';
import ProfileTabs from 'sections/apps/profiles/user/ProfileTabs';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { activeItem } from 'store/slices/menu';

// ==============================|| PROFILE - USER ||============================== //

const UserProfile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const menu = useAppSelector((state) => state.menu);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (menu.openedItem !== 'user-profile') dispatch(activeItem({ openedItem: 'user-profile' }));
    // eslint-disable-next-line
  }, [pathname, dispatch, menu.openedItem]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ProfileCard focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={3}>
        <ProfileTabs focusInput={focusInput} />
      </Grid>
      <Grid item xs={12} md={9}>
        <Outlet context={inputRef} />
      </Grid>
    </Grid>
  );
};

export default UserProfile;
