import { seedGeners } from "./seeds";

export const topGeneros = (data: any) => {
  const generos_data = data.items?.map((item: any) => item.genres).flat() || [];
  const frec = generos_data?.reduce((sum: [string, number][], item: string) => {
    const encontrado = sum.find((subArray) => subArray[0] === item);
    if (encontrado) {
      encontrado[1] += 1;
    } else {
      sum.push([item, 1]);
    }
    return sum;
  }, []);

  frec.sort((a: any, b: any) => b[1] - a[1]);
  // const seed: string = frec
  //   .map((i: any) => i[0])
  //   .toString();
  // seedGeners(seed);
  const result = frec
    .map(([name, value]: [string, number]) => ({ name, value }))
    .slice(0, 9);

  return result;
};
