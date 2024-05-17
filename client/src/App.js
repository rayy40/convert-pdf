import "./App.css";
import "@fontsource/source-sans-pro";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { pdfjs } from "react-pdf";
import HomePage from "./pages/homePage/Home";
import JpgToPdfPage from "./pages/operationsPages/JpgToPdfPage";
import PdfToJpgPage from "./pages/operationsPages/PdfToJpgPage";
import CompressPdfPage from "./pages/operationsPages/CompressPdfPage";
import DeletePdfPage from "./pages/operationsPages/DeletePdfPage";
import EditPdf from "./components/EditPdf/EditPdf";
import { FileProvider } from "./providers/fileContext";
import NavBar from "./components/NavBar/NavBar";
import PdfToPptPage from "./pages/operationsPages/PdfToPptPage";
import SplitPdfPage from "./pages/operationsPages/SplitPdfPage";
import ExtractPdfPage from "./pages/operationsPages/ExtractPdfPage";
import MergePdfPage from "./pages/operationsPages/MergePdfPage";
import ProtectPdfPage from "./pages/operationsPages/ProtectPdfPage";
import UnlockPdfPage from "./pages/operationsPages/UnlockPdfPage";
import ResultPage from "./pages/operationsPages/ResultPage";
import ExtractPdfImages from "./pages/operationsPages/ExtractPdfImages";
import RotatePdfPage from "./pages/operationsPages/RotatePdfPage";
import PdfToWordPage from "./pages/operationsPages/PdfToWordPage";
import WordToPdfPage from "./pages/operationsPages/WordToPdfPage";
import Documents from "./pages/documentsPage/Documents";
import ExtractPdfText from "./pages/operationsPages/ExtractPdfText";

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
            <Route path="/extract-text" element={<ExtractPdfText />} />
            <Route path="/merge-pdf" element={<MergePdfPage />} />
            <Route path="/extract-images" element={<ExtractPdfImages />} />
            <Route path="/protect-pdf" element={<ProtectPdfPage />} />
            <Route path="/rotate-pdf" element={<RotatePdfPage />} />
            <Route path="/unlock-pdf" element={<UnlockPdfPage />} />
            <Route path="/compress-pdf" element={<CompressPdfPage />} />
            <Route path="/delete-Pages/edit" element={<EditPdf />} />
            <Route path="/split-pdf/edit" element={<EditPdf />} />
            <Route path="/extract-pdf/edit" element={<EditPdf />} />
            <Route path="/rotate-pdf/edit" element={<EditPdf />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/documents" element={<Documents />} />
          </Routes>
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;
