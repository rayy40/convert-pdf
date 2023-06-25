import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import JpgToPdfPage from "./Pages/OperationsPages/JpgToPdfPage";
import PdfToJpgPage from "./Pages/OperationsPages/PdfToJpgPage";
import CompressPdfPage from "./Pages/OperationsPages/CompressPdfPage";
import DeletePdfPage from "./Pages/OperationsPages/DeletePdfPage";
import EditPdf from "./Components/EditPdf/EditPdf";
import { FileProvider } from "./Helper/FileContext";
import NavBar from "./Components/NavBar/NavBar";
import { pdfjs } from "react-pdf";
import PdfToPptPage from "./Pages/OperationsPages/PdfToPptPage";
import SplitPdfPage from "./Pages/OperationsPages/SplitPdfPage";
import ExtractPdfPage from "./Pages/OperationsPages/ExtractPdfPage";
import MergePdfPage from "./Pages/OperationsPages/MergePdfPage";
import ProtectPdfPage from "./Pages/OperationsPages/ProtectPdfPage";
import UnlockPdfPage from "./Pages/OperationsPages/UnlockPdfPage";
import ResultPage from "./Pages/OperationsPages/ResultPage";
import ExtractedImagesPdfPage from "./Pages/OperationsPages/ExtractedImagesPdfPage";
import RotatePdfPage from "./Pages/OperationsPages/RotatePdfPage";
import PdfToWordPage from "./Pages/OperationsPages/PdfToWordPage";
import WordToPdfPage from "./Pages/OperationsPages/WordToPdfPage";

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
            <Route path="/pdf-to-ppt" element={<PdfToPptPage />} />
            <Route path="/pdf-to-word" element={<PdfToWordPage />} />
            <Route path="/word-to-pdf" element={<WordToPdfPage />} />
            <Route path="/delete-pages" element={<DeletePdfPage />} />
            <Route path="/split-pdf" element={<SplitPdfPage />} />
            <Route path="/extract-pdf" element={<ExtractPdfPage />} />
            <Route path="/merge-pdf" element={<MergePdfPage />} />
            <Route
              path="/extract-images"
              element={<ExtractedImagesPdfPage />}
            />
            <Route path="/protect-pdf" element={<ProtectPdfPage />} />
            <Route path="/rotate-pdf" element={<RotatePdfPage />} />
            <Route path="/unlock-pdf" element={<UnlockPdfPage />} />
            <Route path="/compress-pdf" element={<CompressPdfPage />} />
            <Route path="/delete-pages/edit" element={<EditPdf />} />
            <Route path="/split-pdf/edit" element={<EditPdf />} />
            <Route path="/extract-pdf/edit" element={<EditPdf />} />
            <Route path="/rotate-pdf/edit" element={<EditPdf />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;
