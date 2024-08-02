import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { StateProvider } from "@/Context/store";
import { initialState } from "@/Context/Reducers/SesionUsuario";
import { mainReducer } from "@/Context/Reducers";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  


  return (
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <Slot />
    </StateProvider>
  );
}
