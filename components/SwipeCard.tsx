import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { CardType, song } from "@/types/Card.types";

export const SwipeCard = <T,>({
  children,
  items,
  setItems,
}: {
  children: (item: song) => React.JSX.Element;
  items: song[];
  setItems: Dispatch<SetStateAction<song[]>>;
}) => {
  const { height } = Dimensions.get("screen");
  const swipe = useRef(new Animated.ValueXY()).current;
  const titlSign = useRef(new Animated.Value(1)).current;
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const isFocused = useIsFocused();
  const removeTopCard = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();      
      setCurrentSound(null);

    }
    setItems((prevState) => prevState.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy, y0 }) => {
        swipe.setValue({ x: dx, y: dy });
        titlSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        const direction = Math.sign(dx);
        const isSwipedOffScreen = Math.abs(dx) > 100;

        if (isSwipedOffScreen) {
          Animated.timing(swipe, {
            duration: 100,
            toValue: {
              x: direction * 500,
              y: dy,
            },
            useNativeDriver: true,
          }).start(removeTopCard);
          return;
        }
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const playSound = 
    async (soundUri: string) => {
      const sound = new Audio.Sound();
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);

      }
      try {
        const { isLoaded } = await sound.loadAsync({ uri: soundUri });
        if (isLoaded) {
          sound.setIsLoopingAsync(true).then(() => sound.playAsync());
          setCurrentSound(sound);

        }
      } catch (_) {
        await sound.unloadAsync();
        setCurrentSound(null);
      }
    }

  useEffect(() => {

    if (items.length > 0) {
      playSound(items[0].preview_url);
    }

  }, [items]);

  const rotate = useMemo(
    () =>
      Animated.multiply(swipe.x, titlSign).interpolate({
        inputRange: [-500, 0, 500],
        outputRange: ["8deg", "0deg", "-8deg"],
      }),
    [swipe]
  );

  const animatedCardStyle = useMemo(
    () => ({
      transform: [...swipe.getTranslateTransform(), { rotate }],
    }),
    [swipe, rotate]
  );

  const playCurrentSound = async () => {
    if (!currentSound) {
      return;
    }
    const status = await currentSound.getStatusAsync();
    if (status?.isLoaded && !status.isPlaying) {
      await currentSound.playAsync();
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (isFocused && currentSound) {
        playCurrentSound();
      }

      const onBlur = async () => {
        if (currentSound) {
          const status = await currentSound.getStatusAsync();
          if (status?.isLoaded) {
            await currentSound.pauseAsync().then(() => currentSound.unloadAsync().then(()=> setCurrentSound(null)));
          }
        }
      };

      return () => onBlur();
    }, [isFocused])
  );
  const getSongDetails = (Item: song) => {
    return router.push({
      pathname: "(app)/songsDetails/[song]",
      params: {
        id: Item.id,
        name: Item.name,
        artists: Item.artists[0].name,
        ImageSong: Item.album.images[0].url,
        preview_url: Item.preview_url,
      },
    });
  };
  return (
    <View>
      <View>
        {items
          .map((item, index: number) => (
            <Animated.View
              key={index}
              style={[index === 0 ? animatedCardStyle : {}]}
              {...(index === 0 ? panResponder.panHandlers : {})}
            >
              <Pressable onPress={() => getSongDetails(item)}>
                {children(item)}
              </Pressable>
            </Animated.View>
          ))
          .reverse()}
      </View>
    </View>
  );
};
