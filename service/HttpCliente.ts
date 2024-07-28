
import axios, {
} from "axios";
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
  },
);

const requestGenerico = {
  get: (url: string) => axios.get(url),
  post: (url: string, body: string) => axios.post(url, body),
  put: (url: string, body: string) => axios.put(url, body),
  delete: (url: string, body?: string | string[]) => axios.delete(url, { data: body }),
};

export default requestGenerico;
