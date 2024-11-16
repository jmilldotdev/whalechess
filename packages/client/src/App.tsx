import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Squad } from "./pages/Squad";
import { Home } from "./pages/Home";
import StorePage from "./pages/StorePage";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Toaster } from 'sonner';

export const App = () => {
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }}>
        <DynamicWidget />
      </div>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </Router>
    </>
  );
};
