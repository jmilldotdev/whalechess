import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Lobby = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState([
    { id: 1, name: "Grandmaster's Arena", status: "open", players: ["Player 1"] },
    { id: 2, name: "Chess Champions", status: "ongoing", players: ["Alice", "Bob"] },
    { id: 3, name: "Rookie's Challenge", status: "ongoing", players: ["Carol", "Dave"] },
  ]);

  const handleCreateLobby = () => {
    const newLobby = {
      id: lobbies.length + 1,
      name: `Lobby #${lobbies.length + 1}`,
      status: "open",
      players: ["Player 1"],
    };
    setLobbies([...lobbies, newLobby]);
  };

  const handleJoinOrWatch = (lobbyId: number) => {
    navigate(`/lobby/${lobbyId}`);
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

        {/* Create Lobby Button - Moved to separate container */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <button
            onClick={handleCreateLobby}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid white",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          >
            Create New Lobby
          </button>
        </div>

        {/* Lobbies Container */}
        <div
          style={{
            position: "absolute",
            top: "30%",
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
          {lobbies.map((lobby) => (
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
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.1)";
              }}
            >
              <h3 style={{ marginBottom: "15px" }}>{lobby.name}</h3>
              <p>Players: {lobby.players.join(" vs ")}</p>
              <p>Status: {lobby.status}</p>
              
              <button
                style={{
                  marginTop: "20px",
                  padding: "8px 16px",
                  backgroundColor: lobby.status === "open" ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 0, 255, 0.2)",
                  border: "1px solid white",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleJoinOrWatch(lobby.id)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = lobby.status === "open" ? "rgba(0, 255, 0, 0.3)" : "rgba(0, 0, 255, 0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = lobby.status === "open" ? "rgba(0, 255, 0, 0.2)" : "rgba(0, 0, 255, 0.2)"}
              >
                {lobby.status === "open" ? "Join the match" : "Watch the match"}
              </button>
            </div>
          ))}
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