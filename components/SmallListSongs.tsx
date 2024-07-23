import { Image, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";

export const SmallListSongs = ({ item, getSongDetails }: any) => {
  return (
    <Pressable
      className="flex flex-row justify-start items-center border-2 bg-sky-900 p-2 bg-opacity-7 align-middle content-center m-3 rounded-md border-sky-950"
      onPress={() => getSongDetails(item)}
    >
      <Image
        source={{ uri: item.album?.images?.[0]?.url }}
        className="w-14 h-14"
      />
      <ThemedText
        numberOfLines={1}
        ellipsizeMode="clip"
        style={{ marginLeft: 10, width: 200 }}
      >
        {item.name}
      </ThemedText>
    </Pressable>
  );
};
