import React, { createContext, useState, useEffect, useContext } from 'react';
import MsalAuth from '../src/Login/MSALAuth'


export const AuthContext = createContext();

const authProvider = new MsalAuth();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await authProvider.init();

      const account = authProvider.msalPublicClientApp.getActiveAccount();
      if (account) {
        setUser(account);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async () => {
    const response = await authProvider.login();
    if (response) {
      setUser(response.account);
    }
  };

  const logout = () => {
    authProvider.msalPublicClientApp.setActiveAccount(null);
  
    setUser(null);
  };

  const getToken = async () => {
    return await authProvider.getToken();
  };

  const value = {
    user,
    login,
    logout,
    getToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};