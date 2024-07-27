
export type CardType ={
        artist : string;
        name : string;
        image : string;
        preview_url:string;
        

}


export type album =  {
        images : Array<{url : string}>;

}
export type song = {
        id  :string;
        name  :string;
        artists : Array<artist>;
        album : album;
}

export type Recently = {
        items: Array<{track : song }>
}
export type annotations ={
        result : {artist_names:string}
}
export type annotationResponse ={
        children : Array<{children : string | object}>
}

export type genero ={
        item:{name : string, value:number};
}
export type artist = {
        name : string;
        id? : string;
        images : Array<{ur:string}>;
}

export type Recommendatios  = {
        id : string;
        name : string;
        album : album;
        artists : artist[];
        preview_url? : string;
}
