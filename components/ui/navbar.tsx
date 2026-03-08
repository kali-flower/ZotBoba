import { colors } from "@/src/theme/tokens";
import { typography } from "@/src/theme/typography";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function NavBar() {
    return (
        <View style={styles.container}>

            <View style={styles.home}>
                <Pressable onPress={() => router.push('/(tabs)')}>
                    <Text style={styles.title}>ZotBoba</Text>
                </Pressable>
            </View>

            <View style={styles.rightButtons}>
                <Pressable onPress={() => router.push('/(tabs)')}>
                    <Text style={styles.subtitle}>Home</Text>
                </Pressable>

                <Pressable onPress={() => router.push('/(tabs)/search')}>
                    <Text style={styles.subtitle}>Search</Text>
                </Pressable>

                <Pressable onPress={() => router.push('/(tabs)/settings')}>
                    <Text style={styles.subtitle}>Account</Text>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        backgroundColor: colors.search_bg,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 30,
        paddingLeft: 30,
        zIndex: 1,
        borderBottomColor: 'black'
    },
    home: {
        justifyContent: "flex-start",
    },
    rightButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16
    },
    title: {
        ...typography.title,
    },
    body: {
        ...typography.body,
    },
    subtitle: {
        ...typography.subtitle,
    },
});