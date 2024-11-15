// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Piece } from "../codegen/index.sol";

contract PieceSystem is System {
  function createPiece(address owner, string memory name, string memory movementAbility, string memory captureAbility) public {
    // Generate a unique ID for the piece using owner address and timestamp
    bytes32 pieceId = keccak256(abi.encodePacked(owner, block.timestamp, name));
    
    // Validate inputs
    require(bytes(name).length > 0, "Name cannot be empty");
    require(bytes(movementAbility).length > 0, "Movement ability cannot be empty");
    require(bytes(captureAbility).length > 0, "Capture ability cannot be empty");
    
    // Set the piece data in the Piece table
    Piece.set(
      pieceId,  // id
      owner,    // owner
      name,     // name
      movementAbility,  // movementAbility 
      captureAbility   // captureAbility
    );
  }
}
