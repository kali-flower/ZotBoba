import { StyleSheet, Text, View } from "react-native";

export function StoresClosed() {
    return (
        <View style={storesClosedStyles.container}>
            <Text>No open stores found. Please try again later.</Text>
        </View>
    )
}


const storesClosedStyles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 15,
    }
});