import { song, Track } from '@/types/Card.types';
import { Dispatch, SetStateAction } from 'react'
import { FlatList, Modal, NativeSyntheticEvent, TextInput, TextInputTextInputEventData, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { SmallListSongs } from './SmallListSongs';

export const SearchModal = ({
  showModal,
  setShowModal,
  text,
  items,
  handleSearch,
  handleTextChange,
  getSongDetails,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  text: string;
  items: Track;
  handleSearch:
    | ((e: NativeSyntheticEvent<TextInputTextInputEventData>) => void)
    | undefined;
  handleTextChange: ((text: string) => void) | undefined;
  getSongDetails: ((item: song) => void) | undefined;
}) => {
  return (
    <Modal
      className="bg-[#000818] m-0 rounded-lg"
      animationType="slide"
      visible={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <View className="flex-1 p-2 bg-[#000818]">
        <ThemedView className="bg-[#000818] flex  align-middle items-center p-2 content-center m-1 text-white  flex-row">
          <Ionicons name="search" size={24} color="white" />
          <TextInput
            className="flex-auto bg-blue-950 text-white p-3 m-2 rounded-2xl"
            value={text}
            clearTextOnFocus
            onTextInput={handleSearch}
            onChangeText={handleTextChange}
          />
        </ThemedView>

        {items && showModal ? (
          <FlatList
            data={items.tracks.items}
            renderItem={({ item }) => (
              <SmallListSongs item={item} getSongDetails={getSongDetails} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </View>
    </Modal>
  );
}