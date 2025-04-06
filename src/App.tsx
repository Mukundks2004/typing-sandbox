import NavBar from "./components/NavBar";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFound";
import DocsPage from "./components/DocsPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ border: "1px solid", borderColor: "#DDDDDD" }}>
        <NavBar></NavBar>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
