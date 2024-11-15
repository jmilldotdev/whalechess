// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Squad, SquadPiece, PlayerPiece } from "../codegen/index.sol";

contract SquadSystem is System {
    error SquadNameEmpty();
    error PieceNotOwned();
    error PieceNotInSquad();
    error InvalidPosition();
    error NotSquadOwner();
    error SquadNotFound();

    function createSquad(string memory name) public returns (bytes32) {
        address owner = _msgSender();
        
        // Validate name
        if (bytes(name).length == 0) revert SquadNameEmpty();

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
        if (squadOwner != player) revert NotSquadOwner();
        
        // Check if player owns the piece
        uint256 ownedQuantity = PlayerPiece.get(pieceId, player);
        if (ownedQuantity == 0) revert PieceNotOwned();

        // Validate position (assuming 8x2 board)
        if (x >= 8 || y >= 2) revert InvalidPosition();

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
        if (squadOwner != player) revert NotSquadOwner();

        // Create position ID
        bytes32 id = keccak256(abi.encodePacked(squadId, x, y));

        // Remove piece from squad
        SquadPiece.deleteRecord(id);
    }
}