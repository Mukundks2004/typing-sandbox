import NavBar from "./components/NavBar";
import Dropdown from "./components/Dropdown";
import XTerminal from "./components/XTerminal";
import Test from "./Test";
import "./App.css";

function App() {
  return (
    <>
      <div style={{ border: "1px solid", borderColor: "#DDDDDD" }}>
        <NavBar></NavBar>
      </div>
      <Dropdown></Dropdown>
      <div
        style={{
          padding: "10px",
          // borderRadius:k "10px",
          // backgroundColor: "#2D2E2C",
          backgroundClip: "padding-box",
        }}
      >
        <XTerminal></XTerminal>
      </div>
      {/* <div
        style={{
          padding: "10px",
          backgroundColor: "#FF0000",
        }}
      >
        <Test></Test>
      </div> */}
    </>
  );
}

export default App;
