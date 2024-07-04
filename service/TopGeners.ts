export const topGeneros = (generos: string[]) => {
    const frec = generos.reduce((acumulador: [string, number][], item: string) => {
        const encontrado = acumulador.find(subArray => subArray[0] === item);
        if (encontrado) {
            encontrado[1] += 1;
        } else {
            acumulador.push([item, 1]);
        }
        return acumulador;
    }, []);

    frec.sort((a, b) => b[1] - a[1]);

    const topGenerosKeys = frec.map(([key, value]) => key);

    
    return topGenerosKeys;
}