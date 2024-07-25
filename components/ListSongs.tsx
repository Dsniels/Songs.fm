import { styles } from "@/Styles/styles";
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router";
import { useCallback } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native"


export const ListSongs = ({item, getSongDetails } : any) => {

  return (
    <Pressable key={item.id} onPress={() => getSongDetails(item)}>
      <ImageBackground
        key={item.id}
        style={styles.TopSongs}
        source={{
          uri: item.album?.images[0].url || "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.linearGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <View className="flex z-0 top-28 right-8 m-8 w-56 p-6 rounded-3xl" key={item.id}>
            <Text
              lineBreakMode="clip"
              numberOfLines={1}
              className="capitalize text-white font-bold"
            >
              {item.name}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  )
}