// app/(tabs)/index.tsx
import Background from "@/components/ui/background";
import Footer from "@/components/ui/Footer";
import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { ScrollView } from "react-native";
import Recommendations from "../../components/Recommendations";

export default function Search() {
    return (
        <>
            <NavBar />
            <ScrollView style={styles.container}>
                <Background />
                <Recommendations />
                <Footer />
            </ScrollView>
        </>
    );
}