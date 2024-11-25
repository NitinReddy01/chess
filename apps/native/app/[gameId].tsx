import ChessBoard from "@/components/ChessBoard";
import CustomText from "@/components/CustomText";
import ResultModal from "@/components/modals/ResultModal";
import useSocket from "@/hooks/useSocket";
import { black500 } from "@/utils/colors";
import { GameResult, move, Player } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chess } from "chess.js";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";

export default function game() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const socket = useSocket();
  const [gameStarted, setGameStarted] = useState(false);
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [gameID, setGameID] = useState("");
  const [result, setResult] = useState<GameResult | null>(null);
  const [reason, setReason] = useState("");
  const [moves,setMoves] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "start-game":
          setGameStarted(true);
          setGameID(message.payload.gameId);
          setPlayer1(message.payload.whitePlayer);
          setPlayer2(message.payload.blackPlayer);
          // await AsyncStorage.setItem("gameId",message.payload.gameId);
          break;
        case "move":
          chess.move(message.payload.move);
          setPlayer1((prev) => {
            if (!prev) {
              return null;
            }
            return { ...prev, time: message.payload.whitePlayerTime };
          });
          setPlayer2((prev) => {
            if (!prev) {
              return null;
            }
            return { ...prev, time: message.payload.blackPlayerTime };
          });
          setBoard(chess.board());
          setMoves(chess.history());
          break;
        case "game_over":
          setResult(message.payload.result);
          setReason(message.payload.reason);
          break;
        default:
          break;
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    if (!gameId) {
      return;
    }
    if (gameId === "start") {
      socket.send(
        JSON.stringify({
          type: "init_game",
        })
      );
    } else {
      socket.send(
        JSON.stringify({
          type: "join_game",
          payload: {
            gameId,
          },
        })
      );
    }
  }, [socket]);

  if (!socket) {
    return <CustomText text="Connecting...."/>;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: black500,
        height: "100%",
        marginTop: StatusBar.currentHeight,
      }}
    >
      {!gameStarted || !player1 || !player2 ? (
        <>
          <CustomText text="Searching" />
        </>
      ) : (
        <ChessBoard
          player1={player1!}
          player2={player2!}
          gameId={gameID}
          socket={socket}
          chess={chess}
          board={board}
          moves={moves}
          setBoard={setBoard}
        />
      )}
      <ResultModal
        result={result}
        isOpen={result ? true : false}
        reason={reason}
        onClose={() => {setResult(null)}}
        playe1={player1}
        player2={player2}
      />
    </SafeAreaView>
  );
}
