import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Dropdown2() {
  return (
    <div className="btn-group">
      <button type="button" className="btn btn-secondary selected-option">
        Danger
      </button>
      <button
        type="button"
        className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      ></button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" href="#">
            Action
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Another action
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Something else here
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Separated link
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Dropdown2;
