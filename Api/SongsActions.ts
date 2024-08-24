import { AxiosError, AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import { seeds, seedTracks } from "@/service/seeds";
import { refreshToken } from "./SpotifyAuth";
import { ToastAndroid } from "react-native";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
import {
	currentlyPlaying,
	features,
	ItemRespone,
	Recently,
	Recommendatios,
	song,
	Track,
	TrackResponse,
	UrlRequest,
} from "@/types/Card.types";

export const getTop = <T>(
	type: string,
	time_range: string,
	offset = 0
): Promise<T> => {
	return new Promise((resolve, reject) => {
		HttpCliente.get(
			`/me/top/${type}?offset=${offset}&time_range=${time_range}`
		)
			.then((response: AxiosResponse<T>) => {
				resolve(response.data);
			})
			.catch((e) => {
				reject(e);
			});
	});
};

export const search = (t: string): Promise<Track> => {
	return new Promise((resolve, _) => {
		HttpCliente.get(`search?q=${t}&type=artist%2Ctrack`).then(
			(response) => {
				resolve(response.data);
			}
		);
	});
};
export const GetCurrentlyPlayingSong = (): Promise<currentlyPlaying> => {
	return new Promise((resolve, reject) => {
		HttpCliente.get("/me/player/currently-playing")
			.then((response: AxiosResponse<currentlyPlaying>) => {
				resolve(response.data);
			})
			.catch((e) => reject(e));
	});
};

const buildParams = async (minEnergy: number = 1, minDance: number = 1) => {
	const { songs, geners } = await seeds();
	const randomDanceability = Math.random();
	const randomPopularity = Math.floor(Math.random() * 100 - 10);
	const randomValence = Math.random();
	const randomEnergy = Math.random();
	const randomSpeechiness = Math.random();
	const objects: Array<UrlRequest> = [
		{
			seed_geners : geners.toString(),
			seed_tracks: songs.toString(),
			target_danceability: randomDanceability * minDance,
			target_energy: randomEnergy * minEnergy,
			target_popularity: randomPopularity,
			target_speechiness: randomSpeechiness,
			target_valence: randomValence,
		},
	];

	const params = objects
		.map((i) =>
			Object.entries(i)
				.map(([key, value]) => `${key}=${value}`)
				.join("&")
		)
		.toString();

	return params;
};

export const getRecomendations = async (): Promise<Recommendatios[]> => {
	const params = await buildParams();
	return new Promise((resolve, reject) => {
		HttpCliente.get(`/recommendations?limit=31&${params}`)
			.then((response: AxiosResponse<TrackResponse>) => {
				if (response.data.tracks.length > 0) {
					resolve(response.data.tracks);
				} else {
					reject();
				}
			})
			.catch((e: AxiosError) => {
				console.log(e);
				reject(e);
			});
	});
};

export const getRecentlySongs = (): Promise<Recently> => {
	return new Promise((resolve, reject) => {
		HttpCliente.get("/me/player/recently-played?limit=15")
			.then((response) => {
				resolve(response.data);
			})
			.catch((e) => {
				reject(e);
			});
	});
};

export const getListOfSongs = (
	tracks: string[]
): Promise<AxiosResponse<song[]>> => {
	return new Promise((resolve, _) => {
		HttpCliente.get(`/tracks?ids=${tracks}`)
			.then((response: AxiosResponse) => {
				resolve(response.data.tracks);
			})
			.catch((e: AxiosResponse) => {
				resolve(e);
			});
	});
};

export const FavoriteSongs = (): Promise<song[]> => {
	return new Promise((resolve, reject) => {
		HttpCliente.get("/me/tracks?limit=50&offset=200")
			.then((Response: AxiosResponse<ItemRespone<song[]>>) => {
				queueMicrotask(() => seedTracks(Response.data.items));
				resolve(Response.data.items);
			})
			.catch(reject);
	});
};

const songInfo = (id: string): Promise<song> => {
	return new Promise((resolve, reject) => {
		HttpCliente.get(`/tracks/${id}`)
			.then((response: AxiosResponse) => {
				resolve(response.data || {});
			})
			.catch((e) => reject(e));
	});
};

const checkLikeTrack = (id: string): Promise<boolean> => {
	return new Promise((resolve, _) => {
		HttpCliente.get(`/me/tracks/contains?ids=${id}`)
			.then((response: AxiosResponse) => {
				resolve(response.data[0]);
			})
			.catch(refreshToken);
	});
};

const AudioFeatures = (id: string): Promise<features> => {
	return new Promise((resolve, _) => {
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
					ToastAndroid.TOP
				);
				reject(e);
			});
	});
};

export const deleteFromFav = (id: string) => {
	return new Promise((resolve, reject) => {
		HttpCliente.delete(`/me/tracks?ids=${id}`)
			.then(() => {
				resolve(notificationAsync(NotificationFeedbackType.Warning));
			})
			.catch((e) => {
				ToastAndroid.showWithGravity(
					`Ocurrio un error: ${e.code}`,
					ToastAndroid.SHORT,
					ToastAndroid.TOP
				);

				reject(e);
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
