import { useEffect, useState } from 'react';

type ChessPiece = {
  isWhite: boolean;
  piece: string | null;
};

export const Squad = () => {
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  
  // Calculate the board size based on window height
  useEffect(() => {
    const calculateBoardSize = () => {
      const height = window.innerHeight;
      const size = Math.min(height * 0.8, window.innerWidth * 0.4); // 80% of height or 40% of width
      setBoardSize({ width: size, height: size });
    };

    calculateBoardSize();
    window.addEventListener('resize', calculateBoardSize);
    return () => window.removeEventListener('resize', calculateBoardSize);
  }, []);

  // Create 8x8 board array
  const board: ChessPiece[][] = Array(8).fill(null).map((_, i) => 
    Array(8).fill(null).map((_, j) => {
      const isWhite = (i + j) % 2 === 0;
      let piece = null;

      // Set up white pieces on the bottom two rows
      if (i === 6) { // Pawns row
        piece = 'pawn';
      } else if (i === 7) { // Back row
        switch (j) {
          case 0:
          case 7:
            piece = 'rook';
            break;
          case 1:
          case 6:
            piece = 'knight';
            break;
          case 2:
          case 5:
            piece = 'bishop';
            break;
          case 3:
            piece = 'queen';
            break;
          case 4:
            piece = 'king';
            break;
        }
      }

      return {
        isWhite,
        piece
      };
    })
  );

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',  // Prevents scrolling
      position: 'fixed',   // Ensures it stays fixed even if content overflows
      top: 0,
      left: 0
    }}>
      {/* Left half - Chessboard */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundImage: 'url(/chess/bg.jpg)',
        backgroundSize: 'cover',
        overflow: 'hidden'  // Prevents scrolling within this container
      }}>
        <div style={{ 
          width: boardSize.width, 
          height: boardSize.height,
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          border: '2px solid #333',
          background: 'linear-gradient(to bottom right, #8B4513, #D2691E)',
          boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.8)'
        }}>
          {board.map((row, i) =>
            row.map((square, j) => (
              <div 
                key={`${i}-${j}`} 
                style={{
                  width: '100%',
                  paddingTop: '100%',
                  position: 'relative'
                }}
              >
                <img
                  src={square.isWhite ? '/chess/white.png' : '/chess/blue.png'}
                  alt={`Tile ${i}-${j}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {square.piece && (
                  <img
                    src={`/chess/white/${square.piece}.png`}
                    alt={`${square.piece}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none'
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right half - Content placeholder */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#2a2a2a',
        padding: '2rem',
        overflow: 'hidden'  // Prevents scrolling within this container
      }}>
        <h1 style={{ color: 'white' }}>Squad Details</h1>
        {/* Add your squad details content here */}
      </div>
    </div>
  );
}; 