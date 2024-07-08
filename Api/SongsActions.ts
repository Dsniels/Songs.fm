import { Axios, AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { seeds } from "@/service/seeds";

export const getTop = (
  type: string,
  offset: number = 0
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=medium_term`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((e: any) => {
        console.log("ErrorGetTop", e);
        resolve(e);
      });
  });
};

export const getRecomendations = async (): Promise<any> => {

  const {songs, artists, generos} = await seeds();

  return new Promise((resolve, reject) => {
    HttpCliente.get(
      `/recommendations?seed_tracks=${songs}&seed_genres=${generos}&seed_artists=${artists}`
    )
      .then((response: any) => {
        resolve(response.data?.tracks );
      })
      .catch((e: any) => {
        reject([]);
        console.log(e);
      });
  });
};

export const getListOfSongs = (
  tracks: string[]
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks?ids=${tracks}`)
      .then((response: AxiosResponse) => {
        resolve(response.data.tracks);
      })
      .catch((e: any) => {
        resolve(e);
      });
  });
};

