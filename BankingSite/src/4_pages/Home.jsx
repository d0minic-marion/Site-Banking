import { Link } from "react-router-dom";
import "../7_styles/Home.css";

export default function Home() {
  return (
    <div className="home">
      <nav className="navbar is-transparent home-nav" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item home-brand">
            <span className="home-logo">N</span>
            <span className="home-brand-text">NovaBank</span>
          </Link>

          <span className="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </span>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item home-nav-link" href="#features">Fonctionnalités</a>
            <a className="navbar-item home-nav-link" href="#security">Sécurité</a>
            <a className="navbar-item home-nav-link" href="#services">Services</a>

            <div className="navbar-item">
              <div className="buttons">
                <Link to="/login" className="button is-light home-btn-ghost">
                  Se connecter
                </Link>
                <Link to="/login" className="button is-primary home-btn-primary">
                  Commencer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="section home-hero">
        <div className="container">
          <div className="columns is-vcentered is-variable is-8">
            <div className="column is-6">
              <p className="home-pill">
                Banque démo • React + Firebase • App Check + reCAPTCHA
              </p>

              <h1 className="title is-1 home-title">
                Gérez vos <span className="home-accent">comptes</span> et vos{" "}
                <span className="home-accent">transactions</span> en toute simplicité.
              </h1>

              <p className="subtitle is-5 home-subtitle">
                NovaBank est une application bancaire <strong>simulée</strong> :
                authentification (Google/GitHub), données (Firestore), photo de profil (Storage),
                protection (App Check + reCAPTCHA) et un résumé IA des dépenses mensuelles.
              </p>

              <div className="buttons mt-5">
                <Link to="/login" className="button is-primary is-medium home-btn-primary">
                  Se connecter
                </Link>
                <a href="#features" className="button is-light is-medium home-btn-ghost">
                  Voir les fonctionnalités
                </a>
              </div>

              <div className="home-stats mt-6">
                <div className="home-stat">
                  <p className="home-stat-number">OAuth</p>
                  <p className="home-stat-label">Google + GitHub</p>
                </div>
                <div className="home-stat">
                  <p className="home-stat-number">CRUD</p>
                  <p className="home-stat-label">Firestore</p>
                </div>
                <div className="home-stat">
                  <p className="home-stat-number">Secure</p>
                  <p className="home-stat-label">App Check</p>
                </div>
              </div>
            </div>

            <div className="column is-6">
              <div className="home-mock">
                <div className="home-mock-top">
                  <div className="home-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <p className="home-mock-title">Dashboard</p>
                </div>

                <div className="home-mock-body">
                  <div className="home-balance">
                    <p className="home-balance-label">Solde total</p>
                    <p className="home-balance-value">$ 7,420.55</p>
                    <p className="home-balance-sub">CAD • Démo</p>
                  </div>

                  <div className="columns is-variable is-4 mt-4">
                    <div className="column">
                      <div className="home-mini-card">
                        <p className="home-mini-title">Compte chèque</p>
                        <p className="home-mini-value">$ 2,180.10</p>
                      </div>
                    </div>
                    <div className="column">
                      <div className="home-mini-card">
                        <p className="home-mini-title">Épargne</p>
                        <p className="home-mini-value">$ 5,240.45</p>
                      </div>
                    </div>
                  </div>

                  <div className="home-tx mt-4">
                    <div className="home-tx-row">
                      <span>Épicerie</span><span className="home-tx-neg">- 56.20</span>
                    </div>
                    <div className="home-tx-row">
                      <span>Transport</span><span className="home-tx-neg">- 18.75</span>
                    </div>
                    <div className="home-tx-row">
                      <span>Paie (démo)</span><span className="home-tx-pos">+ 950.00</span>
                    </div>
                  </div>

                  <div className="home-ai mt-5">
                    <p className="home-ai-title">Résumé IA</p>
                    <p className="home-ai-text">
                      Ce mois-ci, dépenses principales: Alimentation et Transport.
                      Suggestion: définir un budget hebdomadaire.
                    </p>
                    <div className="home-ai-chip">OpenAI • Démo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section home-section">
        <div className="container">
          <h2 className="title is-3 home-h2">Fonctionnalités</h2>
          <p className="subtitle is-6 home-lead">
            L’essentiel, bien fait. Une application bancaire démo claire, rapide et sécurisée.
          </p>

          <div className="columns is-multiline mt-5">
            {[
              { title: "Dashboard", desc: "Vue d’ensemble: soldes, dernières transactions, résumé mensuel." },
              { title: "Transactions", desc: "Historique filtrable: date, type, compte." },
              { title: "Virement (simulé)", desc: "Création d’un transfert démo stocké dans Firestore." },
              { title: "Profil", desc: "Photo de profil via Firebase Storage + préférences utilisateur." },
            ].map((f) => (
              <div className="column is-6" key={f.title}>
                <div className="home-card">
                  <p className="home-card-title">{f.title}</p>
                  <p className="home-card-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="section home-section">
        <div className="container">
          <div className="columns is-variable is-8 is-vcentered">
            <div className="column is-6">
              <h2 className="title is-3 home-h2">Sécurité intégrée</h2>
              <p className="subtitle is-6 home-lead">
                Authentification OAuth, règles Firestore/Storage et protection App Check.
              </p>

              <div className="home-list">
                <div className="home-list-item">
                  <span className="home-check">✓</span>
                  <span><strong>Auth</strong> Google + GitHub</span>
                </div>
                <div className="home-list-item">
                  <span className="home-check">✓</span>
                  <span><strong>App Check</strong> + reCAPTCHA v3</span>
                </div>
                <div className="home-list-item">
                  <span className="home-check">✓</span>
                  <span><strong>Règles</strong> : chaque utilisateur accède uniquement à ses données</span>
                </div>
              </div>

              <div className="buttons mt-5">
                <Link to="/login" className="button is-primary home-btn-primary">
                  Activer mon compte (démo)
                </Link>
              </div>
            </div>

            <div className="column is-6">
              <div className="home-security-card">
                <p className="home-security-title">Accès aux données</p>
                <p className="home-security-text">
                  Les écritures Firestore et les uploads Storage sont protégés par{" "}
                  <strong>App Check</strong> et par des{" "}
                  <strong>règles</strong> basées sur <code>request.auth.uid</code>.
                </p>
                <div className="home-code">
                  <pre>
{`allow read, write: if request.auth != null
  && request.auth.uid == userId;`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section home-section home-section-last">
        <div className="container">
          <h2 className="title is-3 home-h2">Services utilisés</h2>

          <div className="home-badges mt-4">
            {[
              "Firestore",
              "Storage",
              "Auth (Google/GitHub)",
              "Hosting",
              "App Check + reCAPTCHA",
              "OpenAI (résumé mensuel)",
            ].map((t) => (
              <span className="home-badge" key={t}>{t}</span>
            ))}
          </div>

          <div className="home-footer-cta mt-6">
            <div>
              <p className="home-footer-title">Prêt à tester ?</p>
              <p className="home-footer-sub">Connecte-toi et explore le dashboard.</p>
            </div>
            <Link to="/login" className="button is-primary home-btn-primary">
              Se connecter
            </Link>
          </div>

          <p className="home-footnote mt-5">
            * NovaBank est une application <strong>démo</strong>. Aucune transaction réelle.
          </p>
        </div>
      </section>
    </div>
  );
}