import { View, Text } from "react-native";
import React from "react";
import { genero } from "@/types/Card.types";
import { ThemedText } from "./ThemedText";

const ListGeners = ({ item, index }: { item: genero; index: number }) => {
  return (
    <View className="m-3 rounded-lg" key={item.name}>
      <ThemedText type="defaultSemiBold">
        {index + 1}.- {item.name}
      </ThemedText>
      <View className="bg-gray-800 h-4 w-72 rounded-lg">
        <View
          className="bg-[#2793F2] h-full rounded-md"
          style={{ width: `${item.value * 6}%` }}
        />
      </View>
    </View>
  );
};

export default ListGeners;
