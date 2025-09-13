import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import { login, logout } from 'store/slices/auth';
import { RootState } from 'store';
import Loader from 'components/Loader';
import { KeyedObject } from 'types/root';
import { UserProfile } from 'types/auth';

const verifyToken = (serviceToken: string) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
  } else {
    localStorage.removeItem('serviceToken');
  }
};

const AuthInitializer = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const decodedUser: UserProfile = jwtDecode(serviceToken);
          dispatch(login({ user: decodedUser, token: serviceToken }));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error(err);
        dispatch(logout());
      }
    };

    init();
  }, [dispatch]);

  if (!isInitialized) {
    return <Loader />;
  }

  return children;
};

export default AuthInitializer;
