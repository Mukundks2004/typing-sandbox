import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState } from "react";
import { LANGUAGE_OPTIONS } from "../constants/constants";

function Dropdown({
  initialSelection,
  onDropdownChange,
}: {
  initialSelection: string;
  onDropdownChange: Function;
}) {
  let [selectedLang, setSelectedLang] = useState(initialSelection);
  let options = LANGUAGE_OPTIONS;

  const handleSelectItem = (item: string) => {
    if (item !== selectedLang) {
      setSelectedLang(item);
      onDropdownChange(item);
    }
  };

  return (
    <>
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
    </>
  );
}

export default Dropdown;
