import { neutral800 } from '@/utils/colors';
import React from 'react';
import { Linking, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface SignInModalProps{
    isOpen:boolean;
    onClose:()=>void;
}

export default function SignInModal({isOpen,onClose}:SignInModalProps) {
  const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const signInWithGoogle = async () => {
    if(Platform.OS === "web"){
      Linking.openURL(`${backendURL}/auth/google?platform=web`);
    } else {
      Linking.openURL(`${backendURL}/auth/google?platform=mobile`);
    }
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent={true}>
      <View style={{flex:1,alignItems: "center",justifyContent: "center"}} >
        <View style={{width:"70%",height:'50%',alignItems:'center',backgroundColor:neutral800}}>
          <TouchableOpacity onPress={signInWithGoogle}>
            <Text>Sign In With Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}