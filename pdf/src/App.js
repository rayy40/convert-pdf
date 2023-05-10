import "./App.css";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JpgToPdfPage from "./Pages/OperationsPages/JpgToPdfPage";
import PdfToJpgPage from "./Pages/OperationsPages/PdfToJpgPage";
import NavBar from "./Components/NavBar/NavBar";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
