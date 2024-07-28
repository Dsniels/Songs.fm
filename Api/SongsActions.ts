import { AxiosError, AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { seeds } from "@/service/seeds";
import { refreshToken } from "./SpotifyAuth";
import { ToastAndroid } from "react-native";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
import { features, Recently, Recommendatios, song, Track } from "@/types/Card.types";

export const getTop = <T>(
  type: string,
<<<<<<< HEAD
=======
  offset = 0,
>>>>>>> f8f3028746e285ca8831e21a03413370c401d43d
  time_range: string,
  offset = 0,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=${time_range}`)
      .then((response: AxiosResponse<T>) => {
        resolve(response.data);
      })
      .catch(async(e) => {
        await refreshToken();
        reject(e);
      });
  });
};

export const search = (t: string): Promise<Track> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`search?q=${t}&type=artist%2Ctrack`).then((response) => {
      resolve(response.data);
    });
  });
};

export const getRecomendations = async (): Promise<Recommendatios[]> => {
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
        reject(e);
      });
  });
};

export const getRecentlySongs = (): Promise<Recently> => {
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
): Promise<AxiosResponse<song[]>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks?ids=${tracks}`)
      .then((response: AxiosResponse) => {
        resolve(response.data.tracks);
      })
      .catch((e: AxiosResponse) => {
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

const songInfo = (id: string): Promise<song> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks/${id}`)
      .then((response: AxiosResponse) => {
        resolve(response.data || {});
      })
      .catch((e) => resolve(e));
  });
};

const checkLikeTrack = (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/me/tracks/contains?ids=${id}`)
      .then((response: AxiosResponse) => {
        resolve(response.data[0]);
      })
      .catch(resolve);
  });
};

const AudioFeatures = (id: string): Promise<features> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/audio-features/${id}`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch(resolve);
  });
};

export const AddToFav = (id: string) => {
  return new Promise((resolve, reject) => {
    HttpCliente.put(`/me/tracks?ids=${id}`, id)
      .then((response: AxiosResponse) => {
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
      .then((response: AxiosResponse) => {
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
