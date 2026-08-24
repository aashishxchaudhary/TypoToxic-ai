import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!storage.getToken()) return setLoading(false);
    api("/auth/me").then(({ user }) => setUser(user)).catch(() => storage.clearToken()).finally(() => setLoading(false));
  }, []);
  const authenticate = async (path, payload) => {
    const data = await api(path, { method: "POST", body: JSON.stringify(payload) });
    storage.setToken(data.token); setUser(data.user); return data.user;
  };
  const logout = () => { storage.clearToken(); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login: (v) => authenticate("/auth/login", v), register: (v) => authenticate("/auth/register", v), logout, setUser }}>{children}</AuthContext.Provider>;
};
