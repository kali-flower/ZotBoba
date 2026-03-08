// app/(tabs)/index.tsx
import Background from "@/components/ui/background";
import Footer from "@/components/ui/footer";
import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { ScrollView } from "react-native";
import Recommendations from "../../components/Recommendations";
import SettingsScreen from "@/components/Settings";

export default function Settings() {
	return (
		<>
			<NavBar />
			<ScrollView style={styles.container}>
				<SettingsScreen />
			</ScrollView>
			<Footer />
		</>
	);
}