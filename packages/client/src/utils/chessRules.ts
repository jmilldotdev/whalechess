import { ChessPiece, Position, PieceType } from '../types/chess';

export const isValidMove = (
  piece: ChessPiece,
  start: Position,
  end: Position,
  board: (ChessPiece | null)[][]
): boolean => {
  const { row: startRow, col: startCol } = start;
  const { row: endRow, col: endCol } = end;
  const rowDiff = Math.abs(endRow - startRow);
  const colDiff = Math.abs(endCol - startCol);

  // Can't move to the same position
  if (startRow === endRow && startCol === endCol) return false;

  // Can't capture own piece
  if (board[endRow][endCol]?.color === piece.color) return false;

  switch (piece.piece) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startingRow = piece.color === 'white' ? 6 : 1;
      
      // Moving forward
      if (startCol === endCol && !board[endRow][endCol]) {
        if (startRow + direction === endRow) return true;
        if (startRow === startingRow && 
            startRow + 2 * direction === endRow && 
            !board[startRow + direction][startCol]) {
          return true;
        }
      }
      
      // Capturing
      if (Math.abs(startCol - endCol) === 1 && 
          endRow === startRow + direction && 
          board[endRow][endCol]) {
        return true;
      }
      return false;

    case 'knight':
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    case 'bishop':
      if (rowDiff !== colDiff) return false;
      return !isPathBlocked(start, end, board);

    case 'rook':
      if (rowDiff !== 0 && colDiff !== 0) return false;
      return !isPathBlocked(start, end, board);

    case 'queen':
      if (rowDiff !== colDiff && rowDiff !== 0 && colDiff !== 0) return false;
      return !isPathBlocked(start, end, board);

    case 'king':
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
  }
};

const isPathBlocked = (
  start: Position,
  end: Position,
  board: (ChessPiece | null)[][]
): boolean => {
  const rowDir = Math.sign(end.row - start.row) || 0;
  const colDir = Math.sign(end.col - start.col) || 0;
  
  let currentRow = start.row + rowDir;
  let currentCol = start.col + colDir;

  while (currentRow !== end.row || currentCol !== end.col) {
    if (board[currentRow][currentCol]) return true;
    currentRow += rowDir;
    currentCol += colDir;
  }

  return false;
}; 