import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Dispatch, SetStateAction } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import * as SecureStorage from "expo-secure-store";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

export const Settings = ({
  modal,
  setModal,
}: {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const HandleSettings = () => {
    setModal(false);
    SecureStorage.deleteItemAsync("token").then(async () => {
      await AsyncStorage.clear();
      router.replace("/login");
    });
  };
  return (
    <Modal
      visible={modal}
      transparent
      onRequestClose={() => setModal(false)}
      animationType="none"
    >
      <View className="bg-slate-800 flex h-36 m-12 p-5  rounded-2xl shadow-lg shadow-slate-300 justify-center items-center">
        <View className="flex w-full p-3 m-2 flex-row-reverse justify-end items-end ">
          <TouchableOpacity onPress={() => setModal(false)}>
            <AntDesign name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={HandleSettings}
          className="bg-red-900 flex justify-center items-center content-center shadow-md w-20 h-11 m-7 p-2 rounded-md shadow-red-600"
        >
          <ThemedText className="text-xs" type="default">
            Log out
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
