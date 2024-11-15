// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { FieldLayout } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema } from "@latticexyz/store/src/Schema.sol";
import { EncodedLengths, EncodedLengthsLib } from "@latticexyz/store/src/EncodedLengths.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";

// Import user types
import { GameResult } from "../common.sol";

struct LobbyData {
  address ownerAddress;
  bytes32 ownerSquadId;
  address opponentAddress;
  bytes32 opponentSquadId;
  uint256 createdAt;
  bool active;
  GameResult result;
}

library Lobby {
  // Hex below is the result of `WorldResourceIdLib.encode({ namespace: "app", name: "Lobby", typeId: RESOURCE_TABLE });`
  ResourceId constant _tableId = ResourceId.wrap(0x746261707000000000000000000000004c6f6262790000000000000000000000);

  FieldLayout constant _fieldLayout =
    FieldLayout.wrap(0x008a070014201420200101000000000000000000000000000000000000000000);

  // Hex-encoded key schema of (bytes32)
  Schema constant _keySchema = Schema.wrap(0x002001005f000000000000000000000000000000000000000000000000000000);
  // Hex-encoded value schema of (address, bytes32, address, bytes32, uint256, bool, uint8)
  Schema constant _valueSchema = Schema.wrap(0x008a0700615f615f1f6000000000000000000000000000000000000000000000);

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "id";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](7);
    fieldNames[0] = "ownerAddress";
    fieldNames[1] = "ownerSquadId";
    fieldNames[2] = "opponentAddress";
    fieldNames[3] = "opponentSquadId";
    fieldNames[4] = "createdAt";
    fieldNames[5] = "active";
    fieldNames[6] = "result";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get ownerAddress.
   */
  function getOwnerAddress(bytes32 id) internal view returns (address ownerAddress) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (address(bytes20(_blob)));
  }

  /**
   * @notice Get ownerAddress.
   */
  function _getOwnerAddress(bytes32 id) internal view returns (address ownerAddress) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (address(bytes20(_blob)));
  }

  /**
   * @notice Set ownerAddress.
   */
  function setOwnerAddress(bytes32 id, address ownerAddress) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((ownerAddress)), _fieldLayout);
  }

  /**
   * @notice Set ownerAddress.
   */
  function _setOwnerAddress(bytes32 id, address ownerAddress) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((ownerAddress)), _fieldLayout);
  }

  /**
   * @notice Get ownerSquadId.
   */
  function getOwnerSquadId(bytes32 id) internal view returns (bytes32 ownerSquadId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (bytes32(_blob));
  }

  /**
   * @notice Get ownerSquadId.
   */
  function _getOwnerSquadId(bytes32 id) internal view returns (bytes32 ownerSquadId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (bytes32(_blob));
  }

  /**
   * @notice Set ownerSquadId.
   */
  function setOwnerSquadId(bytes32 id, bytes32 ownerSquadId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((ownerSquadId)), _fieldLayout);
  }

  /**
   * @notice Set ownerSquadId.
   */
  function _setOwnerSquadId(bytes32 id, bytes32 ownerSquadId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((ownerSquadId)), _fieldLayout);
  }

  /**
   * @notice Get opponentAddress.
   */
  function getOpponentAddress(bytes32 id) internal view returns (address opponentAddress) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (address(bytes20(_blob)));
  }

  /**
   * @notice Get opponentAddress.
   */
  function _getOpponentAddress(bytes32 id) internal view returns (address opponentAddress) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (address(bytes20(_blob)));
  }

  /**
   * @notice Set opponentAddress.
   */
  function setOpponentAddress(bytes32 id, address opponentAddress) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((opponentAddress)), _fieldLayout);
  }

  /**
   * @notice Set opponentAddress.
   */
  function _setOpponentAddress(bytes32 id, address opponentAddress) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((opponentAddress)), _fieldLayout);
  }

  /**
   * @notice Get opponentSquadId.
   */
  function getOpponentSquadId(bytes32 id) internal view returns (bytes32 opponentSquadId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (bytes32(_blob));
  }

  /**
   * @notice Get opponentSquadId.
   */
  function _getOpponentSquadId(bytes32 id) internal view returns (bytes32 opponentSquadId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (bytes32(_blob));
  }

  /**
   * @notice Set opponentSquadId.
   */
  function setOpponentSquadId(bytes32 id, bytes32 opponentSquadId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((opponentSquadId)), _fieldLayout);
  }

  /**
   * @notice Set opponentSquadId.
   */
  function _setOpponentSquadId(bytes32 id, bytes32 opponentSquadId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((opponentSquadId)), _fieldLayout);
  }

  /**
   * @notice Get createdAt.
   */
  function getCreatedAt(bytes32 id) internal view returns (uint256 createdAt) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 4, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get createdAt.
   */
  function _getCreatedAt(bytes32 id) internal view returns (uint256 createdAt) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 4, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set createdAt.
   */
  function setCreatedAt(bytes32 id, uint256 createdAt) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 4, abi.encodePacked((createdAt)), _fieldLayout);
  }

  /**
   * @notice Set createdAt.
   */
  function _setCreatedAt(bytes32 id, uint256 createdAt) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 4, abi.encodePacked((createdAt)), _fieldLayout);
  }

  /**
   * @notice Get active.
   */
  function getActive(bytes32 id) internal view returns (bool active) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 5, _fieldLayout);
    return (_toBool(uint8(bytes1(_blob))));
  }

  /**
   * @notice Get active.
   */
  function _getActive(bytes32 id) internal view returns (bool active) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 5, _fieldLayout);
    return (_toBool(uint8(bytes1(_blob))));
  }

  /**
   * @notice Set active.
   */
  function setActive(bytes32 id, bool active) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 5, abi.encodePacked((active)), _fieldLayout);
  }

  /**
   * @notice Set active.
   */
  function _setActive(bytes32 id, bool active) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 5, abi.encodePacked((active)), _fieldLayout);
  }

  /**
   * @notice Get result.
   */
  function getResult(bytes32 id) internal view returns (GameResult result) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 6, _fieldLayout);
    return GameResult(uint8(bytes1(_blob)));
  }

  /**
   * @notice Get result.
   */
  function _getResult(bytes32 id) internal view returns (GameResult result) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 6, _fieldLayout);
    return GameResult(uint8(bytes1(_blob)));
  }

  /**
   * @notice Set result.
   */
  function setResult(bytes32 id, GameResult result) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 6, abi.encodePacked(uint8(result)), _fieldLayout);
  }

  /**
   * @notice Set result.
   */
  function _setResult(bytes32 id, GameResult result) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setStaticField(_tableId, _keyTuple, 6, abi.encodePacked(uint8(result)), _fieldLayout);
  }

  /**
   * @notice Get the full data.
   */
  function get(bytes32 id) internal view returns (LobbyData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    (bytes memory _staticData, EncodedLengths _encodedLengths, bytes memory _dynamicData) = StoreSwitch.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data.
   */
  function _get(bytes32 id) internal view returns (LobbyData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    (bytes memory _staticData, EncodedLengths _encodedLengths, bytes memory _dynamicData) = StoreCore.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(
    bytes32 id,
    address ownerAddress,
    bytes32 ownerSquadId,
    address opponentAddress,
    bytes32 opponentSquadId,
    uint256 createdAt,
    bool active,
    GameResult result
  ) internal {
    bytes memory _staticData = encodeStatic(
      ownerAddress,
      ownerSquadId,
      opponentAddress,
      opponentSquadId,
      createdAt,
      active,
      result
    );

    EncodedLengths _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(
    bytes32 id,
    address ownerAddress,
    bytes32 ownerSquadId,
    address opponentAddress,
    bytes32 opponentSquadId,
    uint256 createdAt,
    bool active,
    GameResult result
  ) internal {
    bytes memory _staticData = encodeStatic(
      ownerAddress,
      ownerSquadId,
      opponentAddress,
      opponentSquadId,
      createdAt,
      active,
      result
    );

    EncodedLengths _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(bytes32 id, LobbyData memory _table) internal {
    bytes memory _staticData = encodeStatic(
      _table.ownerAddress,
      _table.ownerSquadId,
      _table.opponentAddress,
      _table.opponentSquadId,
      _table.createdAt,
      _table.active,
      _table.result
    );

    EncodedLengths _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(bytes32 id, LobbyData memory _table) internal {
    bytes memory _staticData = encodeStatic(
      _table.ownerAddress,
      _table.ownerSquadId,
      _table.opponentAddress,
      _table.opponentSquadId,
      _table.createdAt,
      _table.active,
      _table.result
    );

    EncodedLengths _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(
    bytes memory _blob
  )
    internal
    pure
    returns (
      address ownerAddress,
      bytes32 ownerSquadId,
      address opponentAddress,
      bytes32 opponentSquadId,
      uint256 createdAt,
      bool active,
      GameResult result
    )
  {
    ownerAddress = (address(Bytes.getBytes20(_blob, 0)));

    ownerSquadId = (Bytes.getBytes32(_blob, 20));

    opponentAddress = (address(Bytes.getBytes20(_blob, 52)));

    opponentSquadId = (Bytes.getBytes32(_blob, 72));

    createdAt = (uint256(Bytes.getBytes32(_blob, 104)));

    active = (_toBool(uint8(Bytes.getBytes1(_blob, 136))));

    result = GameResult(uint8(Bytes.getBytes1(_blob, 137)));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   * @param _staticData Tightly packed static fields.
   *
   *
   */
  function decode(
    bytes memory _staticData,
    EncodedLengths,
    bytes memory
  ) internal pure returns (LobbyData memory _table) {
    (
      _table.ownerAddress,
      _table.ownerSquadId,
      _table.opponentAddress,
      _table.opponentSquadId,
      _table.createdAt,
      _table.active,
      _table.result
    ) = decodeStatic(_staticData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(bytes32 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(bytes32 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(
    address ownerAddress,
    bytes32 ownerSquadId,
    address opponentAddress,
    bytes32 opponentSquadId,
    uint256 createdAt,
    bool active,
    GameResult result
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(ownerAddress, ownerSquadId, opponentAddress, opponentSquadId, createdAt, active, result);
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dynamic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    address ownerAddress,
    bytes32 ownerSquadId,
    address opponentAddress,
    bytes32 opponentSquadId,
    uint256 createdAt,
    bool active,
    GameResult result
  ) internal pure returns (bytes memory, EncodedLengths, bytes memory) {
    bytes memory _staticData = encodeStatic(
      ownerAddress,
      ownerSquadId,
      opponentAddress,
      opponentSquadId,
      createdAt,
      active,
      result
    );

    EncodedLengths _encodedLengths;
    bytes memory _dynamicData;

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(bytes32 id) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = id;

    return _keyTuple;
  }
}

/**
 * @notice Cast a value to a bool.
 * @dev Boolean values are encoded as uint8 (1 = true, 0 = false), but Solidity doesn't allow casting between uint8 and bool.
 * @param value The uint8 value to convert.
 * @return result The boolean value.
 */
function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}
