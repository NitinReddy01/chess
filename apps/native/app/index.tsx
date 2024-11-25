import { setAuth } from '@/features/authSlice';
import useAppDispatch from '@/hooks/useAppDispatch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';



export default function index() {
  const dispatch = useAppDispatch();


  useEffect(()=>{
    const getUser = async ()=>{
      const user = await AsyncStorage.getItem("user");
      if(user) dispatch(setAuth(JSON.parse(user)));
      // await AsyncStorage.clear();
    }
    getUser();
  },[])

  return (
      <Redirect href={'/(tabs)/play'} />

  )
}