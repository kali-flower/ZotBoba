import { colors } from "@/src/theme/tokens";
import { typography } from "@/src/theme/typography";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function NavBar() {
    return (
        <View style={styles.container}>

            <View style={styles.home}>
                <Pressable onPress={() => console.log("Home1")}>
                    <Text style={styles.title}>ZotBoba</Text>
                </Pressable>
            </View>

            <View style={styles.rightButtons}>
                <Pressable onPress={() => console.log("Home2")}>
                    <Text style={styles.subtitle}>Home</Text>
                </Pressable>

                <Pressable onPress={() => console.log("Search")}>
                    <Text style={styles.subtitle}>Search</Text>
                </Pressable>

                <Pressable onPress={() => console.log("Account")}>
                    <Text style={styles.subtitle}>Account</Text>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        backgroundColor: colors.navbar,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 30,
        paddingLeft: 30,
        zIndex: 1,
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