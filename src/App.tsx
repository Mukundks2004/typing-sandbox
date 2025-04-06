import NavBar from "./components/NavBar";
import "./App.css";
import XTerminal from "./components/XTerminal";

function App() {
  return (
    <>
      <div style={{ border: "1px solid", borderColor: "#DDDDDD" }}>
        <NavBar></NavBar>
      </div>
      <XTerminal></XTerminal>
    </>
  );
}

export default App;
