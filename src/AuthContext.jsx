import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionStorage.getItem('lcsAccessToken')));

  useEffect(() => {
    if (!sessionStorage.getItem('lcsAccessToken')) return;
    authApi.me().then(setUser).catch(() => sessionStorage.removeItem('lcsAccessToken')).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(identifier, password) {
      const result = await authApi.login({ identifier, password });
      sessionStorage.setItem('lcsAccessToken', result.accessToken);
      setUser(result.user);
    },
    logout() {
      sessionStorage.removeItem('lcsAccessToken');
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
