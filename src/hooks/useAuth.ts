import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from 'store/slices/auth';
import { RootState } from 'store';
import { UserProfile } from 'types/auth';
import useConfig from './useConfig';

const useAuth = () => {
  const dispatch = useDispatch();
  const { onChangePresetColor } = useConfig();
  const { isLoggedIn, isInitialized, user, token } = useSelector((state: RootState) => state.auth);

  return {
    isLoggedIn,
    isInitialized,
    user,
    token,
    login: (user: UserProfile, token: string) => dispatch(login({ user, token })),
    logout: () => {
      dispatch(logout());
      onChangePresetColor('default');
    },
    resetPassword: async (email: string) => {}
  };
};
export default useAuth;
