import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Squad } from "./pages/Squad";
import { Home } from "./pages/Home";
import StorePage from "./pages/StorePage";
import { ChessGame } from "./pages/lobby/[id]";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { Toaster } from 'sonner';
import { Lobby } from "./pages/Lobby";

export const App = () => {
  const { setShowAuthFlow } = useDynamicContext();
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected && (
        <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }}>
          <DynamicWidget />
        </div>
      )}
      {!isConnected && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
            opacity: 0,
            animation: "fadeInWallet 1s ease forwards 0.5s", // Renamed animation
          }}
        >
          <button
            onClick={() => setShowAuthFlow(true)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              width: "500px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <img
              src="/buttons/connectwallet.png"
              alt="Connect Wallet"
              style={{
                width: "100%",
                filter:
                  "drop-shadow(0 0 20px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))",
                transition: "filter 0.3s ease-in-out",
                animation: "glow 2s ease-in-out infinite",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 35px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 45px rgba(255, 255, 255, 0.8))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 20px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))";
              }}
            />
          </button>
        </div>
      )}
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby/:id" element={<ChessGame />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/lobby" element={<Lobby />} />
        </Routes>
      </Router>
      <style>
        {`
          @keyframes fadeInWallet {
            from {
              opacity: 0;
              transform: translateY(20px); // Changed from -20px to 20px for upward movement
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes glow {
            // ... glow animation remains the same ...
          }
        `}
      </style>
    </>
  );
};
