import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import { SwipeCard } from "@/components/SwipeCard";
import { Recommendatios, song } from "@/types/Card.types";

export default function music() {
	const [data, setData] = useState<song[]>([]);

	const fetchData = useCallback(async (): Promise<void> => {
		try{
		const data_response: Recommendatios[] = await getRecomendations();
		const data_result = data_response.filter(
			(i: Recommendatios) => i.preview_url !== null
		);
		setData((prev)=>[...prev, ...data_result]);
	}catch(_){
		fetchData()
	}
		
	}, []);



	useEffect(() => {
		if (data.length <= 10) {
			fetchData()
		}
	}, [data ]);

  
	return (
		<SafeAreaView style={{ backgroundColor: "#000818", flex: 1 }}>
			{data.length > 0 ? (
				<View
					style={{ display: "flex", marginTop: 10, marginBottom: 10 }}
				>
					<SwipeCard items={data} setItems={setData}>
						{(item: Recommendatios) => <Card card={item} />}
					</SwipeCard>
				</View>
			) : (
				<View style={{ flex: 1, justifyContent: "center" }}>
					<ActivityIndicator size="large" />
				</View>
			)}
		</SafeAreaView>
	);
}
