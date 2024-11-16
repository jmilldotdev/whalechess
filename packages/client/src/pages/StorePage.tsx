import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";

const StorePage = () => {
  const { address } = useAccount();
  const {
    systemCalls: { givePieceToPlayer },
  } = useMUD();

  const handleGivePawn = async () => {
    if (!address) return;
    try {
      await givePieceToPlayer(address, "Pawn", 1);
      console.log("Gave pawn to player!");
    } catch (error) {
      console.error("Error giving pawn:", error);
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
