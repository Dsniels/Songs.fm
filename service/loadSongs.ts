import { song } from "@/types/Card.types";
import { Sound } from "expo-av/build/Audio";

export const loadSongs = (songs: Array<song>): Promise<Array<song>> => {
	let result: Array<song> = new Array(songs.length);
	let count = 0;
	return new Promise((resolve, _) => {
		songs.forEach((sg, i) => {
			const snd = new Sound();
			snd.loadAsync({ uri: sg.preview_url }, { isLooping: true }).then(
				() => {
					sg.sound = snd;
					result[i] = sg;
					count++;
					if (count === songs.length) resolve(result);
				}
			);
		});
	});
};
