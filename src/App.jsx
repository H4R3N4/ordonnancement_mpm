import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExemplePage from "./pages/ExemplePage";
import MesTachesPage from "./pages/MesTachesPages";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ExemplePage />} />
        <Route path="/mes-taches" element={<MesTachesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
