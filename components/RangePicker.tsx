import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { ThemedText } from "./ThemedText";
import { Picker } from "@react-native-picker/picker";

const RangePicker = ({
	selectDate,
	setSelectDate,
}: {
	selectDate: string;
	setSelectDate: Dispatch<SetStateAction<string>>;
}) => {
	return (
		<View className="flex flex-row items-center justify-center align-middle">
			<ThemedText type="defaultSemiBold">Range</ThemedText>
			<Picker
				dropdownIconColor="white"
				mode="dialog"
				style={{ color: "white", width: 225 }}
				selectedValue={selectDate}
				onValueChange={(value) => setSelectDate(value)}
			>
				<Picker.Item
					color="#060C19"
					label="en el ultimo mes"
					value={"short_term"}
				/>
				<Picker.Item
					color="#060C19"
					label="en los ultimos 6 meses"
					value={"medium_term"}
				/>
				<Picker.Item
					color="#060C19"
					label="en el ultimo Año"
					value={"long_term"}
				/>
			</Picker>
		</View>
	);
};

export default RangePicker;
