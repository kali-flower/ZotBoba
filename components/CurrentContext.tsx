import { styles } from "@/constants/styles";
import { ContextData } from "@/constants/types";
import { Text, View } from "react-native";

type Props = {
    context: ContextData
}

export default function CurrentContext({ context }: Props) {

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Current Context</Text>
            <View style={styles.card}>
                <Text style={styles.contextText}>
                    📍 Location: {context.location.distanceFromIrvine.toFixed(1)} mi
                    from Irvine
                </Text>
                <Text style={styles.contextText}>
                    🌡️ Weather: {context.weather.temperature}°F,{" "}
                    {context.weather.condition}
                </Text>
                <Text style={styles.contextText}>
                    🕐 Time: {context.timeOfDay.period} ({context.timeOfDay.hour}
                    :00)
                </Text>
            </View>
        </View>
    )
}