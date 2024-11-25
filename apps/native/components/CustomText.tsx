import { View, Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { neutral800 } from '@/utils/colors';

interface CustomTextProps{
    text:string;
    style?:StyleProp<TextStyle>
}

export default function CustomText({text,style}:CustomTextProps) {
  return (
    <Text style={[style,{color:neutral800}]} > {text} </Text>
  )
}