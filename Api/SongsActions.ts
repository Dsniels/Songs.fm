import { Axios, AxiosError, AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { seeds } from "@/service/seeds";
import { refreshToken } from "./SpotifyAuth";
import { ToastAndroid } from "react-native";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";

export const getTop = (
  type: string,
  offset: number = 0,
  time_range: string,
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=${time_range}`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((e: any) => {
        resolve(e);
      });
  });
};

export const search = (t: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`search?q=${t}&type=artist%2Ctrack`).then((response) => {
      resolve(response.data);
    });
  });
};

export const getRecomendations = async (): Promise<any> => {
  const { songs, artists, generos } = await seeds();
  const randomDanceability = Math.random();
  const randomPopularity = Math.floor(Math.random() * 100);
  const randomValence = Math.random() * 0.3 + 0.3;
  const randomEnergy = Math.random();
  const randomAcousticness = Math.random();
  const randomSpeechiness = Math.random();
  return new Promise((resolve, reject) => {
    HttpCliente.get(
      `/recommendations?limit=40&seed_tracks=${songs.toString()}&seed_genres=${generos}&target_acousticness=${randomAcousticness}&target_energy=${randomEnergy}&target_speechiness${randomSpeechiness}&seed_artists=${artists.toString()}&target_danceability=${randomDanceability}&target_popularity=${randomPopularity}&target_valence${randomValence}`,
    )
      .then((response: AxiosResponse) => {
        resolve(response.data?.tracks);
      })
      .catch((e: AxiosError) => {
        ToastAndroid.showWithGravity(
          `Ocurrio un error: ${e.code}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        resolve(e);
      });
  });
};

export const getRecentlySongs = () => {
  return new Promise((resolve, reject) => {
    HttpCliente.get("/me/player/recently-played?limit=20")
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const getListOfSongs = (
  tracks: string[],
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks?ids=${tracks}`)
      .then((response: AxiosResponse) => {
        resolve(response.data.tracks);
      })
      .catch((e: any) => {
        refreshToken();
        resolve(e);
      });
  });
};

export const getSongInfo = async (id: string) => {
  const [info, features, like] = await Promise.all([
    songInfo(id),
    AudioFeatures(id),
    checkLikeTrack(id),
  ]);
  return { Info: info, Features: features, Like: like };
};

const songInfo = (id: string) => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks/${id}`)
      .then((response: any) => {
        resolve(response.data || {});
      })
      .catch((e) => resolve(e));
  });
};

const checkLikeTrack = (id: string) => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/me/tracks/contains?ids=${id}`)
      .then((response: any) => {
        resolve(response.data[0]);
      })
      .catch(resolve);
  });
};

const AudioFeatures = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/audio-features/${id}`)
      .then((response: any) => {
        resolve(response.data);
      })
      .catch(resolve);
  });
};

export const AddToFav = (id: string) => {
  return new Promise((resolve, reject) => {
    HttpCliente.put(`/me/tracks?ids=${id}`, id)
      .then((response: any) => {
        notificationAsync(NotificationFeedbackType.Success);
        resolve(response);
      })
      .catch((e) => {
        ToastAndroid.showWithGravity(
          `Ocurrio un error: ${e.code}`,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        reject(e);
      });
  });
};

export const deleteFromFav = (id: string) => {
  return new Promise((resolve, reject) => {
    HttpCliente.delete(`/me/tracks?ids=${id}`, id)
      .then((response: any) => {
        notificationAsync(NotificationFeedbackType.Warning);
        resolve(response);
      })
      .catch((e) => {
        ToastAndroid.showWithGravity(
          `Ocurrio un error: ${e.code}`,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        reject(e);
      });
  });
};
