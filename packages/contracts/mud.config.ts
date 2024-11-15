import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  enums: {
    GameResult: ["NONE", "WIN", "LOSS", "DRAW"],
  },
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
    Lobby: {
      schema: {
        id: "bytes32",
        ownerAddress: "address",
        ownerSquadId: "bytes32",
        opponentAddress: "address",
        opponentSquadId: "bytes32",
        createdAt: "uint256",
        active: "bool",
        result: "GameResult",
        activePlayerAddress: "address",
      },
      key: ["id"],
    },
    GamePiece: {
      schema: {
        gameId: "bytes32",
        squadPieceId: "bytes32",
        xPosition: "uint256",
        yPosition: "uint256",
        captured: "bool",
      },
      key: ["gameId", "squadPieceId"],
    },
  },
});
