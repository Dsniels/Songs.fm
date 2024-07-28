import AsyncStorage from "@react-native-async-storage/async-storage";
import { generos } from "./Generos";
import { artist, ItemRespone, song } from "@/types/Card.types";

export const seedGeners = async (seedGeners: string) => {
  await AsyncStorage.setItem("seedGeneros", seedGeners);
};

const extractIDs = <T extends { id: string }>(data: T[]): string[] => {
  const fsd = data.map((i: T) => i.id);
  return fsd;
};

export const seedTracks = async (data: song[]) => {
  const seedPrev = (await AsyncStorage.getItem("seedTrack")) || false;
  let ids: string[] = extractIDs(data);
  let newIds: Set<string>;
  if (seedPrev) {
    const seedArray = convertToArray(seedPrev);
    ids = [...ids, ...seedArray];
    const merge = seedArray.concat(ids);
    newIds = new Set(merge);
    ids = Array.from(newIds);
  }
  await AsyncStorage.setItem("seedTrack", ids.toString());
};

export const seedArtist = async (data: ItemRespone<artist[]>) => {
  const seedPrev = (await AsyncStorage.getItem("seedArtists")) || false;
  let ids: string[] = extractIDs(data.items);
  if (seedPrev) {
    const seedArray = convertToArray(seedPrev);
    ids = [...ids, ...seedArray];
    const newIds = new Set(ids);
    ids = Array.from(newIds);
  }
  await AsyncStorage.setItem("seedArtists", ids.toString());
};

const randomIndex = (array: string[]) => {
  return Math.floor(Math.random() * array.length);
};

const convertToArray = (string: string | null) => {
  return string?.split(",") || [];
};

const getRandomSeedItem = async (key: string) => {
  const seedString = await AsyncStorage.getItem(key);
  const seedArray = convertToArray(seedString);
  return seedArray[randomIndex(seedArray)];
};

export const seeds = async () => {
  let songSeeds: string[] = [];
  let artistSeeds: string[] = [];
  const seedTrack = await getRandomSeedItem("seedTrack");
  const seedTrack2 = await getRandomSeedItem("seedTrack");
  songSeeds = [seedTrack, seedTrack2];
  const seedArtist = await getRandomSeedItem("seedArtists");
  const seedArtist2 = await getRandomSeedItem("seedArtists");
  artistSeeds = [seedArtist, seedArtist2];
  const seedGeneros = generos[randomIndex(generos)];
  return { songs: songSeeds, artists: artistSeeds, generos: seedGeneros };
};
