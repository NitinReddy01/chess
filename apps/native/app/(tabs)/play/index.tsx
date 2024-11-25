import PrimaryButton from "@/components/buttons/PrimaryButton";
import { black500 } from "@/utils/colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
// import * as AuthSession from 'expo-auth-session';
import { setAuth } from "@/features/authSlice";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import SignInModal from "@/components/modals/SignInModal";

export default function index() {
  const [loginModal, setLoginModal] = useState(false);
  const dipatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const startGame = () => {
    if (token) {
      router.push({
        pathname: "/[gameId]",
        params: {
          gameId: "start",
        },
      });
    } else {
      setLoginModal(true);
    }
  };

  const checkGame = async ()=>{
    const gameId = await AsyncStorage.getItem("gameId");
    if(gameId) {
      router.push({
        pathname: "/[gameId]",
        params: {
          gameId,
        },
      });
    }
  }

  // useEffect(()=>{
  //   checkGame();
  // },[])

  useEffect(() => {
    Linking.addEventListener("url", (event) => {
      const parsedUrl = Linking.parse(event.url);
      if (!parsedUrl) {
        return;
      }
      if (parsedUrl.queryParams?.user) {
        try {
          const user = JSON.parse(
            parsedUrl.queryParams.user as string
          );
          dipatch(setAuth(user));
          AsyncStorage.setItem('user',JSON.stringify(user));
          router.push({
            pathname: "/[gameId]",
            params: {
              gameId: "start",
            },
          });
        } catch (error) {
          console.error("Failed to parse user info:", error);
        }
      }
    });
  }, []);

  const handleModalClose = () => {
    setLoginModal(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: black500, height: "100%" }}>
      <View style={{ padding: 0 }}>
        <PrimaryButton
          label="Start Game"
          onClick={() => {
            startGame();
          }}
        />
      </View>
      <SignInModal isOpen={loginModal} onClose={handleModalClose}/>
    </SafeAreaView>
  );
}
