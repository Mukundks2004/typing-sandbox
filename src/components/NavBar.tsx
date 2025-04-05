import "../App.css";

function NavBar() {
  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <ul className="navbar-nav me-auto d-flex flex-row">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">
              TYPING SANDBOX
            </a>
          </li>
          <li className="nav-item ms-4">
            <a className="nav-link active" aria-current="page" href="/docs">
              DOCS
            </a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link active"
              href="https://github.com/Mukundks2004/typing-sandbox"
            >
              <img
                src="/github-mark.svg"
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
