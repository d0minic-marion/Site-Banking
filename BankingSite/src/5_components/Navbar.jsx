import { NavLink } from "react-router-dom";
import { useAuth } from "../3_context/AuthContext.jsx";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <NavLink to="/dashboard" className="navbar-item">
          <strong>NovaBank</strong>
        </NavLink>
      </div>

      <div className="navbar-menu is-active">
        <div className="navbar-start">
          <NavLink to="/dashboard" className="navbar-item">Dashboard</NavLink>
          <NavLink to="/accounts" className="navbar-item">Comptes</NavLink>
          <NavLink to="/transactions" className="navbar-item">Transactions</NavLink>
          <NavLink to="/transfer" className="navbar-item">Virement</NavLink>
          <NavLink to="/profile" className="navbar-item">Profil</NavLink>
        </div>

        <div className="navbar-end">
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
