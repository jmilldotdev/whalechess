import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Squad } from "./pages/Squad";
import { Home } from "./pages/Home";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/squad" element={<Squad />} />
      </Routes>
    </Router>
  );
};
