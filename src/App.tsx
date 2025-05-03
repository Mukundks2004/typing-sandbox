import NavBar from "./components/NavBar";
import "./App.css";
import { Routes, Route, HashRouter as Router } from "react-router-dom";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFound";
import DocsPage from "./components/DocsPage";

const isProduction = import.meta.env.MODE === "production";
const basename = isProduction ? "/" : "/";

console.log("Current pathname:", window.location.pathname);
console.log("Using basename:", basename);
console.log("Production mode:", import.meta.env.MODE);

function App() {
  return (
    <Router basename={basename}>
      <div style={{ border: "1px solid", borderColor: "#DDDDDD" }}>
        <NavBar></NavBar>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
