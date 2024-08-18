import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { album } from "@/types/Card.types";
import { styles } from "@/Styles/styles";
import { LinearGradient } from "expo-linear-gradient";

const ListOfAlbums = ({ item }: { item: album }) => {
  return (
    <ImageBackground
      key={item.id}
      style={styles.TopSongs}
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
          style={{
            display: "flex",
            zIndex: 0,
            top: 95,
            right: 30,
            margin: 30,
            width: 200,
            padding: 20,
          }}
          key={item.id}
        >
          <Text
            numberOfLines={1}
            lineBreakMode="clip"
            style={{
              textTransform: "capitalize",
              color: "white",
              fontSize: 18,
              fontStyle: "normal",
              fontWeight: "bold",
            }}
          >
            {item.name}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default ListOfAlbums;
