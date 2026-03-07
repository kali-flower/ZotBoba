import { styles } from "@/constants/styles";
import { PersonalModel } from "@/src/models/personalModel";
import { Text, View } from "react-native";

type Props = {
    personalModel: PersonalModel
}

export default function UserPreferences( {personalModel}: Props ) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Your Preferences</Text>
            <View style={styles.card}>
                <Text style={styles.prefText}>
                    🚫 Allergies: {personalModel.allergies.join(", ") || "None"}
                </Text>
                <Text style={styles.prefText}>
                    🍬 Sweetness: {personalModel.sweetness}
                </Text>
                <Text style={styles.prefText}>🧊 Ice: {personalModel.ice}</Text>
                <Text style={styles.prefText}>
                    ⭐ Favorite Shops: {personalModel.favoriteShopIds.length}
                </Text>
            </View>
        </View>
    )
}