import { useEntityQuery } from "@latticexyz/react";
import { Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { useMUD } from "../MUDContext";
import { useAccount } from "wagmi";

export function PiecesCollection() {
  const { address } = useAccount();
  const {
    components: { PlayerPiece, Piece },
  } = useMUD();

  // Query all pieces owned by the current player
  const playerPieceEntities = useEntityQuery([
    Has(PlayerPiece),
    HasValue(PlayerPiece, {
      ownerAddress: address?.toLowerCase(),
    }),
  ]);
  console.log(playerPieceEntities);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Pieces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playerPieceEntities.map((entity) => {
          const playerPieceData = getComponentValueStrict(PlayerPiece, entity);
          const pieceData = getComponentValueStrict(
            Piece,
            playerPieceData.pieceId
          );

          return (
            <div
              key={entity}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{pieceData.name}</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Movement: {pieceData.movementAbility}</p>
                <p>Capture: {pieceData.captureAbility}</p>
                <p className="mt-2">
                  Quantity: {playerPieceData.quantity.toString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {playerPieceEntities.length === 0 && (
        <p className="text-gray-500 text-center">
          You don&apos;t have any pieces yet.
        </p>
      )}
    </div>
  );
}
