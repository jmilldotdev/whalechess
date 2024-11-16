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
  const [showModal, setShowModal] = useState(false);
  const [generatedPiece, setGeneratedPiece] = useState<{
    imageUrl: string;
    name: string;
    aiResponse: string;
    createExplorerUrl: string;
    giveExplorerUrl: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCapsule(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGenerating, countdown]);

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

    setIsGenerating(true);
    setShowModal(true);
    setCountdown(60);

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

      setGeneratedPiece({
        imageUrl: data.imageUrl,
        name: JSON.parse(data.aiResponse).name,
        aiResponse: data.aiResponse,
        createExplorerUrl,
        giveExplorerUrl,
      });
    } catch (error) {
      toast.error("Failed to generate piece", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      setShowModal(false);
    } finally {
      setIsGenerating(false);
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
                filter:
                  "drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))",
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
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  padding: 0,
                  transition: "filter 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget.firstChild as HTMLElement).style.filter =
                    "drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.8))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.firstChild as HTMLElement).style.filter =
                    "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))";
                }}
              >
                <img
                  src="/texts/getnewpiece.png"
                  alt="Generate New Piece"
                  style={{
                    height: "70px",
                    width: "auto",
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
                    transition: "filter 0.3s ease",
                  }}
                />
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => !isGenerating && setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "90%",
              height: "80vh",
              overflow: "auto",
              position: "relative",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isGenerating ? (
              <div style={{ textAlign: "center" }}>
                <img
                  src="/whalechess.png"
                  alt="Generating"
                  style={{
                    width: "200px",
                    height: "auto",
                    marginBottom: "1rem",
                  }}
                />
                <h2 style={{ color: "white", marginBottom: "1rem" }}>
                  Generating your unique piece...
                </h2>
                <div style={{ color: "#4a90e2", fontSize: "1.5rem" }}>
                  {countdown}s
                </div>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    textAlign: "center",
                    color: "white",
                    marginBottom: "1rem",
                  }}
                >
                  {generatedPiece?.name}
                </h2>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={generatedPiece?.imageUrl}
                    alt="Generated Chess Piece"
                    style={{
                      width: "50%",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                    }}
                  />
                </div>
                <div
                  style={{
                    color: "#ccc",
                    marginBottom: "1rem",
                    padding: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                  }}
                >
                  {generatedPiece?.aiResponse || "No description available"}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <a
                    href={generatedPiece?.createExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#4a90e2",
                      textDecoration: "none",
                      padding: "0.5rem",
                      backgroundColor: "rgba(74, 144, 226, 0.1)",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    View Create Transaction
                  </a>
                  <a
                    href={generatedPiece?.giveExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#4a90e2",
                      textDecoration: "none",
                      padding: "0.5rem",
                      backgroundColor: "rgba(74, 144, 226, 0.1)",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    View Transfer Transaction
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
