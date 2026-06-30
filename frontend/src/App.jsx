import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SiteFrame from "./components/layouts/SiteFrame";
import Navbar from "./components/layouts/Navbar";
import Home from "./pages/Home";
import Location from "./pages/Location";
import Dome from "./pages/Dome";
import Calculator from "./pages/Calculator";

function App() {
  return (
    <Router>
      <SiteFrame>
        <div className="flex flex-col min-h-full" style={{ backgroundColor: "#ffffff", overflowX: "hidden" }}>
          <Navbar />
          <main id="main-content" className="flex-1 main-content-offset">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lokasi" element={<Location />} />
              <Route path="/rancang-dome" element={<Dome />} />
              <Route path="/kalkulator-limbah" element={<Calculator />} />
            </Routes>
          </main>
        </div>
      </SiteFrame>
    </Router>
  );
}

export default App;
