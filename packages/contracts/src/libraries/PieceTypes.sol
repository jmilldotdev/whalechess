// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

library PieceTypes {
    struct ComponentData {
        string name;
        bytes value;
    }

    struct SquadPieceData {
        bytes32 pieceId;
        uint256 x;
        uint256 y;
    }
}