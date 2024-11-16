import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";

export function PiecesCollection() {
  const { address } = useAccount();
  const {
    network: { tables, useStore },
  } = useMUD();

  // Query all pieces owned by the current player
  const pieceEntities = useStore((state) =>
    Object.values(state.getRecords(tables.Piece))
  );
  const playerPieceEntities = useStore((state) =>
    Object.values(state.getRecords(tables.PlayerPiece)).filter(
      (entity) =>
        entity.value.ownerAddress.toLowerCase() === address?.toLowerCase()
    )
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        My Pieces
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playerPieceEntities.map((entity) => {
          const pieceData = pieceEntities.find(
            (piece) => piece.fields.id === entity.value.pieceId
          );
          console.log(pieceData);

          return (
            <div
              key={entity.value.pieceId}
              className="bg-white bg-opacity-80 border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="font-semibold text-lg text-center mb-2">
                {pieceData?.value.name}
              </h3>
              <img src={pieceData?.fields.image} alt={pieceData?.value.name} />
              <div className="mt-2 text-sm text-gray-700">
                <p className="mt-2">
                  Quantity: {entity.value.quantity.toString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {playerPieceEntities.length === 0 && (
        <p className="text-gray-500 text-center mt-4">
          You don&apos;t have any pieces yet.
        </p>
      )}
    </div>
  );
}
