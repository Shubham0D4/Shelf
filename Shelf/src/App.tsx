import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import BookDetailPage from "./pages/BookDetailPage";
import UploadFile from "./components/UploadFile.tsx";
import PDFReader from "./pages/PDFReader.tsx";

function App() {
  return (
      <>

          <Router>
              <Routes>
                  <Route path="/" element={<Homepage onNavigateToUpload={() => {}} />} />
                  <Route path="/book/:title" element={<BookDetailPage />} />
                  <Route path="/uploadbook" element={<UploadFile onNavigateBack={() => {}} />} />
                  <Route path="/reader/:id" element={<PDFReader/> }/>
              </Routes>
          </Router>
      </>

  );
}

export default App;
