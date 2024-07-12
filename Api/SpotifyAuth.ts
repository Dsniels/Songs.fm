import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as AuthSession from 'expo-auth-session';
import { Buffer } from 'buffer'; // Importa Buffer de la librería 'buffer'
import qs from 'querystring'
import { Dispatch } from "react";
import * as Linking from 'expo-linking';
import * as SecureStorage from 'expo-secure-store';



const instancia = axios.create({
    headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(process.env.EXPO_PUBLIC_CLIENTE_ID + ':' + process.env.EXPO_PUBLIC_CLIENTE_SECRET).toString('base64'))
    }
});


export const getAccessToken = async(code: string, dispatch:Dispatch<any>) => {
    const URI = Linking.createURL('login');
    const data = {
        "code" : code,
        "redirect_uri": URI || '',
        "grant_type": 'authorization_code',
    };
    return new Promise((resolve, reject) => {
        instancia.post("https://accounts.spotify.com/api/token", data).then((response: AxiosResponse<any>) => {
            const expira = new Date();
            console.log(response.data)
            expira.setSeconds(expira.getSeconds() + 3600);
            response.data.expira = expira;
            resolve(response)
        }).catch((e: AxiosError) => {
            console.log(JSON.stringify(e.request,null,2))
            throw new Error(`${e}`);
            resolve(e);
        })
    })
}


export const checkToken = async (expira:any)=>{
    const date_actual = new Date();
    if(date_actual >= expira){
        await SecureStorage.deleteItemAsync('token');
    }else{
        await SecureStorage.setItemAsync('expira', expira.toString());
    }
}

export const refreshToken = async () : Promise<AxiosResponse<any>>=>{
    const refresh = await SecureStorage.getItemAsync('refresh_token');
    const body = {
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh,
    }

     return new Promise((resolve, reject)  =>{
        instancia.post('https://accounts.spotify.com/api/token',qs.stringify(body))
                .then( async (response: AxiosResponse) =>{
            
                        const expira = new Date();
                        expira.setSeconds(expira.getSeconds() + 3600 );
                        response.data.expira = expira;
                        checkToken(expira);
                        setTimeout(refreshToken,3600000)
                        await SecureStorage.setItemAsync('token', response.data.access_token);
                        resolve(response)
                      })
                    .catch((e)=>{
                        console.log('error al refrescar token', e)
                        resolve(e)
                    })
    })


}


