// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { PieceTypes } from "../src/libraries/PieceTypes.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    StoreSwitch.setStoreAddress(worldAddress);

    // First broadcast session for deployer
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    IWorld world = IWorld(worldAddress);
    address deployer = vm.addr(deployerPrivateKey);
    console.log("Deployer address:", deployer);

    console.log("Creating pieces...");
    world.app__createPiece("Pawn", "/chess/metal/pawn.png", "n1", "n1e1,n1w1", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Knight", "/chess/metal/knight.png", "n1e1,n1w1,e1n1,e1s1,w1n1,w1s1", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Bishop", "/chess/metal/bishop.png", "n*e*,n*w*,s*e*,s*w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Rook", "/chess/metal/rook.png", "n*,s*,e*,w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Queen", "/chess/metal/queen.png", "n*,s*,e*,w*,n*e*,n*w*,s*e*,s*w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("King", "/chess/metal/king.png", "n1,s1,e1,w1", "", new PieceTypes.ComponentData[](0));

    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Pawn")), 8);    // 8 pawns
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Knight")), 2);
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Bishop")), 2);
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Rook")), 2);     // 2 rooks
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Queen")), 1);
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("King")), 1);

    console.log("Creating squad for player:", deployer);
    PieceTypes.SquadPieceData[] memory pieces = new PieceTypes.SquadPieceData[](16);
    pieces[0] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Rook")), 0, 0);
    pieces[1] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Knight")), 1, 0);
    pieces[2] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Bishop")), 2, 0);
    pieces[3] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Queen")), 3, 0);
    pieces[4] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("King")), 4, 0);
    pieces[5] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Bishop")), 5, 0);
    pieces[6] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Knight")), 6, 0);
    pieces[7] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Rook")), 7, 0);
    for (uint256 i = 0; i < 8; i++) {
      pieces[8 + i] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Pawn")), i, 1);
    }

    bytes32 squadId = world.app__createSquad("Main Squad", pieces);
    console.log("Squad created with ID:", vm.toString(squadId));

    console.log("Creating lobby for player:", deployer);
    bytes32 lobbyId = world.app__createLobby(squadId);
    console.log("Lobby created with ID:", vm.toString(lobbyId));
    vm.stopBroadcast();

    // Second broadcast session for player1
    uint256 player1PrivateKey = vm.envUint("PLAYER1_PRIVATE_KEY");
    vm.startBroadcast(player1PrivateKey);

    address player1 = vm.addr(player1PrivateKey);
    console.log("Player 1 address:", player1);

    world.app__givePieceToPlayer(player1, keccak256(abi.encodePacked("Pawn")), 8);    // 8 pawns
    world.app__givePieceToPlayer(player1, keccak256(abi.encodePacked("Knight")), 2);
    world.app__givePieceToPlayer(player1, keccak256(abi.encodePacked("Bishop")), 2);
    world.app__givePieceToPlayer(player1, keccak256(abi.encodePacked("Rook")), 2);     // 2 rooks
    world.app__givePieceToPlayer(player1, keccak256(abi.encodePacked("Queen")), 1);
    world.app__givePieceToPlayer(player1, keccak256(abi.encodePacked("King")), 1);

    console.log("Creating squad for player:", player1);
    PieceTypes.SquadPieceData[] memory pieces2 = new PieceTypes.SquadPieceData[](16);
    pieces2[0] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Rook")), 0, 0);
    pieces2[1] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Knight")), 1, 0);
    pieces2[2] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Bishop")), 2, 0);
    pieces2[3] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Queen")), 3, 0);
    pieces2[4] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("King")), 4, 0);
    pieces2[5] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Bishop")), 5, 0);
    pieces2[6] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Knight")), 6, 0);
    pieces2[7] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Rook")), 7, 0);
    for (uint256 i = 0; i < 8; i++) {
      pieces2[8 + i] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Pawn")), i, 1);
    }

    bytes32 squadId2 = world.app__createSquad("Main Squad", pieces2);
    console.log("Squad created with ID:", vm.toString(squadId2));

    console.log("Creating lobby for player:", player1);
    bytes32 lobbyId2 = world.app__createLobby(squadId2);
    console.log("Lobby created with ID:", vm.toString(lobbyId2));
    vm.stopBroadcast();
  }
}