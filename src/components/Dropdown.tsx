import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState } from "react";

function Dropdown() {
  let [selectedLang, setSelectedLang] = useState("C#");
  let options = ["C#", "Scala"];

  const handleSelectItem = (item: string) => {
    setSelectedLang(item);
  };

  return (
    <div className="btn-group">
      <button type="button" className="btn btn-secondary selected-option">
        {selectedLang}
      </button>
      <button
        type="button"
        className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      />
      <ul className="dropdown-menu">
        {options.map((lang, index) => (
          <li
            className="dropdown-item"
            key={index}
            onClick={() => handleSelectItem(lang)}
          >
            {lang}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
