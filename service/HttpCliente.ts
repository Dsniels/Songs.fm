import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AccessTokenRequest } from "expo-auth-session";
import {REACT_APP_BASE_URL} from '@env';
const getToken = async()=>{
    const token = await AsyncStorage.getItem('token');
    return token;    
}

axios.defaults.baseURL = REACT_APP_BASE_URL;

axios.interceptors.request.use( async (config)=>{
    const token = await getToken()
     if(token){
        

        config.headers.Authorization = `Bearer ${token}`;
        return config
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
})


const requestGenerico = {
    get : (url:string) => axios.get(url),
    post : (url:string, body:any) => axios.post(url, body)

}

export default requestGenerico;