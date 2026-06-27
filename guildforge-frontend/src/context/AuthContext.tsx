import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "../api/auth";
import type { AuthUser } from "../types/User";
import { setToken } from "../utils/auth";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  login: (u: string, p: string) => Promise<void>;
  signup: (u: string, e: string, p: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    if (!authApi.hasStoredSession()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.fetchMe();
      setUser({
        id: me.id,
        username: me.username,
        email: me.email,
        role: me.role,
        guildIds: me.guildIds ?? [],
      });
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (username: string, password: string) => {
    setError(null);
    try {
      await authApi.login({ username, password });
      const me = await authApi.fetchMe();
      setUser({
        id: me.id,
        username: me.username,
        email: me.email,
        role: me.role,
        guildIds: me.guildIds ?? [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      throw e;
    }
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    setError(null);
    try {
      await authApi.signup({ username, email, password });
      const me = await authApi.fetchMe();
      setUser({
        id: me.id,
        username: me.username,
        email: me.email,
        role: me.role,
        guildIds: me.guildIds ?? [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed");
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, refresh, login, signup, logout }),
    [user, loading, error, refresh, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
