import { album, artist, song, TrackResponse } from "@/types/Card.types";
import HttpCliente from "../service/HttpCliente";
import { refreshToken } from "./SpotifyAuth";
import { AxiosResponse } from "axios";

const infoArtista = (id: string): Promise<artist> => {
  return new Promise((resolve, _) => {
    HttpCliente.get(`/artists/${id}`)
      .then((response: AxiosResponse) => {
        resolve(response.data || {});
      })
      .catch((_) => refreshToken());
  });
};

const TopSongsArtista = (id: string): Promise<song[]> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/artists/${id}/top-tracks`)
      .then((response: AxiosResponse<TrackResponse>) => {
        resolve(response.data.tracks || []);
      })
      .catch((_) => reject(refreshToken()));
  });
};

const TopAlbumsArtista = (id: string): Promise<album[]> => {
  return new Promise((resolve, _) => {
    HttpCliente.get(`/artists/${id}/albums?limit=10`)
      .then((response: AxiosResponse) => {
        resolve(response.data.items || []);
      })
      .catch((_) => refreshToken());
  });
};

const similarArtist = (id: string): Promise<artist[]> => {
  return new Promise((resolve, _) => {
    HttpCliente.get(`/artists/${id}/related-artists`)
      .then((response: AxiosResponse) => {
        resolve(response.data.artists || []);
      })
      .catch((_) => refreshToken());
  });
};
export const getArtistInformation = async (id: string) => {
  const [info, songs, albums, artists] = await Promise.all([
    infoArtista(id),
    TopSongsArtista(id),
    TopAlbumsArtista(id),
    similarArtist(id),
  ]);
  return { Info: info, Songs: songs, Albums: albums, Artists: artists };
};
