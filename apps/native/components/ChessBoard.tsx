import useAppSelector from "@/hooks/useAppSelector";
import { green800, neutral600, neutral800 } from "@/utils/colors";
import { tribar } from "@/utils/images";
import { chessImageMap, Player } from "@/utils/types";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import CustomText from "./CustomText";
import PlayerInfo from "./PlayerInfo";

const screenWidth = Dimensions.get("screen").width;
const sqaureWidth = screenWidth / 8;
const platform = Platform.OS;

interface ChessBoardProps {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard:React.Dispatch<React.SetStateAction<({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][]>>
  player1: Player;
  player2: Player;
  socket: WebSocket;
  chess: Chess;
  gameId: string;
  moves: string[];
}

export default function ChessBoard({
  board,
  socket,
  chess,
  gameId,
  player1,
  player2,
  moves,
  setBoard
}: ChessBoardProps) {
  const [from, setFrom] = useState<string | null>(null);
  const id = useAppSelector((state) => state.auth.id);
  const myColor = id === player1.id ? "w" : "b";
  const flipBoard = myColor === "b";
  const [currentMoveIndex,setCurrentMoveIndex] = useState(moves.length-1);

  useEffect(()=>{
    setCurrentMoveIndex(moves.length-1);
  },[moves])

  const handleMove = (square: Square) => {
    if (from === square || chess.turn() !== myColor) {
      return;
    }
    const piece = chess.get(square);
    if (!from || piece.color === myColor) {
      setFrom(square);
    } else {
      socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            gameId,
            move: { from, to: square },
          },
        })
      );
      setFrom(null);
    }
  };

  const prevMove = ()=>{
    if(currentMoveIndex < 0) {
      return ;
    }
    chess.reset();
    for(let i=0;i<currentMoveIndex;i++){
      chess.move(moves[i]);
    }
    setBoard(chess.board());
    setCurrentMoveIndex(prev=>prev-1);
  }

  const nextMove = ()=>{
    if(currentMoveIndex >= moves.length -1) {
      return  ;
    }
    chess.move(moves[currentMoveIndex+1]);
    setBoard(chess.board());
    setCurrentMoveIndex(prev=>prev+1);
  }

  return (
    <View style={{ height: "100%" }}>
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", gap: 2 }}>
            {moves.map((move, ind) => (
              <View style={{ gap: 1, flexDirection: "row" }} key={ind}>
                {ind % 2 === 0 && (
                  <CustomText text={`${Math.floor(ind / 2) + 1}.`} />
                )}
                <CustomText text={move} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={{ justifyContent: "space-evenly", flex: 1 }}>
        <PlayerInfo
          player={id === player1.id ? player2 : player1}
          playerTurn={chess.turn() !== myColor}
          playerColor={myColor === "w" ? "b" : "w"}
        />
        <View>
          {(flipBoard ? board.slice().reverse() : board).map((row, i) => {
            return (
              <View key={i} style={{ flexDirection: "row" }}>
                {row.map((square, j) => {
                  const squareString = `${
                    String.fromCharCode(97 + j) +
                    String(flipBoard ? i + 1 : 8 - i)
                  }`;
                  return (
                    <View
                      key={i + j + 1}
                      style={{
                        gap: 10,
                        backgroundColor: `${
                          (flipBoard ? (i + j) % 2 === 0 : (i + j) % 2 !== 0)
                            ? green800
                            : neutral600
                        }`,
                        width: platform === "web" ? 45 : sqaureWidth,
                        height: platform === "web" ? 45 : sqaureWidth,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          handleMove(squareString as Square);
                        }}
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {square && (
                          <Image
                            style={{
                              width:
                                platform === "web" ? 40 : sqaureWidth * 0.8,
                              height:
                                platform === "web" ? 40 : sqaureWidth * 0.8,
                            }}
                            source={chessImageMap[square.color][square.type]}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
        <PlayerInfo
          player={id === player1.id ? player1 : player2}
          playerTurn={chess.turn() === myColor}
          playerColor={myColor}
        />
      <View style={{backgroundColor:"rgba(100, 100, 100, 0.5)",padding:10,flexDirection:'row',justifyContent:'space-evenly'}} >
        <Image source={tribar} style={{width:30,height:30,tintColor:neutral800}} />
        <View style={{flexDirection:'row',gap:20}}>
          <TouchableOpacity onPress={prevMove}>
            <CustomText text="<" style={{fontSize:25}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMove}>
            <CustomText style={{fontSize:25}} text=">" />
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </View>
  );
}
