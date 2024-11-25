import { black500, black800, gray, neutral800 } from '@/utils/colors';
import { Player } from '@/utils/types';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import CustomText from './CustomText';

interface PlayerInfoProps {
  player: Player;
  playerTurn: boolean;
  playerColor:"w" | "b";
}

export default function PlayerInfo({ player, playerTurn,playerColor }: PlayerInfoProps) {
  const [time, setTime] = useState<number>(player.time);

  useEffect(() => {
    setTime(player.time);
  }, [player.time]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (playerTurn) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev && prev > 0) return prev - 1;
          if (interval) clearInterval(interval); // need to clear when timer reaches 0
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval); 
    };
  }, [playerTurn]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <View style={{ flexDirection: 'row', padding: 20, gap: 10 }}>
      <Image source={{ uri: player.image }} style={{ width: 40, height: 40 }} />
      <View style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 1 }}>
        <CustomText text={player.name} />
        <View style={{ padding: 10, backgroundColor: playerColor === "w" ? neutral800 : gray, borderRadius: 6,alignItems:'center',justifyContent:'center' }}>
          <Text style={{color: playerColor === "w" ? black800:neutral800 }} >{`${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`}</Text>
        </View>
      </View>
    </View>
  );
}
