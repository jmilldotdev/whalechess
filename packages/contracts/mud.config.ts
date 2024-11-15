import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  tables: {
    Piece: {
      schema: {
        id: "bytes32",
        name: "string",
        movementAbility: "string",
        captureAbility: "string",
      },
      key: ["id"],
    },
    PlayerPiece: {
      schema: {
        pieceId: "bytes32",
        ownerAddress: "address",
        quantity: "uint256",
      },
      key: ["pieceId", "ownerAddress"],
    },
  },
});
