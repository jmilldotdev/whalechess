import { useMUD } from "./MUDContext";

export const App = () => {
  const {
    components: { PlayerPiece },
    systemCalls: { givePieceToPlayer },
  } = useMUD();

  return (
    <>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "created piece:",
            await givePieceToPlayer(
              "0x0000000000000000000000000000000000000000",
              "Pawn",
              1
            )
          );
        }}
      >
        Create Pawn
      </button>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          await givePieceToPlayer(
            "0x0000000000000000000000000000000000000000",
            "Queen",
            1
          );
        }}
      >
        Create Queen
      </button>
    </>
  );
};
