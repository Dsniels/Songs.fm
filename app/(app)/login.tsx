import { Pressable, SafeAreaView, Text, ToastAndroid } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { useStateValue } from "@/Context/store";
import * as Linking from "expo-linking";
import * as SecureStorage from "expo-secure-store";
import * as Haptics from "expo-haptics";
import { checkToken, getAccessToken } from "@/Api/SpotifyAuth";
import { ResponseAxios, TokenResponse } from "@/types/Card.types";
import { getprofile } from "@/Api/UserAction";

WebBrowser.maybeCompleteAuthSession();
export default function login() {
	const [{ SesionUsuario }, dispatch] = useStateValue();

	const discovery = {
		authorizationEndpoint: "https://accounts.spotify.com/authorize",
		tokenEndpoint: "https://accounts.spotify.com/api/token",
	};
	const [_, response, promptAsync]: any = AuthSession.useAuthRequest(
		{
			clientId: process.env.EXPO_PUBLIC_CLIENTE_ID || "",
			clientSecret: process.env.EXPO_PUBLIC_CLIENTE_SECRET || "",
			scopes: [
				"user-read-email",
				"user-read-private",
				"user-read-currently-playing",
				"user-top-read",
				"user-read-recently-played, user-library-read, user-library-modify,user-library-modify",
			],
			responseType: "code",
			redirectUri: Linking.createURL("login"),
			usePKCE: false,
		},
		discovery
	);
	const storeData = async (key: string, data: string) => {
		try {
			await SecureStorage.setItemAsync(key, data);
		} catch (error) {
			throw new Error(`${error}`);
		}
	};

	const handleResponse = async (AccessCode: string) => {
		const response: ResponseAxios<TokenResponse> = await getAccessToken(
			AccessCode
		);
		const { refresh_token, access_token, expira } = response.data;
		checkToken(new Date(expira));

		if (access_token) {
			Promise.all([
				storeData("token", access_token),
				storeData("refresh_token", refresh_token),
			]).then(() => {
				getprofile(dispatch).then(() => {
					Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
					ToastAndroid.showWithGravity(
						"Sesion Iniciada",
						ToastAndroid.SHORT,
						ToastAndroid.CENTER
					);
					return router.replace("/(tabs)");
				});
			});
		}
	};

	useEffect(() => {
		if (response?.type === "success") {
			const { code } = response.params;
			handleResponse(code);
		}
	}, [response]);

	return (
		<SafeAreaView className="flex-1 align-middle justify-center items-center bg-slate-900 ">
			<ThemedText type="subtitle">Connect your Account </ThemedText>
			<Pressable
				className="flex rounded-lg m-4 p-3 w-auto h-auto bg-green-500"
				onPress={() => promptAsync()}
			>
				<Text className="text-cyan-100 ">Log In</Text>
			</Pressable>
		</SafeAreaView>
	);
}
