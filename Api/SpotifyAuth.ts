import axios, { AxiosError, AxiosResponse } from "axios";
import { Buffer } from "buffer"; // Importa Buffer de la librería 'buffer'
import qs from "querystring";
import * as Linking from "expo-linking";
import * as SecureStorage from "expo-secure-store";
import { ResponseAxios, TokenResponse } from "@/types/Card.types";

const instancia = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(
      `${process.env.EXPO_PUBLIC_CLIENTE_ID}:${process.env.EXPO_PUBLIC_CLIENTE_SECRET}`,
    ).toString("base64")}`,
  },
});

export const getAccessToken = (
  code: string,
): Promise<ResponseAxios<TokenResponse>> => {
  const URI = Linking.createURL("login");
  const data = {
    code: code,
    redirect_uri: URI || "",
    grant_type: "authorization_code",
  };
  return new Promise((resolve, reject) => {
    instancia
      .post("https://accounts.spotify.com/api/token", data)
      .then((response: AxiosResponse) => {
        const expira = new Date();
        expira.setSeconds(expira.getSeconds() + 3600);
        response.data.expira = expira;
        resolve(response);
      })
      .catch((e: AxiosError) => {
        reject(e);
      });
  });
};

export const checkToken = async (expira: Date) => {
  const date_actual = new Date();
  if (date_actual >= expira) {
    await SecureStorage.deleteItemAsync("token");
  } else {
    await SecureStorage.setItemAsync("expira", expira.toString());
  }
};

export const refreshToken = async (): Promise<AxiosResponse> => {
  const refresh = (await SecureStorage.getItemAsync("refresh_token")) || "";
  const body = {
    grant_type: "refresh_token",
    refresh_token: refresh,
  };
  return new Promise((resolve, reject) => {
    instancia
      .post("https://accounts.spotify.com/api/token", qs.stringify(body))
      .then(async (response: AxiosResponse<TokenResponse>) => {
        let expira = new Date();
        expira.setSeconds(expira.getSeconds() + 3600);
        response.data.expira = expira.toString();
        checkToken(expira);
        await SecureStorage.setItemAsync("token", response.data.access_token);
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
