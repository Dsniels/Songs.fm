import { refreshToken } from "@/Api/SpotifyAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import * as SecureStorage from "expo-secure-store";

const getToken = async () => {

  const token = await SecureStorage.getItemAsync("token");
  return token;
};

axios.defaults.baseURL = process.env.EXPO_PUBLIC_BASE_URL;

axios.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const status = error.response ? error.response.status : null;
//     console.log(status);
//     if (status === 401) {
//       const originalRequest : any = error.config || null ;
//       if (!originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           await refreshToken();
//           const token = await SecureStorage.getItemAsync("token");
//           if (token) {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             console.log(token);
//             return await axios(originalRequest);
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

const requestGenerico = {
  get: (url: string) => axios.get(url),
  post: (url: string, body: any) => axios.post(url, body),
  put : (url: string, body: any) => axios.put(url, body),
  delete: (url: string, body:any) => axios.delete(url, body),
};

export default requestGenerico;
