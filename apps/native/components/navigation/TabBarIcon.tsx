import { green500 } from "@/utils/colors";
import { chessLogo } from "@/utils/images";
import { View, Text, Image, ImageSourcePropType } from "react-native";

interface TabBarIconProps {
  title: string;
  image:ImageSourcePropType;
  focused: boolean;
}

export function TabBarIcon(props: TabBarIconProps) {
  return (
    <View style={{alignItems:'center'}} >
      <Image source={props.image} style={{height:35,width:35,tintColor: props.focused ? green500 : "white"}} />
      <Text style={{ color: props.focused ? green500 : "white", fontSize: 13 }}>
        {props.title}
      </Text>
    </View>
  );
}
