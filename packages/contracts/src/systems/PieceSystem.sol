// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Piece, PlayerPiece } from "../codegen/index.sol";

contract PieceSystem is System {
  function createPiece(string memory name, string memory movementAbility, string memory captureAbility) public {
    bytes32 id = keccak256(abi.encodePacked(name));

    // Validate inputs
    require(bytes(name).length > 0, "Name cannot be empty");
    
    // Set the piece data in the Piece table
    Piece.set(
      id,
      name, // name
      movementAbility, // movementAbility
      captureAbility // captureAbility
    );
  }

  function givePieceToPlayer(address ownerAddress, bytes32 pieceId, uint256 quantity) public {
    // Get current quantity (if any)
    uint256 currentQuantity = PlayerPiece.get(pieceId, ownerAddress);
    
    // Set new quantity (either create or update)
    PlayerPiece.set(
        pieceId,
        ownerAddress,
        currentQuantity + quantity
    );
  }
}
