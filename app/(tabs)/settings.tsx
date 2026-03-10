// app/(tabs)/index.tsx
import SettingsScreen from "@/components/Settings";
import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { ScrollView, View } from "react-native";

export default function Settings() {
	return (
		<>
			<NavBar />
			<ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
				<View style={{ flex: 1 }}>
					<SettingsScreen />
				</View>
			</ScrollView>
		</>
	);
}