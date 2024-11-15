// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { GamePiece, GamePieceData, Lobby, LobbyData } from "../codegen/index.sol";
import { GameResult } from "../codegen/common.sol";

contract GameSystem is System {
    error GameLobbyNotFound();
    error NotActivePlayer();
    error GameNotLobbyOwner();
    error InvalidMove();
    error GameNotActive();

    function proposeMove(
        bytes32 lobbyId,
        bytes32 pieceId,
        uint256 newX,
        uint256 newY
    ) public {
        LobbyData memory lobby = Lobby.get(lobbyId);
        if (!lobby.active || lobby.result != GameResult.NONE) revert GameNotActive();
        if (lobby.activePlayerAddress != _msgSender()) revert NotActivePlayer();

        // Update piece position
        GamePieceData memory movingPiece = GamePiece.get(lobbyId, pieceId);
        
        // Check if there's a piece at the destination and capture it
        bytes32 targetPieceId = keccak256(abi.encodePacked(lobbyId, newX, newY));
        GamePieceData memory targetPiece = GamePiece.get(lobbyId, targetPieceId);
        
        if (targetPiece.xPosition == newX && targetPiece.yPosition == newY && !targetPiece.captured) {
            // Capture the piece
            GamePiece.set(
                lobbyId,
                targetPieceId,
                GamePieceData({
                    xPosition: newX,
                    yPosition: newY,
                    captured: true
                })
            );
        }

        // Move the piece
        GamePiece.set(
            lobbyId,
            pieceId,
            GamePieceData({
                xPosition: newX,
                yPosition: newY,
                captured: false
            })
        );

        // Switch active player
        address nextPlayer = lobby.activePlayerAddress == lobby.ownerAddress 
            ? lobby.opponentAddress 
            : lobby.ownerAddress;

        Lobby.set(
            lobbyId,
            LobbyData({
                ownerAddress: lobby.ownerAddress,
                ownerSquadId: lobby.ownerSquadId,
                opponentAddress: lobby.opponentAddress,
                opponentSquadId: lobby.opponentSquadId,
                createdAt: lobby.createdAt,
                active: true,
                result: GameResult.NONE,
                activePlayerAddress: nextPlayer
            })
        );
    }

    function declareWin(bytes32 lobbyId) public {
        LobbyData memory lobby = Lobby.get(lobbyId);
        
        if (lobby.ownerAddress != _msgSender()) revert GameNotLobbyOwner();
        if (!lobby.active || lobby.result != GameResult.NONE) revert GameNotActive();

        Lobby.set(
            lobbyId,
            LobbyData({
                ownerAddress: lobby.ownerAddress,
                ownerSquadId: lobby.ownerSquadId,
                opponentAddress: lobby.opponentAddress,
                opponentSquadId: lobby.opponentSquadId,
                createdAt: lobby.createdAt,
                active: false,
                result: GameResult.WIN,
                activePlayerAddress: lobby.activePlayerAddress
            })
        );
    }

    function declareLoss(bytes32 lobbyId) public {
        LobbyData memory lobby = Lobby.get(lobbyId);
        
        if (lobby.ownerAddress != _msgSender()) revert GameNotLobbyOwner();
        if (!lobby.active || lobby.result != GameResult.NONE) revert GameNotActive();

        Lobby.set(
            lobbyId,
            LobbyData({
                ownerAddress: lobby.ownerAddress,
                ownerSquadId: lobby.ownerSquadId,
                opponentAddress: lobby.opponentAddress,
                opponentSquadId: lobby.opponentSquadId,
                createdAt: lobby.createdAt,
                active: false,
                result: GameResult.LOSS,
                activePlayerAddress: lobby.activePlayerAddress
            })
        );
    }

    function declareDraw(bytes32 lobbyId) public {
        LobbyData memory lobby = Lobby.get(lobbyId);
        
        if (lobby.ownerAddress != _msgSender()) revert GameNotLobbyOwner();
        if (!lobby.active || lobby.result != GameResult.NONE) revert GameNotActive();

        Lobby.set(
            lobbyId,
            LobbyData({
                ownerAddress: lobby.ownerAddress,
                ownerSquadId: lobby.ownerSquadId,
                opponentAddress: lobby.opponentAddress,
                opponentSquadId: lobby.opponentSquadId,
                createdAt: lobby.createdAt,
                active: false,
                result: GameResult.DRAW,
                activePlayerAddress: lobby.activePlayerAddress
            })
        );
    }
}
