import { useEffect, useState } from "react";
import { MOVE, START_GAME } from "../utils/utils";
import ChessBoard from "../components/ChessBoard";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import useSocket from "../hooks/useSocket";

export default function Game() {

    const socket = useSocket();
    const [playerColor,setPlayerColor] = useState('');
    const [gameStarted,setGameStarted] = useState(false);
    const [chess] = useState(new Chess());
    const [board,setBoard] = useState<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>(chess.board());

    useEffect(()=>{
        if(!socket) {
            return ;
        }

        socket.onmessage = (event)=>{
            const message = JSON.parse(event.data);

            switch (message.type) {
                case START_GAME:
                    setPlayerColor(message.payload.color);
                    setBoard(chess.board());
                    setGameStarted(true);
                    break;
                case MOVE:
                    chess.move(message.payload.move);
                    setBoard(chess.board());
                    break;
                default:
                    break;
            }

        }

    },[socket]);

    if(!socket) {
        return <div className="flex justify-center text-white">
            Connecting...
        </div>
    }

  return (
    <div className="flex justify-center p-8">
      <div>
        <ChessBoard socket={socket} board={board} chess={chess} playerColor={playerColor} setBoard={setBoard} />
      </div>
      {!gameStarted &&       <div>
        <button className="text-white" onClick={()=>{
            socket.send(JSON.stringify({
                type:START_GAME
            }))
        }} >
            Play
        </button>
      </div>}
    </div>
  )
}
