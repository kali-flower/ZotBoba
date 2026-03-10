import { styles } from "@/constants/styles";
import { colors } from "@/src/theme/tokens";
import { router } from "expo-router";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


const { width, height } = Dimensions.get('window');

export default function Home() {
    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'flex-start', flexGrow: 1 }}>
                <View style={{ flex: 1 }}>
                    <HomePage />
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
    )
}


function HomePage() {
    return (
        <>
            <View style={homepageStyles.titleContatiner}>
                <Text style={homepageStyles.title}>
                    Welcome to ZotBoba!
                </Text>

                {/* TODO: link to login or get recommendations when logging in */}
                {/* currently links to just recommendations page */}
                <View style={homepageStyles.button}>
                    <Pressable onPress={() => router.push('/(tabs)/search')} style={homepageStyles.buttonStyle}>
                        <Text style={styles.title}>Get Started</Text>
                    </Pressable>
                </View>
            </View>
        </>
    )
}

const homepageStyles = StyleSheet.create({
    title: {
        fontSize: 50,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
    },
    titleContatiner: {
        flex: 1,
        justifyContent: "center",
        marginTop: height * -0.4
    },
    buttonText: {
        fontSize: 16,
        textAlign: "center",
        color: "#333",
    },
    buttonStyle: {
        backgroundColor: colors.navbar,
        borderColor: colors.card_border,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 17,
        paddingHorizontal: 0,
        paddingVertical: 12,
        justifyContent: "center",
        width: width * 0.4,
        alignSelf: "center"
    },
    button: {
        justifyContent: "center"
    }
})
