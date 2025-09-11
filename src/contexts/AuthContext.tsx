import React, { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';

// third-party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import { KeyedObject } from 'types/root';
import { AuthProps, JWTContextType, UserProfile } from 'types/auth';

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
  } else {
    localStorage.removeItem('serviceToken');
  }
};

// ==============================|| AUTH CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext<JWTContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: null // El perfil de usuario se cargará por separado con react-query
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = useCallback((user: UserProfile, token: string) => {
    setSession(token);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  }, []);

  // La lógica de registro ahora se maneja con react-query en el componente de registro.
  const register = useCallback(async () => {}, []);

  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: LOGOUT });
  }, []);

  const resetPassword = useCallback(async (email: string) => {}, []);

  const updateProfile = useCallback(() => {}, []);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      login,
      logout,
      register,
      resetPassword,
      updateProfile
    }),
    [state, login, logout, register, resetPassword, updateProfile]
  );

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
