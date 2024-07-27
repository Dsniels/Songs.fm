import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

export const SmallListSongs = ({ item, getSongDetails }: any) => {
  return (
    <TouchableOpacity
      className=" flex flex-row m-0 border-2 bg-slate-950  items-center p-0 shadow "
      onPress={() => getSongDetails(item)}
    >
      <View className="shrink-0 m-3">
        <Image
          source={{ uri: item.album?.images?.[0]?.url }}
          className=" w-14 h-14 "
        />
      </View>
      <View className="flex flex-wrap">
        <ThemedText
          numberOfLines={1}
          ellipsizeMode="clip"
          className="text-lg  text-white font-bold w-32"
        >
          {item.name}
        </ThemedText>
        <ThemedText
          numberOfLines={1}
          textBreakStrategy="simple"
          lineBreakMode="middle"
          className="text-slate-300 w-40"
        >
          {item.artists.map((artist: any) => artist.name).join(", ")}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};
