import AsyncStorage from "@react-native-async-storage/async-storage";
import { generos } from "./Generos";
import { artist, ItemRespone, song } from "@/types/Card.types";

const extractIDs = <T extends { id: string }>(data: T[]): string[] => {
  return data.map((item) => item.id);
};

export const mergeAndStore = async (key: string, newItems: string[]) => {
  const existingItems = await AsyncStorage.getItem(key);
  const existingArray = existingItems ? convertToArray(existingItems) : [];
  const mergedArray = Array.from(new Set([...existingArray, ...newItems]))
  await AsyncStorage.setItem(key, mergedArray.toString());
  

};

export const seedGeners = async (seedGeners: string) => {
  await AsyncStorage.setItem("seedGeneros", seedGeners);
};

export const seedTracks = (data: song[]) => {
  const ids = extractIDs(data);
  queueMicrotask(()=> mergeAndStore("seedTrack", ids));
};

export const seedArtist = (data: ItemRespone<artist[]>) => {
  const ids = extractIDs(data.items);
  queueMicrotask(()=> mergeAndStore("seedArtists", ids));
};

const getRandomIndex = (length: number) : number => Math.floor(Math.random() * length);

const convertToArray = (str: string | null) => str?.split(",") || [];

const getRandomSeedItem = async (key: string) => {
  const seedString = await AsyncStorage.getItem(key);
  const seedArray = convertToArray(seedString);
  return seedArray[getRandomIndex(seedArray.length)];
};

export const seeds = async () => {
  const [seedTrack1, seedTrack2, seedArtist1, seedArtist2] = await Promise.all([
    getRandomSeedItem("seedTrack"),
    getRandomSeedItem("seedTrack"),
    getRandomSeedItem("seedArtists"),
    getRandomSeedItem("seedArtists"),
  ]);

  const seedGeneros = generos[getRandomIndex(generos.length)];
  return {
    songs: [seedTrack1, seedTrack2],
    artists: [seedArtist1, seedArtist2],
    generos: seedGeneros,
  };
};
