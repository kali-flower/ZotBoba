// app/(tabs)/index.tsx
import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { ScrollView, View } from "react-native";
import Recommendations from "../../components/Recommendations";

export default function Search() {
    return (
        <>
            <NavBar />
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <Recommendations />
                    <View style={styles.circleTopLeft} />
                    <View style={styles.circleBottomLeft} />
                    <View style={styles.circleCenterCenter} />
                    <View style={styles.circleBottomCenter} />
                    <View style={styles.circleBottomRight} />
                    <View style={styles.circleTopRight} />
                    <View style={styles.circleCenterRight} />
                </View>
            </ScrollView>
        </>
    );
}