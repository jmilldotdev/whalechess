import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// import { PiecesCollection } from "../components/PiecesCollection";
import { useMUD } from "../MUDContext";
type ChessPiece = {
  isWhite: boolean;
  piece: string | null;
  id?: string;
  image: string;
};

type CollectionPiece = {
  id: string;
  piece: string;
  image: string;
  quantity: number;
};

// Add new type for piece entities
type PieceEntity = {
  id: string;
  fields: {
    name: string;
    image: string;
    captureAbility: string;
    movementAbility: string;
    id: string;
  };
};

export const Squad = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const {
    systemCalls: { createSquad },
    network: { tables, useStore },
  } = useMUD();

  const getRecords = useStore((state) => state.getRecords);

  const pieceEntities = useMemo(() => {
    return Object.values(getRecords(tables.Piece));
  }, [getRecords, tables.Piece]);
  console.log("pieceEntities", pieceEntities);

  const playerPieceEntities = useMemo(
    () =>
      Object.values(getRecords(tables.PlayerPiece)).filter(
        (entity) =>
          entity.value.ownerAddress.toLowerCase() === address?.toLowerCase()
      ),
    [getRecords, tables.PlayerPiece, address]
  );

  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [boardPieces, setBoardPieces] = useState<ChessPiece[][]>([]);
  const [collection, setCollection] = useState<CollectionPiece[]>([]);

  useEffect(() => {
    const calculateBoardSize = () => {
      const height = window.innerHeight;
      const size = Math.min(height * 0.8, window.innerWidth * 0.4);
      setBoardSize({ width: size, height: size });
    };

    calculateBoardSize();
    window.addEventListener("resize", calculateBoardSize);
    return () => window.removeEventListener("resize", calculateBoardSize);
  }, []);

  // Initialize collection from pieceEntities
  useEffect(() => {
    if (pieceEntities.length > 0) {
      const newCollection = pieceEntities.map((entity: PieceEntity) => {
        const playerPiece = playerPieceEntities.find(
          (p) => p.value.pieceId === entity.fields.id
        );
        return {
          id: entity.id,
          piece: entity.fields.name.toLowerCase(),
          image: entity.fields.image,
          quantity: playerPiece
            ? Number(playerPiece.value.quantity.toString())
            : 0,
        };
      });

      setCollection(newCollection);
    }
  }, [pieceEntities, playerPieceEntities]);

  // Initialize empty board
  useEffect(() => {
    const initialBoard: ChessPiece[][] = Array(2)
      .fill(null)
      .map((_, rowIndex) =>
        Array(8)
          .fill(null)
          .map((_, j) => {
            const i = rowIndex + 6;
            const isWhite = (i + j) % 2 === 0;
            return {
              isWhite,
              piece: null,
              id: undefined,
              image: "",
            };
          })
      );
    setBoardPieces(initialBoard);
  }, [pieceEntities]);

  const handleDragStart = (
    e: React.DragEvent,
    fromBoard: boolean,
    piece: string,
    id: string,
    rowIndex?: number,
    colIndex?: number
  ) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        fromBoard,
        piece,
        id,
        rowIndex,
        colIndex,
      })
    );
  };

  const handleDrop = (
    e: React.DragEvent,
    toBoard: boolean,
    targetRow?: number,
    targetCol?: number
  ) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    const { fromBoard, id, rowIndex: sourceRow, colIndex: sourceCol } = data;

    if (fromBoard && toBoard) {
      // Swap pieces on board while preserving tile colors
      const newBoard = [...boardPieces];
      const sourcePiece = newBoard[sourceRow][sourceCol];
      const targetPiece = newBoard[targetRow!][targetCol!];

      // Update source square
      newBoard[sourceRow][sourceCol] = {
        ...sourcePiece,
        piece: targetPiece.piece,
        id: targetPiece.id,
        image: targetPiece.image,
      };

      // Update target square
      newBoard[targetRow!][targetCol!] = {
        ...targetPiece,
        piece: sourcePiece.piece,
        id: sourcePiece.id,
        image: sourcePiece.image,
      };

      setBoardPieces(newBoard);
    } else if (fromBoard && !toBoard) {
      // Move from board to collection
      const newBoard = [...boardPieces];
      const movedPiece = { ...newBoard[sourceRow][sourceCol] };
      newBoard[sourceRow][sourceCol] = {
        ...movedPiece,
        piece: null,
        id: undefined,
        image: "",
      };
      setBoardPieces(newBoard);

      // Update collection quantity
      setCollection((prevCollection) =>
        prevCollection.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else if (!fromBoard && toBoard) {
      // Move from collection to board
      const newBoard = [...boardPieces];

      // Find the piece entity to get the correct image path
      const pieceEntity = pieceEntities.find((p: PieceEntity) => p.id === id);

      // Update board with collection piece
      newBoard[targetRow!][targetCol!] = {
        ...newBoard[targetRow!][targetCol!],
        piece: pieceEntity?.fields.name.toLowerCase() || "",
        id: id,
        image: pieceEntity?.fields.image || "",
      };
      setBoardPieces(newBoard);

      // Update collection quantity
      setCollection((prevCollection) =>
        prevCollection.map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    }
  };

  const handleSaveSquad = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      // Validate board has at least one piece
      const pieces = boardPieces
        .flatMap((row, y) =>
          row.map((square, x) => ({
            x,
            y,
            piece: square.piece,
            id: square.id,
          }))
        )
        .filter((square) => square.piece !== null);

      if (pieces.length === 0) {
        toast.error("Please place at least one piece on the board");
        return;
      }

      // Format pieces for contract call
      const squadPieces = pieces.map((p) => ({
        pieceId: p.id!.split(":")[1],
        x: p.x,
        y: p.y,
      }));

      // Create squad name using timestamp to ensure uniqueness
      const squadName = `Squad_${Date.now()}`;

      await createSquad(squadName, squadPieces);

      toast.success("Squad saved successfully!");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Failed to save squad:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save squad"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden", // Prevents scrolling
        position: "fixed", // Ensures it stays fixed even if content overflows
        top: 0,
        left: 0,
      }}
    >
      {/* Left half - Chessboard */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/chess/bg2.jpg)",
          backgroundSize: "cover",
          overflow: "hidden", // Prevents scrolling within this container
        }}
      >
        <div
          style={{
            width: boardSize.width,
            height: boardSize.height / 4, // Adjusted height for 2 rows
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            border: "2px solid #333",
            background: "linear-gradient(to bottom right, #8B4513, #D2691E)",
            boxShadow: "0 0 10px 2px rgba(255, 215, 0, 0.8)",
          }}
        >
          {boardPieces.map((row, i) =>
            row.map((square, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  width: "100%",
                  paddingTop: "100%",
                  position: "relative",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, true, i, j)}
              >
                <img
                  src={square.isWhite ? "/chess/white.png" : "/chess/blue.png"}
                  alt={`Tile ${i}-${j}`}
                  draggable={false}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {square.piece && (
                  <img
                    src={square.image}
                    alt={`${square.piece}`}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, true, square.piece!, square.id!, i, j)
                    }
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      cursor: "grab",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right half - Collection */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#2a2a2a",
          padding: "2rem",
          overflow: "hidden",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/chess/bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, false)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src="/texts/collection.png"
            alt="Squad"
            style={{
              width: "50%",
              objectFit: "contain",
              display: "block",
            }}
          />
          <img
            src={isSaving ? "/buttons/saving.png" : "/buttons/save.png"}
            alt={isSaving ? "Saving..." : "Save"}
            style={{
              height: "50px",
              objectFit: "contain",
              cursor: isSaving ? "not-allowed" : "pointer",
              marginTop: "15px",
              filter: isSaving
                ? "brightness(0.7)"
                : "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))",
              transition: "filter 0.3s ease",
              opacity: isSaving ? 0.7 : 1,
            }}
            onClick={handleSaveSquad}
            onMouseOver={(e) => {
              if (!isSaving) {
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 1))";
              }
            }}
            onMouseOut={(e) => {
              if (!isSaving) {
                e.currentTarget.style.filter =
                  "drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))";
              }
            }}
          />
        </div>

        {/* Collection pieces container */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {collection.map((item) => (
            <div
              key={item.id}
              style={{
                width: "100px",
                height: "100px",
                border: "2px solid #gold",
                borderRadius: "8px",
                position: "relative",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                opacity: item.quantity === 0 ? 0.5 : 1,
              }}
            >
              <img
                src={
                  pieceEntities.find((p: PieceEntity) => p.id === item.id)
                    ?.fields.image || ""
                }
                alt={item.piece}
                draggable={item.quantity > 0}
                onDragStart={(e) =>
                  item.quantity > 0 &&
                  handleDragStart(e, false, item.piece, item.id)
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: item.quantity > 0 ? "grab" : "not-allowed",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  fontSize: "0.8rem",
                }}
              >
                Quantity: {item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
