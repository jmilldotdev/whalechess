import { getBlockscoutTxUrl } from "../lib/blockscout";
import { getActiveChain } from "../lib/config";
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

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Store</h1>
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
          marginTop: "20px",
        }}
      >
        Get Free Pawn
      </button>
    </div>
  );
};

export default StorePage;
