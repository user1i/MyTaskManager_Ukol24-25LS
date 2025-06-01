import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation(); 

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid"> {/* Název aplikace vlevo, odkaz na úvodní stránku */}
        <Link className="navbar-brand" to="/">MyTaskManager</Link>

        {/* Tlačítko pro zobrazení menu na menších obrazovkách */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

         {/* Navigační odkazy */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
                to="/categories"
              >
                Kategorie
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
