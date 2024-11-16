/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { encodePacked, keccak256 } from "viem";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Entity, getComponentValue } from "@latticexyz/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { PlayerPiece, Piece }: ClientComponents
) {
  const givePieceToPlayer = async (
    ownerAddress: `0x${string}`,
    pieceName: string,
    quantity: number
  ) => {
    // Convert the pieceName to an Entity by encoding and hashing it to match the contract
    const pieceEntity = keccak256(
      encodePacked(["string"], [pieceName])
    ) as Entity;

    const piece = getComponentValue(Piece, pieceEntity);

    if (!piece) {
      throw new Error(`Piece ${pieceName} not found`);
    }

    const tx = await worldContract.write.app__givePieceToPlayer([
      ownerAddress,
      pieceEntity as `0x${string}`,
      BigInt(quantity),
    ]);
    await waitForTransaction(tx);
    return tx;
  };

  return {
    givePieceToPlayer, // Expose the givePieceToPlayer function
  };
}
