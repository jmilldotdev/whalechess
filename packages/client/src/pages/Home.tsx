import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export const Home = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const handleProfileClick = () => {
    navigate("/squad");
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <img
          src="/home.png"
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: 0,
            animation: "fadeInOverlay 1s ease forwards",
            animationDelay: "1s",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter:
              "drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))",
            transition: "all 0.3s ease",
            opacity: 0,
            animation: "fadeIn 1s ease forwards",
          }}
        >
          <img
            src="/whalechess.png"
            alt="Whale Chess"
            style={{
              maxWidth: "150px",
              height: "auto",
            }}
          />
        </div>

        {isConnected && (
          <>
            {/* Lobby Button */}
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                filter:
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
                transition: "transform 0.3s ease, filter 0.3s ease",
                opacity: 0,
                animation: "fadeIn 1s ease forwards",
              }}
              onClick={() => {
                console.log("Lobby clicked");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1.1)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))";
              }}
            >
              <img
                src="/buttons/lobby.png"
                alt="Lobby"
                style={{
                  maxWidth: "400px",
                  height: "auto",
                }}
              />
            </div>

            {/* Store Button */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                filter:
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
                transition: "transform 0.3s ease, filter 0.3s ease",
                opacity: 0,
                animation: "fadeIn 1s ease forwards",
              }}
              onClick={() => {
                navigate("/store");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1.1)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))";
              }}
            >
              <img
                src="/buttons/store.png"
                alt="Store"
                style={{
                  maxWidth: "400px",
                  height: "auto",
                }}
              />
            </div>

            {/* Profile Button */}
            <div
              style={{
                position: "absolute",
                top: "65%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                filter:
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))",
                transition: "transform 0.3s ease, filter 0.3s ease",
                opacity: 0,
                animation: "fadeIn 1s ease forwards",
              }}
              onClick={handleProfileClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1.1)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))";
              }}
            >
              <img
                src="/buttons/squad.png"
                alt="Profile"
                style={{
                  maxWidth: "400px",
                  height: "auto",
                }}
              />
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -40%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }

          @keyframes fadeInOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};
