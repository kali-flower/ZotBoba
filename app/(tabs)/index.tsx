// app/(tabs)/index.tsx
import Home from "@/components/Home";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { ScrollView } from "react-native";

export default function App() {
	return (
		<>
			<NavBar />
			<ScrollView style={styles.container}>
				<Home />
				<Footer />
			</ScrollView>
		</>
	);
}