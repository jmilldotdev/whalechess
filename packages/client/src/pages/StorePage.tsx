import { getBlockscoutTxUrl } from "../lib/blockscout";
import { envs, getActiveChain } from "../lib/config";
// import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const StorePage = () => {
  const { address } = useAccount();
  // const {
  //   systemCalls: { givePieceToPlayer },
  // } = useMUD();
  const [showCapsule, setShowCapsule] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCapsule(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // const handleGivePawn = async () => {
  //   if (!address) return;
  //   try {
  //     const tx = await givePieceToPlayer(address, "Pawn", 1);
  //     const explorerUrl = getBlockscoutTxUrl(
  //       getActiveChain().name.toLowerCase(),
  //       tx
  //     );
  //     toast.success("Pawn added to your squad!", {
  //       description: (
  //         <a
  //           href={explorerUrl}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           style={{ color: "#4a90e2", textDecoration: "underline" }}
  //         >
  //           View transaction
  //         </a>
  //       ),
  //       duration: 5000,
  //     });
  //   } catch (error) {
  //     toast.error("Failed to give pawn", {
  //       description:
  //         error instanceof Error ? error.message : "Unknown error occurred",
  //     });
  //   }
  // };

  const handleGeneratePiece = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const response = await fetch(envs.apiBaseUrl + "/generate-piece", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationAddress: address,
          prompt: "Generate a unique cool custom chess piece.",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate piece");

      const data = await response.json();

      const createExplorerUrl = getBlockscoutTxUrl(
        getActiveChain().name.toLowerCase(),
        data.transactionHash
      );

      const giveExplorerUrl = getBlockscoutTxUrl(
        getActiveChain().name.toLowerCase(),
        data.givePieceTransactionHash
      );

      toast.success("New piece created and added to your squad!", {
        description: (
          <div>
            <a
              href={createExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#4a90e2",
                textDecoration: "underline",
                display: "block",
              }}
            >
              View create transaction
            </a>
            <a
              href={giveExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#4a90e2",
                textDecoration: "underline",
                display: "block",
              }}
            >
              View transfer transaction
            </a>
          </div>
        ),
        duration: 5000,
      });
    } catch (error) {
      toast.error("Failed to generate piece", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
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
          src="/chess/store.png"
          alt="Store Background"
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            opacity: 0,
            animation: showCapsule ? "fadeInOverlay 1s ease forwards" : "none",
          }}
        />

        {showCapsule && (
          <>
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0,
                animation: "fadeInCapsule 1s ease forwards",
                width: "300px",
                filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))",
              }}
            >
              <img
                src="/chess/capsule.png"
                alt="Store Capsule"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: "65%",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                justifyContent: "center",
                opacity: 0,
                animation: "fadeInCapsule 1s ease forwards",
              }}
            >
              {/* Commented out free pawn button
              <button
                onClick={handleGivePawn}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Get Free Pawn
              </button>
              */}

              <button
                onClick={handleGeneratePiece}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Generate New Piece
              </button>
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes fadeInOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInCapsule {
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

export default StorePage;
