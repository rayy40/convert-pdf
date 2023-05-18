import "./App.css";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JpgToPdfPage from "./Pages/OperationsPages/JpgToPdfPage";
import PdfToJpgPage from "./Pages/OperationsPages/PdfToJpgPage";
import NavBar from "./Components/NavBar/NavBar";
import DeletePdfPage from "./Pages/OperationsPages/DeletePdfPage";
import EditPdf from "./Components/EditPdf/EditPdf";
import { FileProvider } from "./Helper/FileContext";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  return (
    <Router>
      <FileProvider>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
            <Route path="/delete-pages" element={<DeletePdfPage />} />
            <Route path="/delete-pages/edit" element={<EditPdf />} />
          </Routes>
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;
