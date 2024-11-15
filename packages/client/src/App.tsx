import { useMUD } from "./MUDContext";

export const App = () => {
  const {
    components: { Piece },
    systemCalls: { createPiece },
  } = useMUD();

  return (
    <>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "created piece:",
            await createPiece(
              "0x0000000000000000000000000000000000000000",
              "Pawn",
              "n1",
              "n1e1,n1w1"
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
          await createPiece(
            "0x0000000000000000000000000000000000000000",
            "Queen",
            "n*,s*,e*,w*,n*e*,n*w*,s*e*,s*w*",
            "!"
          );
        }}
      >
        Create Queen
      </button>
    </>
  );
};
