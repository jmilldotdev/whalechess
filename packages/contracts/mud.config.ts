import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  tables: {
    CapturableAbility: "string",
    DrunkenModifier: "uint256",
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
    Squad: {
      schema: {
        id: "bytes32",
        ownerAddress: "address",
        createdAt: "uint256",
        active: "bool",
        name: "string",
      },
      key: ["id"],
    },
    SquadPiece: {
      schema: {
        id: "bytes32",
        squadId: "bytes32",
        pieceId: "bytes32",
        startingXPosition: "uint256",
        startingYPosition: "uint256",
      },
      key: ["id"],
    },
  },
});
