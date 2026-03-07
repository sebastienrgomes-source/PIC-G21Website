import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSessionRequest, loginRequest, logoutRequest, signupRequest } from "../services/auth-api";
import { clearActiveUserEmail, setActiveUserEmail } from "../services/demo-store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const activeSession = await getSessionRequest();
        if (!isMounted) return;

        setSession(activeSession);
        setActiveUserEmail(activeSession.email);
      } catch {
        if (!isMounted) return;

        setSession(null);
        clearActiveUserEmail();
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      isReady,
      isAuthenticated: Boolean(session),
      async login({ email, password }) {
        const nextSession = await loginRequest({ email, password });
        setSession(nextSession);
        setActiveUserEmail(nextSession.email);
        return nextSession;
      },
      async register({ email, password, fullName }) {
        const nextSession = await signupRequest({ email, password, fullName });
        setSession(nextSession);
        setActiveUserEmail(nextSession.email);
        return nextSession;
      },
      async logout() {
        await logoutRequest();
        setSession(null);
        clearActiveUserEmail();
      },
    }),
    [isReady, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
