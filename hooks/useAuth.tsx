import { ToastAndroid } from "react-native";
import { Dispatch, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import { router } from "expo-router";
import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";

export const useAuth = (dispatch: Dispatch<any>, ) => {
  const [servidorResponse, setServidorResponse] = useState(false);
const isFulfilled = <T,>(p:PromiseSettledResult<T>): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
  useEffect(() => {
    const getData = async () => {
      const results : Array<PromiseSettledResult<string|null>>= await Promise.allSettled([
        SecureStorage.getItemAsync("token"),
        SecureStorage.getItemAsync("expira"),
      ]);
const fulfilledValues = results.filter(isFulfilled).map(p => p.value);
      if (fulfilledValues[0] == null || fulfilledValues[1] === null) {
        return router.replace("/login");
      }

      const Today = new Date();
      const expiracion = new Date(fulfilledValues[1] as string);  

      if (Today.getTime() >= expiracion.getTime()) {
        await refreshToken();
      }

      if (!servidorResponse) {
        await getprofile(dispatch);
        setServidorResponse(true);
      }


      return () => {setTimeout(async () => await getData(), 360000)};

    };
    getData().catch((e) =>
      ToastAndroid.showWithGravity(e, ToastAndroid.SHORT, ToastAndroid.CENTER),
    );
  }, []);
};
