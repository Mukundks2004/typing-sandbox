import "../App.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <ul className="navbar-nav me-auto d-flex flex-row">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">
              TYPING SANDBOX
            </Link>
          </li>
          <li className="nav-item ms-4">
            <Link className="nav-link active" aria-current="page" to="/docs">
              DOCS
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link active"
              href="https://github.com/Mukundks2004/typing-sandbox"
            >
              <img
                src="/typing-sandbox/github-mark.svg"
                alt="Logo"
                width="24"
                height="24"
                className="navbar-img"
              />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
