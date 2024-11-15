import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  tables: {
    Piece: {
      schema: {
        id: "bytes32",
        owner: "address",
        name: "string",
        movementAbility: "string",
        captureAbility: "string",
      },
      key: ["id"],
    },
  },
});
