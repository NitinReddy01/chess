import { Square, PieceSymbol, Color, Chess } from "chess.js";
import { useMemo, useState } from "react";
import { MOVE } from "../utils/utils";
import { pieceToUnicode } from "../utils/ChessPieces";

interface ChessBoardProps {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  chess: Chess;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  playerColor: string;
  socket:WebSocket
}

export default function ChessBoard({
  board,
  setBoard,
  chess,
  playerColor,
  socket
}: ChessBoardProps) {

    const [from,setFrom] = useState<string | null>(null);
    const flipBoard = useMemo(()=>{
        return playerColor[0] === 'b';
    },[playerColor])

    const handleMovePiece = (square:Square)=>{
        // console.log(square);
        if(from === square) {
            return ;
        }
        if(!from) {
            const piece = chess.get(square);
            if(!piece || piece.color !== playerColor[0]) {
                return ;
            }
            setFrom(square);
        } else {
            socket.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move:{
                        from,
                        to:square
                    }
                }
            }))
            setFrom(null);
            chess.move({from,to:square});
            setBoard(chess.board());
        }
    }

    const getPieceUnicode = (square :{
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null ) => {
        if (!square) return ""; // Empty square
        const { type, color } = square;
        return pieceToUnicode[type][color]; // Return corresponding Unicode character
      };

  return (
    <div>
      {(flipBoard?board.slice().reverse():board).map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
                const squareString = String.fromCharCode(97 + j%8) + String( flipBoard? (i%8) +1 : 8 - (i%8));
              return (
                <div key={j} onClick={()=>{handleMovePiece(squareString as Square)}}>
                  <div
                    className={`w-14 h-14 items-center justify-center flex   ${
                      (i + j) % 2 == 0 ? "bg-green-500" : "bg-slate-500"
                    } ${square?"cursor-pointer":""}`}
                  >
                    <span className="text-4xl" >{getPieceUnicode(square)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
