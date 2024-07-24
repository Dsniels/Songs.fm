import { Axios, AxiosError, AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { seeds } from "@/service/seeds";
import { refreshToken } from "./SpotifyAuth";
import { ToastAndroid } from "react-native";





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

export const getRecomendations = async (): Promise<any> => {
  const {songs, artists, generos} = await seeds();
  const randomDanceability =Math.random()*0.5+0.5;
  const randomPopularity = Math.floor(Math.random() * 100);
  const randomValence = Math.random()*0.5+0.5;
  const randomEnergy = Math.random()*0.5+0.5;
  
  return new Promise((resolve, reject) => {
    HttpCliente.get(
      `/recommendations?seed_tracks=${songs}&seed_genres=${generos.replaceAll(' ','-')}&min_energy=${randomEnergy}&seed_artists=${artists}&target_danceability=${randomDanceability}&target_popularity=${randomPopularity}&min_valence${randomValence}`
    )
      .then((response: AxiosResponse) => {
        resolve(response.data?.tracks );
      })
      .catch((e: AxiosError) => {
        ToastAndroid.showWithGravity('Ocurrio un error con el servidor', ToastAndroid.SHORT, ToastAndroid.CENTER);
        console.log(e)
        resolve(e);
      });
  });
};

export const getRecentlySongs =()=>{
  return new Promise((resolve, reject)=>{
    HttpCliente.get('/me/player/recently-played?limit=20').then((response)=>{
      resolve(response.data)
    }).catch((e)=>{
      resolve})
  })
}

export const getListOfSongs = (
  tracks: string[]
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks?ids=${tracks}`)
      .then((response: AxiosResponse) => {
        resolve(response.data.tracks);
      })
      .catch((e: any) => {
        refreshToken()
        resolve(e);
      });
  });
};

export const getSongInfo = async (id:string) =>{
  const [info, features, like] = await Promise.all([songInfo(id), AudioFeatures(id), checkLikeTrack(id)]);
  console.log(typeof like)
  return {Info : info, Features : features, Like : like};
}

const songInfo = (id : string) =>{
  return new Promise ((resolve, reject) =>{
    HttpCliente.get(`/tracks/${id}`).then((response : any) =>{
      resolve(response.data || {})
    }).catch((e)=>resolve(e))
  })
}

const checkLikeTrack = (id:string) =>{
  return new Promise((resolve, reject)=>{
    HttpCliente.get(`/me/tracks/contains?ids=${id}`).then((response:any)=>{
      resolve(response.data[0])
    }).catch(resolve)
  })
}



const AudioFeatures = (id:string) : Promise<any> =>{
  return new Promise((resolve, reject)=>{
    HttpCliente.get(`/audio-features/${id}`).then((response:any)=>{
      resolve(response.data)
    }).catch(resolve)
  })
}


