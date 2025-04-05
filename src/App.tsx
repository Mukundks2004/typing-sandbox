import NavBar from "./components/NavBar";
import Dropdown from "./components/Dropdown";
import XTerminal from "./components/XTerminal";
import "./App.css";

function App() {
  return (
    <>
      <div style={{ border: "1px solid", borderColor: "#DDDDDD" }}>
        <NavBar></NavBar>
      </div>
      <Dropdown></Dropdown>
      <div>
        <XTerminal></XTerminal>
      </div>
    </>
  );
}

export default App;
