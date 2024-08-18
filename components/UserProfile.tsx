import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useStateValue } from "@/Context/store";
import { ThemedText } from "./ThemedText";
import { song } from "@/types/Card.types";
import RangePicker from "./RangePicker";

const UserProfile = ({ currentlyPlaying }: { currentlyPlaying: song }) => {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    display_name: "",
    images: { url: "" },
  });
  useEffect(() => {
    if (sesionUsuario) {
      setUsuario(sesionUsuario.usuario);
    }
  }, [sesionUsuario]);

  return (
    <View className="m-3 flex text-center items-center justify-center flex-row">
      <View className="flex items-center ">
        <Image
          className="w-28 h-28 rounded-full m-4"
          source={{
            scale: 1,
            uri:
              usuario.images.url ||
              "https://filestore.community.support.microsoft.com/api/images/0ce956b2-9787-4756-a580-299568810730?upload=true",
          }}
        />
        <View>
          <ThemedText type="subtitle">{usuario.display_name}</ThemedText>
        </View>
        <View className="p-2">
          {currentlyPlaying && (
            <ThemedText numberOfLines={1} lineBreakMode="head" type="default">
              {currentlyPlaying.name} - {currentlyPlaying.artists[0].name}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

export default UserProfile;
