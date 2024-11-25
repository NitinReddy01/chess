import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView, Text, View } from 'react-native'

export default function _layout() {
  return (
    <>
        <Stack>
            <Stack.Screen name='index' options={{
                header:()=>(
                    <SafeAreaView>
                        <Text>asd</Text>
                    </SafeAreaView>
                )
            }} />
        </Stack>
    </>
  )
}