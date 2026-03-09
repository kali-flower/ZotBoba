// app/(tabs)/index.tsx
import SettingsScreen from "@/components/Settings";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { ScrollView } from "react-native";

export default function Settings() {
	return (
		<>
			<NavBar />
			<ScrollView style={styles.container}>
				<SettingsScreen />
				<Footer />
			</ScrollView>
		</>
	);
}