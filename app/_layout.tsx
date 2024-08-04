import { Slot } from "expo-router";
import "react-native-reanimated";

import { StateProvider } from "@/Context/store";
import { initialState } from "@/Context/Reducers/SesionUsuario";
import { mainReducer } from "@/Context/Reducers";



export default function RootLayout() {
  


  return (
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <Slot />
    </StateProvider>
  );
}
