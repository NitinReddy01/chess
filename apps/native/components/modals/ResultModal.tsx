import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { GameResult, Player } from "@/utils/types";
import { black200, gray, neutral600, neutral800 } from "@/utils/colors";
import CustomText from "../CustomText";
import { router } from "expo-router";

interface ResultModalPros {
  result: GameResult | null;
  reason: string;
  isOpen: boolean;
  onClose: () => void;
  playe1: Player | null;
  player2: Player | null;
}

export default function ResultModal({
  result,
  reason,
  isOpen,
  playe1,
  player2,
  onClose
}: ResultModalPros) {
    
    const startNewGame = ()=>{
        onClose();  
        setTimeout(() => {
            router.replace({
                pathname: "/[gameId]",
                params: {
                    gameId: "start"
                }
            });
        }, 300); 
    }
    
    if (!playe1 || !player2 || !result) {
        return null;
    }

  return (
    <Modal animationType="fade" visible={isOpen} transparent={true}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <CustomText
              text={result}
              style={{ fontWeight: 800, fontSize: 25 }}
            />
            <CustomText text={"By " + reason} style={{ fontSize: 15 }} />
          </View>
          <View style={styles.body}>
            <View style={styles.imagesContainer}>
              <View style={styles.playerContainer}>
                <Image source={{ uri: playe1.image }} style={styles.image} />
                <Text>{playe1.name}</Text>
              </View>
              <View style={styles.playerContainer}>
                <Image source={{ uri: player2.image }} style={styles.image} />
                <Text>{player2.name}</Text>
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button}>
                <CustomText text="Rematch" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={startNewGame}>
                <CustomText text="New Match" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  innerContainer: {
    width: "70%",
    height: "35%",
    alignItems: "center",
  },
  header: {
    flex: 1,
    backgroundColor: gray,
    width: "100%",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  body: {
    flex: 4,
    backgroundColor: neutral800,
    width: "100%",
    borderRadius: 15,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 40,
  },
  image: {
    width: 45,
    height: 45,
  },
  playerContainer: {
    alignItems: "center",
    gap: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: gray,
    padding: 10,
    borderRadius: 10,
  },
});
