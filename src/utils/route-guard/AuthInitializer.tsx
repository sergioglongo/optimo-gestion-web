import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import { initialize } from 'store/slices/auth';
import { RootState } from 'store';
import Loader from 'components/Loader';
import { KeyedObject } from 'types/root';

const verifyToken = (serviceToken: string) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const AuthInitializer = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('token');
        const storedUser = window.localStorage.getItem('user');
        let user = null;

        if (storedUser) {
          user = JSON.parse(storedUser);
        }

        if (serviceToken && verifyToken(serviceToken) && user) {
          dispatch(initialize({ isLoggedIn: true, user: user, token: serviceToken }));
        } else {
          dispatch(initialize({ isLoggedIn: false, user: null, token: null }));
        }
      } catch (err) {
        console.error(err);
        dispatch(initialize({ isLoggedIn: false, user: null, token: null }));
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
