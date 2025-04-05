import NavBar from "./components/NavBar";
import Dropdown from "./components/Dropdown";
import XTerminal from "./components/XTerminal";
import "./App.css";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <Dropdown></Dropdown>
      <XTerminal></XTerminal>
      <div className="windows-terminal">
        Below is a simple emulated backend, try
      </div>
    </>
  );
}

export default App;
