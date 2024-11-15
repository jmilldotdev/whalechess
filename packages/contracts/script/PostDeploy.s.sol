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
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    IWorld world = IWorld(worldAddress);
    address deployer = vm.addr(deployerPrivateKey);
    console.log("Deployer address:", deployer);

    // Create all piece types
    bytes32 pawnId = keccak256(abi.encodePacked("Pawn"));
    bytes32 rookId = keccak256(abi.encodePacked("Rook"));
    
    console.log("Creating pieces...");
    world.app__createPiece("Pawn", "n1", "n1e1,n1w1", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Knight", "n1e1,n1w1,e1n1,e1s1,w1n1,w1s1", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Bishop", "n*e*,n*w*,s*e*,s*w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Rook", "n*,s*,e*,w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("Queen", "n*,s*,e*,w*,n*e*,n*w*,s*e*,s*w*", "", new PieceTypes.ComponentData[](0));
    world.app__createPiece("King", "n1,s1,e1,w1", "", new PieceTypes.ComponentData[](0));

    // Create some custom pieces
    PieceTypes.ComponentData[] memory drunkenKnightComponents = new PieceTypes.ComponentData[](1);
    drunkenKnightComponents[0] = PieceTypes.ComponentData({
      name: "DrunkenModifier",
      value: abi.encode(50)
    });
    world.app__createPiece("Drunken Knight", "n1e1,n1w1,e1n1,e1s1,w1n1,w1s1", "", drunkenKnightComponents);

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
    bytes32 squadId = world.app__createSquad("Standard Chess");
    console.log("Squad created with ID:", vm.toString(squadId));

    world.app__addPieceToSquad(squadId, rookId, 0, 0);
    world.app__addPieceToSquad(squadId, keccak256(abi.encodePacked("Knight")), 1, 0);
    world.app__addPieceToSquad(squadId, keccak256(abi.encodePacked("Bishop")), 2, 0);
    world.app__addPieceToSquad(squadId, keccak256(abi.encodePacked("Queen")), 3, 0);
    world.app__addPieceToSquad(squadId, keccak256(abi.encodePacked("King")), 4, 0);
    world.app__addPieceToSquad(squadId, keccak256(abi.encodePacked("Bishop")), 5, 0);
    world.app__addPieceToSquad(squadId, keccak256(abi.encodePacked("Drunken Knight")), 6, 0);
    world.app__addPieceToSquad(squadId, rookId, 7, 0);

    world.app__addPieceToSquad(squadId, pawnId, 0, 1);
    world.app__addPieceToSquad(squadId, pawnId, 1, 1);
    world.app__addPieceToSquad(squadId, pawnId, 2, 1);
    world.app__addPieceToSquad(squadId, pawnId, 3, 1);
    world.app__addPieceToSquad(squadId, pawnId, 4, 1);
    world.app__addPieceToSquad(squadId, pawnId, 5, 1);
    world.app__addPieceToSquad(squadId, pawnId, 6, 1);
    world.app__addPieceToSquad(squadId, pawnId, 7, 1);

    vm.stopBroadcast();
  }
}