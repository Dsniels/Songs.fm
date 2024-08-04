import { Dispatch, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";
import { FavoriteSongs } from "@/Api/SongsActions";

export const useAuth = (dispatch: Dispatch<any>) : Promise<boolean>=> {
	const [servidorResponse, setServidorResponse] = useState(false);
	const isFulfilled = <T,>(
		p: PromiseSettledResult<T>
	): p is PromiseFulfilledResult<T> => p.status === "fulfilled";
	// skipcq: JS-0045
	const getData = async () : Promise<boolean> => {
		const results: Array<PromiseSettledResult<string | null>> =
			await Promise.allSettled([
				SecureStorage.getItemAsync("token"),
				SecureStorage.getItemAsync("expira"),
			]);
		const fulfilledValues = results.filter(isFulfilled).map((p) => p.value);
		if (fulfilledValues[0] == null || fulfilledValues[1] === null) {
        throw new Error("No hay token o expiración");
		  }

		const Today = new Date();
		const expiracion = new Date(fulfilledValues[1] as string);

		if (Today.getTime() >= expiracion.getTime()) {
			await refreshToken();
		}

		if (!servidorResponse) {
			await Promise.all([getprofile(dispatch), FavoriteSongs()]);
			setServidorResponse(true);
      return true;
		}
    return true

}
  return getData()
};
