export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'metal';

export interface ChessPiece {
  piece: PieceType;
  color: PieceColor;
}

export interface Square {
  isWhite: boolean;
  piece: ChessPiece | null;
}

export type Position = {
  row: number;
  col: number;
}; 