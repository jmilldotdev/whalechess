import { useNavigate } from "react-router-dom";
import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";
import { zeroAddress } from "viem";

export const Lobby = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const {
    network: { tables, useStore },
  } = useMUD();

  // Fetch lobbies from the store
  const lobbies = useStore((state) =>
    Object.values(state.getRecords(tables.Lobby))
  );

  const handleJoinLobby = (lobbyId: string) => {
    // Logic to join the lobby
    navigate(`/lobby/${lobbyId}`);
  };

  const handleGoToGame = (lobbyId: string) => {
    // Logic to go to the game
    navigate(`/game/${lobbyId}`);
  };

  const handleWatchGame = (lobbyId: string) => {
    // Logic to watch the game
    navigate(`/watch/${lobbyId}`);
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
          src="/chess/lobby.jpg"
          alt="Lobby Background"
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
          }}
        />

        {/* Title Section */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translate(-50%, 0)",
            textAlign: "center",
            color: "white",
            opacity: 0,
            animation: "fadeIn 1s ease forwards",
            marginBottom: "40px",
          }}
        >
          <img
            src="/texts/gamelobby.png"
            alt="Game Lobby"
            style={{
              maxWidth: "50%",
              height: "auto",
            }}
          />
        </div>

        {/* Lobbies Container */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "80%",
            maxWidth: "800px",
            height: "60vh",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "20px",
          }}
        >
          {lobbies.map((lobby) => {
            const isCreator =
              lobby.value.ownerAddress.toLowerCase() === address?.toLowerCase();
            const hasOpponent = lobby.value.opponentAddress !== zeroAddress;
            console.log(
              "lobby.value.opponentAddress",
              lobby.value.opponentAddress
            );
            console.log("hasOpponent", hasOpponent);

            return (
              <div
                key={lobby.id}
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  minHeight: "200px",
                  margin: "0 auto",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  padding: "20px",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(255, 255, 255, 0.1)";
                }}
              >
                <h3 style={{ marginBottom: "15px" }}>Lobby</h3>
                <p>
                  Players: {lobby.value.ownerAddress} vs{" "}
                  {lobby.value.opponentAddress || "Waiting for opponent"}
                </p>
                <p>Status: {lobby.value.active ? "Active" : "Inactive"}</p>

                {!hasOpponent && !isCreator && (
                  <button
                    style={{
                      marginTop: "20px",
                      padding: "8px 16px",
                      backgroundColor: "rgba(0, 255, 0, 0.2)",
                      border: "1px solid white",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleJoinLobby(lobby.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0, 255, 0, 0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0, 255, 0, 0.2)")
                    }
                  >
                    Join Lobby
                  </button>
                )}

                {isCreator && (
                  <button
                    style={{
                      marginTop: "20px",
                      padding: "8px 16px",
                      backgroundColor: "rgba(0, 0, 255, 0.2)",
                      border: "1px solid white",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleGoToGame(lobby.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 255, 0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 255, 0.2)")
                    }
                  >
                    Go to Game
                  </button>
                )}

                {hasOpponent && (
                  <button
                    style={{
                      marginTop: "20px",
                      padding: "8px 16px",
                      backgroundColor: "rgba(255, 165, 0, 0.2)",
                      border: "1px solid white",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleWatchGame(lobby.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 165, 0, 0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 165, 0, 0.2)")
                    }
                  >
                    Watch Game
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, 10%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
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

export default Lobby;
