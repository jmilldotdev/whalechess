import { getBlockscoutTxUrl } from "../lib/blockscout";
import { envs, getActiveChain } from "../lib/config";
import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";
import { toast } from "sonner";

const StorePage = () => {
  const { address } = useAccount();
  const {
    systemCalls: { givePieceToPlayer },
  } = useMUD();

  const handleGivePawn = async () => {
    if (!address) return;
    try {
      const tx = await givePieceToPlayer(address, "Pawn", 1);
      const explorerUrl = getBlockscoutTxUrl(
        getActiveChain().name.toLowerCase(),
        tx
      );
      toast.success("Pawn added to your squad!", {
        description: (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4a90e2", textDecoration: "underline" }}
          >
            View transaction
          </a>
        ),
        duration: 5000,
      });
    } catch (error) {
      toast.error("Failed to give pawn", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

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
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>Store</h1>
      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
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
    </div>
  );
};

export default StorePage;
