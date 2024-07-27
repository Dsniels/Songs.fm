import { styles } from "@/Styles/styles";
import { CardType, Recommendatios } from "@/types/Card.types";
import { View, Image } from "react-native";
import { ThemedText } from "./ThemedText";

const Card = ({ card }: { card: Recommendatios }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.imageCard}
        source={{
          uri:
            card.album.images[0].url ||
            "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        }}
        resizeMode="cover"
      />
      <View style={styles.CardDescription}>
        <ThemedText
          numberOfLines={1}
          type="subtitle"
          style={styles.cardContent}
        >
          {`${card.name}`}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.cardContent, { fontSize: 16 }]}
        >
          {`${card.artists[0].name}`}
        </ThemedText>
      </View>
    </View>
  );
};

export default Card;
