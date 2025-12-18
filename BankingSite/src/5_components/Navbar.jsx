import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { useAuth } from "../3_context/AuthContext.jsx";
import { db } from "../2_config/firebase.js";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  const [photoURL, setPhotoURL] = useState("");

  if (loading) return null;

  if (!user) return null;

  if (location.pathname === "/") return null;

  useEffect(() => {
    if (!user?.uid) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setPhotoURL(snap.data().photoURL || "");
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <nav className="navbar is-dark" role="navigation">
      <div className="navbar-brand">
        <NavLink to="/dashboard" className="navbar-item">
          <strong>NovaBank</strong>
        </NavLink>
      </div>

      <div className="navbar-menu is-active">
        <div className="navbar-start">
          <NavLink to="/dashboard" className="navbar-item">Dashboard</NavLink>
          <NavLink to="/transactions" className="navbar-item">Transactions</NavLink>
          <NavLink to="/profile" className="navbar-item">Profil</NavLink>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {photoURL ? (
              <figure className="image is-32x32">
                <img
                  src={photoURL}
                  alt="Avatar"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                />
              </figure>
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#2a2f3a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                N
              </div>
            )}
          </div>

          <div className="navbar-item">
            <button className="button is-light" onClick={logout}>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}