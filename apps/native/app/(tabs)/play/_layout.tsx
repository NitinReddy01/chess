import CustomText from "@/components/CustomText";
import { black500 } from "@/utils/colors";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";

export default function _layout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            header: () => (
              <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: black500,
                    padding: 20,
                  }}
                >
                  <CustomText text="Play" style={{ fontSize: 20 }} />
                </View>
              </SafeAreaView>
            ),
          }}
        />
      </Stack>
    </>
  );
}
