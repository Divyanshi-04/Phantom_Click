import { Routes, Route } from "react-router-dom"

import URLExtractor from "./pages/URLExtractor"
import Sandbox from "./pages/Sandbox"
import URLResult from "./pages/URLResult"
import ScamReplay from "./pages/ScamReplay"
import PhantomClick from "./pages/LandingPage"
import ForensicReportPage from './pages/ForensicReport';
import FeaturesSection from "./components/Stage0_LandingPage/FeaturesSection"

import { Stage1Provider } from "./lib/urlContext"

export default function App() {
  return (
    <Stage1Provider>
      <Routes>
        <Route path="/" element={<PhantomClick />} />
        <Route path="/extract" element={<URLExtractor />} />
        <Route path="/result" element={<URLResult />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/replay" element={<ScamReplay />} />
        <Route path="/forensic-report" element={<ForensicReportPage />} />
        <Route path="/work" element={<FeaturesSection />} />
      </Routes>
    </Stage1Provider>
  )
}
