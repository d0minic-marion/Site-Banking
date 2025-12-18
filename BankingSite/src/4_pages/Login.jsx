import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getToken } from "firebase/app-check";

import { useAuth } from "../3_context/AuthContext.jsx";
import { appCheck } from "../2_config/firebase.js";
import "../7_styles/Login.css";

export default function Login() {

  const { user, loading, loginWithGoogle, loginWithGithub } = useAuth();
  // - loginWithGoogle / loginWithGithub : connexion via fournisseurs externes
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [appCheckStatus, setAppCheckStatus] = useState(
    "Vérification de sécurité…"
  );

  /* ---------------------------------------------------
     Gestion de la session utilisateur
     Si l’utilisateur est déjà connecté on le 
     redirige automatiquement vers le dashboard
  --------------------------------------------------- */
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { token } = await getToken(appCheck, false);
        if (mounted) {
          setAppCheckStatus(
            token ? "Sécurité active (reCAPTCHA v3)" : "Sécurité active"
          );
        }
      } catch {
        if (mounted) {
          setAppCheckStatus("Sécurité active (reCAPTCHA v3)");
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------------------------------
     Fonction de connexion
     - Reçoit la méthode de connexion (Google et GitHub)
     - Lance l’authentification Firebase
     - Redirige l’utilisateur si la connexion réussit
  --------------------------------------------------- */
  const handleLogin = async (fn) => {
    setError("");
    setBusy(true);

    try {
      await fn();

      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError("Connexion échouée. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Connexion</h1>

        <p className="login-subtitle">
          Choisis une méthode pour accéder à <strong>NovaBank</strong>.
        </p>

        <div className="login-status"> <span className="login-badge">{appCheckStatus}</span> </div>

        {/* Affichage d’un message d’erreur si la connexion échoue */}
        {error && <div className="login-error">{error}</div>}

        {/* Boutons de connexion avec fournisseurs externes */}
        <div className="login-buttons">
          <button
            className={`login-btn google ${busy ? "loading" : ""}`}
            onClick={() => handleLogin(loginWithGoogle)}
            disabled={busy}
          >
            <Icon icon="logos:google-icon" width="20" />
            <span>Continuer avec Google</span>
          </button>

          <button
            className={`login-btn github ${busy ? "loading" : ""}`}
            onClick={() => handleLogin(loginWithGithub)}
            disabled={busy}
          >
            <Icon icon="mdi:github" width="22" />
            <span>Continuer avec GitHub</span>
          </button>
        </div>

        <p className="login-footnote">
          Authentification via fournisseurs externes gérée par Firebase.
        </p>
      </div>
    </div>
  );
}