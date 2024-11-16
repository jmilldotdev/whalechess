import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChessPiece, Square, Position } from '../../types/chess';
import { isValidMove } from '../../utils/chessRules';

export const ChessGame = () => {
  const { id } = useParams();
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'metal'>('white');
  const [board, setBoard] = useState<Square[][]>(getInitialBoard());
  
  // Calculate the board size based on window height
  useEffect(() => {
    const calculateBoardSize = () => {
      const height = window.innerHeight;
      const size = Math.min(height * 0.8, window.innerWidth * 0.4);
      setBoardSize({ width: size, height: size });
    };

    calculateBoardSize();
    window.addEventListener('resize', calculateBoardSize);
    return () => window.removeEventListener('resize', calculateBoardSize);
  }, []);

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedSquare) {
      const piece = board[row][col].piece;
      if (piece && piece.color === currentTurn) {
        setSelectedSquare({ row, col });
      }
    } else {
      const start = selectedSquare;
      const end = { row, col };
      const startPiece = board[start.row][start.col].piece;

      if (startPiece && isValidMove(
        startPiece,
        start,
        end,
        board.map(row => row.map(square => square.piece))
      )) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[end.row][end.col].piece = startPiece;
        newBoard[start.row][start.col].piece = null;
        setBoard(newBoard);
        setCurrentTurn(currentTurn === 'white' ? 'metal' : 'white');
      }
      setSelectedSquare(null);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundImage: 'url(/chess/bg.jpg)',
        backgroundSize: 'cover',
        overflow: 'hidden'
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
                onClick={() => handleSquareClick(i, j)}
                style={{
                  width: '100%',
                  paddingTop: '100%',
                  position: 'relative',
                  cursor: 'pointer',
                  border: selectedSquare?.row === i && selectedSquare?.col === j
                    ? '2px solid yellow'
                    : 'none'
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
                    src={`/chess/${square.piece.color}/${square.piece.piece}.png`}
                    alt={`${square.piece.color} ${square.piece.piece}`}
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

      <div style={{ 
        flex: 1, 
        backgroundColor: '#2a2a2a',
        padding: '2rem',
        overflow: 'hidden'
      }}>
        <h1 style={{ color: 'white' }}>Game Room: {id}</h1>
        <p style={{ color: 'white' }}>Current Turn: {currentTurn}</p>
      </div>
    </div>
  );
};

function getInitialBoard(): Square[][] {
  return Array(8).fill(null).map((_, i) => 
    Array(8).fill(null).map((_, j) => {
      const isWhite = (i + j) % 2 === 0;
      let piece: ChessPiece | null = null;

      if (i === 1) { // Black pawns
        piece = { piece: 'pawn', color: 'metal' };
      } else if (i === 6) { // White pawns
        piece = { piece: 'pawn', color: 'white' };
      } else if (i === 0 || i === 7) { // Back rows
        const color = i === 0 ? 'metal' : 'white';
        switch (j) {
          case 0:
          case 7:
            piece = { piece: 'rook', color };
            break;
          case 1:
          case 6:
            piece = { piece: 'knight', color };
            break;
          case 2:
          case 5:
            piece = { piece: 'bishop', color };
            break;
          case 3:
            piece = { piece: 'queen', color };
            break;
          case 4:
            piece = { piece: 'king', color };
            break;
        }
      }

      return { isWhite, piece };
    })
  );
}

export default ChessGame; 