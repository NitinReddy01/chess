import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { green500, neutral800 } from '@/utils/colors';

interface PrimaryButtonProps{
    label:string;
    onClick:()=>void
}

export default function PrimaryButton({label,onClick}:PrimaryButtonProps) {
  return (
    <TouchableOpacity onPress={onClick} style={{backgroundColor:green500,padding:10,alignItems:'center',borderRadius:5}} >
        <Text  style={{color:neutral800}} >
            {label}
        </Text>
    </TouchableOpacity>
  )
}