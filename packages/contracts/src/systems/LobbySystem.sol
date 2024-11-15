// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import { System } from "@latticexyz/world/src/System.sol";
import { Lobby, LobbyData, Squad, SquadData, GamePiece, GamePieceData, SquadPiece, SquadPieceData } from "../codegen/index.sol";
import { GameResult } from "../codegen/common.sol";

contract LobbySystem is System {
    error LobbyNotFound();
    error LobbyAlreadyActive();
    error LobbyIsActive();
    error NotLobbyOwner();
    error LobbySquadNotFound();
    error LobbySquadNotOwned();
    error LobbyJoinInProgress();

    bool private joinLocked;
    
    modifier noReentrantJoin() {
        require(!joinLocked, "Join in progress");
        joinLocked = true;
        _;
        joinLocked = false;
    }

    function createLobby(bytes32 squadId) public returns (bytes32) {
        // Verify squad exists and is owned by sender
        SquadData memory squad = Squad.get(squadId);
        if (!squad.active) revert LobbySquadNotFound();
        if (squad.ownerAddress != _msgSender()) revert LobbySquadNotOwned();

        bytes32 lobbyId = keccak256(abi.encodePacked(block.timestamp, _msgSender()));
        
        Lobby.set(
            lobbyId,
            LobbyData({
                ownerAddress: _msgSender(),
                ownerSquadId: squadId,
                opponentAddress: address(0),
                opponentSquadId: bytes32(0),
                createdAt: block.timestamp,
                active: true,
                result: GameResult.NONE,
                activePlayerAddress: address(0)
            })
        );

        return lobbyId;
    }

    function deleteLobby(bytes32 lobbyId) public {
        LobbyData memory lobby = Lobby.get(lobbyId);

        if (lobby.ownerAddress != _msgSender()) revert NotLobbyOwner();
        if (lobby.active && lobby.result != GameResult.NONE) revert LobbyIsActive();

        Lobby.set(lobbyId, LobbyData({
            ownerAddress: lobby.ownerAddress,
            ownerSquadId: lobby.ownerSquadId,
            opponentAddress: lobby.opponentAddress,
            opponentSquadId: lobby.opponentSquadId,
            createdAt: lobby.createdAt,
            active: false,
            result: lobby.result,
            activePlayerAddress: address(0)
        }));
    }

    function joinLobby(bytes32 lobbyId, bytes32 squadId) public noReentrantJoin {
        // Verify squad exists and is owned by sender
        SquadData memory squad = Squad.get(squadId);
        if (!squad.active) revert LobbySquadNotFound();
        if (squad.ownerAddress != _msgSender()) revert LobbySquadNotOwned();

        // Get lobby data
        LobbyData memory lobby = Lobby.get(lobbyId);

        // Verify lobby state
        if (!lobby.active) revert LobbyNotFound();
        if (lobby.opponentAddress != address(0)) revert LobbyAlreadyActive();
        if (lobby.ownerAddress == _msgSender()) revert NotLobbyOwner();

        // Update lobby with opponent info
        Lobby.set(lobbyId, LobbyData({
            ownerAddress: lobby.ownerAddress,
            ownerSquadId: lobby.ownerSquadId,
            opponentAddress: _msgSender(),
            opponentSquadId: squadId,
            createdAt: lobby.createdAt,
            active: lobby.active,
            result: lobby.result,
            activePlayerAddress: lobby.ownerAddress
        }));
    }
}