// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Squad, SquadPiece, PlayerPiece } from "../codegen/index.sol";
import { PieceTypes } from "../libraries/PieceTypes.sol";

contract SquadSystem is System {
    mapping(address => uint256) private _squadNonce;

    function createSquad(
        string memory name,
        PieceTypes.SquadPieceData[] memory pieces
    ) public returns (bytes32) {
        address owner = _msgSender();
        
        // Validate name
        require(bytes(name).length > 0, "Squad name cannot be empty");

        // Increment the nonce for the owner
        _squadNonce[owner]++;

        // Generate squad ID using name, creator's address, and nonce
        bytes32 squadId = keccak256(abi.encodePacked(name, owner, _squadNonce[owner]));

        // Create squad with owner
        Squad.set(
            squadId,  // id
            owner,    // ownerAddress
            block.timestamp, // createdAt
            true,    // active by default
            name     // name
        );

        // Add pieces to squad
        for (uint256 i = 0; i < pieces.length; i++) {
            PieceTypes.SquadPieceData memory piece = pieces[i];
            
            // Check if player owns the piece
            bytes32 playerPieceId = keccak256(abi.encodePacked(piece.pieceId, owner));
            uint256 ownedQuantity = PlayerPiece.getQuantity(playerPieceId);
            // require(ownedQuantity > 0, "Piece not owned");

            // Validate position (assuming 8x2 board)
            require(piece.x < 8 && piece.y < 2, "Invalid position");

            // Create unique position ID
            bytes32 id = keccak256(abi.encodePacked(squadId, piece.x, piece.y));

            // Add piece to squad - order must match schema in mud.config.ts
            SquadPiece.set(
                id,             // id
                squadId,        // squadId
                piece.pieceId,  // pieceId
                piece.x,        // startingXPosition
                piece.y         // startingYPosition
            );
        }

        return squadId;
    }
}