import { styles } from "@/Styles/styles";
import { CardType } from "@/types/Card.types";
import { View, Image, Text } from "react-native";
import { ThemedText } from "./ThemedText";

const Card = ({ card, isFirst, swipe }: { card: CardType, isFirst: any, swipe: any }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.imageCard}
        source={{ uri: card.image || 'https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
        resizeMode="cover"
      />
      <View style={styles.CardDescription}>
        <ThemedText type="defaultSemiBold" style={styles.cardContent}> {`${card.name}`}</ThemedText>
        <ThemedText type="default" style={[styles.cardContent, {fontSize:16}]}> {`${card.artist}`}</ThemedText>

      </View>
    </View>
  );
};

export default Card;
