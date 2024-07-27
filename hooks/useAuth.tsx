import { ToastAndroid } from "react-native";
import { Dispatch, useCallback, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import { router } from "expo-router";
import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";

export const useAuth = (dispatch: Dispatch<any>, sesionUsuario: any) => {
  const [servidorResponse, setServidorResponse] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const [token, fecha]: any = await Promise.allSettled([
        SecureStorage.getItemAsync("token"),
        SecureStorage.getItemAsync("expira"),
      ]);
      if (token.value == null || fecha.value === null) {
        return router.replace("/login");
      }

      const Today = new Date();
      const expiracion = new Date(fecha.value);

      if (Today.getTime() >= expiracion.getTime()) {
        await refreshToken();
      }

      if (!servidorResponse) {
        await getprofile(dispatch);
        setServidorResponse(true);
      }

      setInterval(async() => {
        await getData();
      }, 360000);
    };
    getData().catch((e) =>
      ToastAndroid.showWithGravity(e, ToastAndroid.SHORT, ToastAndroid.CENTER)
    );
  }, []);
};
