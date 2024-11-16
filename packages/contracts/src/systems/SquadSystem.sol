// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Squad, SquadPiece, PlayerPiece } from "../codegen/index.sol";

contract SquadSystem is System {
    function createSquad(string memory name) public returns (bytes32) {

        address owner = _msgSender();
        
        // Validate name
        require(bytes(name).length > 0, "Squad name cannot be empty");

        // Generate squad ID using name and creator's address
        bytes32 squadId = keccak256(abi.encodePacked(name, owner, block.timestamp));

        // Create squad with owner
        Squad.set(
            squadId,  // id
            owner,    // ownerAddress
            block.timestamp, // createdAt
            true,    // active by default
            name     // name
        );

        return squadId;
    }

    function addPieceToSquad(
        bytes32 squadId,
        bytes32 pieceId,
        uint256 x,
        uint256 y
    ) public {
        address player = _msgSender();
        
        // Check squad exists and player owns it
        address squadOwner = Squad.getOwnerAddress(squadId);
        require(squadOwner == player, "Not squad owner");
        
        // Check if player owns the piece
        uint256 ownedQuantity = PlayerPiece.get(pieceId, player);
        require(ownedQuantity > 0, "Piece not owned");

        // Validate position (assuming 8x2 board)
        require(x < 8 && y < 2, "Invalid position");

        // Create unique position ID
        bytes32 id = keccak256(abi.encodePacked(squadId, x, y));

        // Add piece to squad - order must match schema in mud.config.ts
        SquadPiece.set(
            id,             // id
            squadId,        // squadId
            pieceId,        // pieceId
            x,             // startingXPosition
            y              // startingYPosition
        );
    }

    function removePieceFromSquad(
        bytes32 squadId,
        uint256 x,
        uint256 y
    ) public {
        address player = _msgSender();
        
        // Check squad exists and player owns it
        address squadOwner = Squad.getOwnerAddress(squadId);
        require(squadOwner == player, "Not squad owner");

        // Create position ID
        bytes32 id = keccak256(abi.encodePacked(squadId, x, y));

        // Remove piece from squad
        SquadPiece.deleteRecord(id);
    }
}