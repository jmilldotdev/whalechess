// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Piece, PlayerPiece, CapturableAbility, DrunkenModifier } from "../codegen/index.sol";
import { PieceTypes } from "../libraries/PieceTypes.sol";
contract PieceSystem is System {

  function createPiece(
    string memory name, 
    string memory image,
    string memory movementAbility, 
    string memory captureAbility,
    PieceTypes.ComponentData[] memory components
  ) public {
    bytes32 id = keccak256(abi.encodePacked(name));

    // Validate inputs
    require(bytes(name).length > 0, "Name cannot be empty");
    
    // Set the base piece data
    Piece.set(
      id,
      name,
      image,
      movementAbility,
      captureAbility
    );

    // Set optional components
    for(uint i = 0; i < components.length; i++) {
      PieceTypes.ComponentData memory component = components[i];
      
      // Handle each component type
      if (keccak256(abi.encodePacked(component.name)) == keccak256(abi.encodePacked("CapturableAbility"))) {
        string memory capturableValue = abi.decode(component.value, (string));
        CapturableAbility.set(id, capturableValue);
      }
      else if (keccak256(abi.encodePacked(component.name)) == keccak256(abi.encodePacked("DrunkenModifier"))) {
        uint256 drunkenValue = abi.decode(component.value, (uint256));
        require(drunkenValue <= 100, "DrunkenModifier must be between 0-100");
        DrunkenModifier.set(id, drunkenValue);
      }
    }
  }

  function givePieceToPlayer(address ownerAddress, bytes32 pieceId, uint256 quantity) public {
    // Get current quantity (if any)
    bytes32 id = keccak256(abi.encodePacked(pieceId, ownerAddress));
    uint256 currentQuantity = PlayerPiece.getQuantity(id);
    
    // Set new quantity (either create or update)
    PlayerPiece.set(
        id,
        pieceId,
        ownerAddress,
        currentQuantity + quantity
    );
  }
}
