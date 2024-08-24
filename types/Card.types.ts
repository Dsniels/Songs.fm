import { Sound } from "expo-av/build/Audio";

export type CardType = {
	id: string;
	artist: string;
	name: string;
	image: string;
	preview_url: string;
};
export type Track = {
	tracks: { items: Array<song> };
};

export type currentlyPlaying = {
	is_playing: boolean;
	item: song;
};

export type TrackResponse = {
	tracks: Array<song>;
};

export type UrlRequest = {
	seed_geners : string
	seed_tracks : string
	target_energy: number
	target_speechiness: number
	target_danceability: number
	target_popularity: number
	target_valence: number
};
export type album = {
	images: Array<{ url: string }>;
	id: string;
	name: string;
};

export type features = {
	acousticness: number;
	danceability: number;
	energy: number;
	instrumentalness: number;
	liveness: number;
	loudness: number;
	mode: number;
	speechiness: number;
	tempo: number;
	valence: number;
	uri: string;
};

export type song = {
	id: string;
	name: string;
	artists: Array<artist>;
	album: album;
	preview_url: string;
	sound? : Sound
};
export type ResponseAxios<T> = {
	data: T;
};

export type TokenResponse = {
	refresh_token: string;
	access_token: string;
	expira: string;
};

export type Recently = {
	items: Array<{ track: song }>;
};
export type annotations = {
	result: { artist_names: string };
};
export type childrenType = {
	children: Array<childrenType>;
};
export type annotationResponse = {
	children: Array<{ children: Array<string | object> }>;
};

export type user = {
	display_name: string;
	images: Array<{ url: string }>;
};

export type items<T> = {
	item: T;
};
export type ItemRespone<T> = {
	items: T;
};
export type genero = {
	name: string;
	value: number;
};
export type artist = {
	name: string;
	id: string;
	images: Array<{ url: string }>;
	genres: Array<string>;
	popularity: number;
	uri: string;
};

export type Recommendatios = {
	id: string;
	name: string;
	album: album;
	artists: artist[];
	preview_url: string;
};
