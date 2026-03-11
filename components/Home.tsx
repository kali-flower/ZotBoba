import { styles } from "@/constants/styles";
import { getCurrentUser } from "@/src/storage/currentUserControls";
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
    const chooseNextPage = async () => {
        const user = await getCurrentUser();
        if (user) {
            router.replace("/(tabs)/search");
        } else {
            router.replace("/(tabs)/login");
        }
    }
    return (
        <>
            <View style={homepageStyles.titleContatiner}>
                <Text style={homepageStyles.title}>
                    Welcome to ZotBoba!
                </Text>
                <View style={homepageStyles.button}>
                    <Pressable onPress={chooseNextPage} style={homepageStyles.buttonStyle}>
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
        marginTop: height * -0.45,
        flexGrow: 1
    },
    buttonText: {
        fontSize: 14,
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
        justifyContent: "center",
        paddingTop: 24
    }
})
