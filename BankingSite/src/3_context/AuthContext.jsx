import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, githubProvider } from "../2_config/firebase.js";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithGithub = () => signInWithPopup(auth, githubProvider);
  const logout = () => signOut(auth);

  return (
    <AuthCtx.Provider value={{ user, loading, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
