import { useEffect, useState } from 'react';

type ChessPiece = {
  isWhite: boolean;
  piece: string | null;
  id?: string;
};

type CollectionPiece = {
  id: string;
  piece: string;
};

export const Squad = () => {
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [boardPieces, setBoardPieces] = useState<ChessPiece[][]>([]);
  const [collection, setCollection] = useState<CollectionPiece[]>([]);

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

  // Initialize board with unique IDs
  useEffect(() => {
    const initialBoard: ChessPiece[][] = Array(2).fill(null).map((_, rowIndex) => 
      Array(8).fill(null).map((_, j) => {
        const i = rowIndex + 6;
        const isWhite = (i + j) % 2 === 0;
        let piece = null;

        if (i === 6) {
          piece = 'pawn';
        } else if (i === 7) {
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
          piece,
          id: piece ? `${piece}-${i}-${j}` : undefined
        };
      })
    );
    setBoardPieces(initialBoard);
  }, []);

  const handleDragStart = (e: React.DragEvent, fromBoard: boolean, piece: string, id: string, rowIndex?: number, colIndex?: number) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      fromBoard,
      piece,
      id,
      rowIndex,
      colIndex
    }));
  };

  const handleDrop = (e: React.DragEvent, toBoard: boolean, targetRow?: number, targetCol?: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const { fromBoard, piece, id, rowIndex: sourceRow, colIndex: sourceCol } = data;

    if (fromBoard && toBoard) {
      // Swap pieces on board while preserving tile colors
      const newBoard = [...boardPieces];
      const sourcePiece = newBoard[sourceRow][sourceCol].piece;
      const sourceId = newBoard[sourceRow][sourceCol].id;
      const targetPiece = newBoard[targetRow!][targetCol!].piece;
      const targetId = newBoard[targetRow!][targetCol!].id;

      // Update source square (keep original isWhite value)
      newBoard[sourceRow][sourceCol] = {
        isWhite: newBoard[sourceRow][sourceCol].isWhite,
        piece: targetPiece,
        id: targetId
      };

      // Update target square (keep original isWhite value)
      newBoard[targetRow!][targetCol!] = {
        isWhite: newBoard[targetRow!][targetCol!].isWhite,
        piece: sourcePiece,
        id: sourceId
      };

      setBoardPieces(newBoard);
    } else if (fromBoard && !toBoard) {
      // Move from board to collection
      const newBoard = [...boardPieces];
      const movedPiece = { ...newBoard[sourceRow][sourceCol] };
      newBoard[sourceRow][sourceCol] = { isWhite: movedPiece.isWhite, piece: null };
      setBoardPieces(newBoard);
      setCollection([...collection, { id, piece }]);
    } else if (!fromBoard && toBoard) {
      // Move from collection to board
      const newBoard = [...boardPieces];
      const targetPiece = newBoard[targetRow!][targetCol!];
      
      // Update board with collection piece
      newBoard[targetRow!][targetCol!] = {
        isWhite: (targetRow! + targetCol!) % 2 === 0,
        piece,
        id
      };
      setBoardPieces(newBoard);

      // Update collection
      const newCollection = collection.filter(p => p.id !== id);
      if (targetPiece.piece) {
        newCollection.push({
          id: targetPiece.id!,
          piece: targetPiece.piece
        });
      }
      setCollection(newCollection);
    }
  };

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
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/chess/bg2.jpg)',
        backgroundSize: 'cover',
        overflow: 'hidden'  // Prevents scrolling within this container
      }}>
        <div style={{ 
          width: boardSize.width, 
          height: boardSize.height / 4, // Adjusted height for 2 rows
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          border: '2px solid #333',
          background: 'linear-gradient(to bottom right, #8B4513, #D2691E)',
          boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.8)'
        }}>
          {boardPieces.map((row, i) =>
            row.map((square, j) => (
              <div 
                key={`${i}-${j}`} 
                style={{
                  width: '100%',
                  paddingTop: '100%',
                  position: 'relative'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, true, i, j)}
              >
                <img
                  src={square.isWhite ? '/chess/white.png' : '/chess/blue.png'}
                  alt={`Tile ${i}-${j}`}
                  draggable={false}
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
                    draggable
                    onDragStart={(e) => handleDragStart(e, true, square.piece!, square.id!, i, j)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      cursor: 'grab'
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right half - Collection */}
      <div 
        style={{ 
          flex: 1, 
          backgroundColor: '#2a2a2a',
          padding: '2rem',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/chess/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, false)}
      >
        <img 
          src="/texts/collection.png" 
          alt="Squad" 
          style={{ 
            width: '50%',
            objectFit: 'contain',
            display: 'block',
            alignSelf: 'flex-start'
          }} 
        />
        
        {/* Collection pieces container */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {collection.map((item) => (
            <div
              key={item.id}
              style={{
                width: '100px',
                height: '100px',
                border: '2px solid #gold',
                borderRadius: '8px',
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <img
                src={`/chess/white/${item.piece}.png`}
                alt={item.piece}
                draggable
                onDragStart={(e) => handleDragStart(e, false, item.piece, item.id)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 