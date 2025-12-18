import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getToken } from "firebase/app-check";

import { useAuth } from "../3_context/AuthContext.jsx";
import { appCheck } from "../2_config/firebase.js";
import "../7_styles/Login.css";

export default function Login() {
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [appCheckStatus, setAppCheckStatus] = useState("Vérification de sécurité…");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!appCheck) {
          if (mounted) setAppCheckStatus("App Check indisponible");
          return;
        }
        const { token } = await getToken(appCheck, false);
        if (mounted) setAppCheckStatus(token ? "Sécurité active (reCAPTCHA v3)" : "Sécurité active");
      } catch {
        if (mounted) setAppCheckStatus("App Check non confirmé (dev)");
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handleLogin = async (fn) => {
    setError("");
    setBusy(true);
    try {
      await fn();
      navigate("/dashboard", { replace: true });
    } catch {
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

        <div className="login-status">
          <span className="login-badge">{appCheckStatus}</span>
        </div>

        {error && <div className="login-error">{error}</div>}

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
          Sécurité: App Check + reCAPTCHA v3 (invisible) protège les appels vers Firebase.
        </p>
      </div>
    </div>
  );
}