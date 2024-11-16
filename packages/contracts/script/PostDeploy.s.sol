// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { PieceTypes } from "../src/libraries/PieceTypes.sol";
import { SquadSystem } from "../src/systems/SquadSystem.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    StoreSwitch.setStoreAddress(worldAddress);
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    IWorld world = IWorld(worldAddress);
    address deployer = vm.addr(deployerPrivateKey);
    console.log("Deployer address:", deployer);

    // Create all piece types
    bytes32 pawnId = keccak256(abi.encodePacked("Pawn"));
    bytes32 rookId = keccak256(abi.encodePacked("Rook"));
    
    console.log("Creating pieces...");
    world.app__createPiece("Pawn", "/chess/metal/pawn.png", "n1", "n1e1,n1w1", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Knight", "/chess/metal/knight.png", "n1e1,n1w1,e1n1,e1s1,w1n1,w1s1", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Bishop", "/chess/metal/bishop.png", "n*e*,n*w*,s*e*,s*w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Rook", "/chess/metal/rook.png", "n*,s*,e*,w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Queen", "/chess/metal/queen.png", "n*,s*,e*,w*,n*e*,n*w*,s*e*,s*w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("King", "/chess/metal/king.png", "n1,s1,e1,w1", "", new PieceTypes.ComponentData[](0));

    console.log("Giving pieces to deployer...");
    // Give pieces to deployer (standard chess set)
    world.app__givePieceToPlayer(deployer, pawnId, 8);    // 8 pawns
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Knight")), 2);
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Bishop")), 2);
    world.app__givePieceToPlayer(deployer, rookId, 2);     // 2 rooks
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Queen")), 1);
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("King")), 1);
    world.app__givePieceToPlayer(deployer, keccak256(abi.encodePacked("Drunken Knight")), 1);

    console.log("Creating squad...");
    // Create a standard chess squad
    PieceTypes.SquadPieceData[] memory pieces = new PieceTypes.SquadPieceData[](16);
    pieces[0] = PieceTypes.SquadPieceData(rookId, 0, 0);
    pieces[1] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Knight")), 1, 0);
    pieces[2] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Bishop")), 2, 0);
    pieces[3] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Queen")), 3, 0);
    pieces[4] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("King")), 4, 0);
    pieces[5] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Bishop")), 5, 0);
    pieces[6] = PieceTypes.SquadPieceData(keccak256(abi.encodePacked("Drunken Knight")), 6, 0);
    pieces[7] = PieceTypes.SquadPieceData(rookId, 7, 0);
    for (uint256 i = 0; i < 8; i++) {
      pieces[8 + i] = PieceTypes.SquadPieceData(pawnId, i, 1);
    }

    bytes32 squadId = world.app__createSquad("Main Squad", pieces);
    console.log("Squad created with ID:", vm.toString(squadId));

    console.log("Creating lobby...");
    // Create a lobby using the created squad
    bytes32 lobbyId = world.app__createLobby(squadId);
    console.log("Lobby created with ID:", vm.toString(lobbyId));

    vm.stopBroadcast();
  }
}