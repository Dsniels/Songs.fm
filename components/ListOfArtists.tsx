import { styles } from "@/Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Pressable, Text, View } from "react-native";

export const ListOfArtists = ({ item, getDetails }: any) => {
  return (
    <Pressable
      style={{ elevation: 270 }}
      key={item.id}
      onPress={() => getDetails(item)}
    >
      <ImageBackground
        key={item.id}
        style={[styles.TopSongs]}
        source={{
          uri:
            item.images[0].url ||
            "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.linearGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <View
            className="flex z-0 top-28 right-8 m-8 w-64 p-6 rounded-3xl"
            key={item.id}
          >
            <Text className="capitalize text-white font-bold">{item.name}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};
