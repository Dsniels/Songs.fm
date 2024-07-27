import { album, artist, song } from "@/types/Card.types";
import HttpCliente from "../service/HttpCliente";
import { refreshToken } from "./SpotifyAuth";

export const getArtistInformation = async (id: string) => {
  const [info, songs, albums, artists] = await Promise.all([
    infoArtista(id),
    TopSongsArtista(id),
    TopAlbumsArtista(id),
    similarArtist(id),
  ]);
  return { Info: info, Songs: songs, Albums: albums, Artists: artists };
};

const infoArtista = (id: string): Promise<artist> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/artists/${id}`)
      .then((response: any) => {
        resolve(response.data || {});
      })
      .catch((e) => {
        refreshToken();
      });
  });
};

const TopSongsArtista = (id: string): Promise<song[]> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/artists/${id}/top-tracks`)
      .then((response: any) => {
        resolve(response.data.tracks || []);
      })
      .catch((e) => refreshToken());
  });
};

const TopAlbumsArtista = (id: string): Promise<album[]> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/artists/${id}/albums?limit=10`)
      .then((response: any) => {
        resolve(response.data.items || []);
      })
      .catch((e) => refreshToken());
  });
};

const similarArtist = (id: string): Promise<artist[]> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/artists/${id}/related-artists`)
      .then((response: any) => {
        resolve(response.data.artists || []);
      })
      .catch((e) => refreshToken());
  });
};
