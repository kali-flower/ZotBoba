import { styles } from "@/constants/styles";
import { ContextData, RankedStore } from "@/constants/types";
import { PersonalModel } from "@/src/models/personalModel";
import RankingEngine from "@/src/services/RankingEngine";
import { Text, View } from "react-native";

type Props = {
    rankedStores: RankedStore[],
    context: ContextData,
    personalModel: PersonalModel | null,
}
export default function RankedStores(props : Props) {

    const rankedStores = props.rankedStores;
    const context = props.context;
    const personalModel = props.personalModel;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Top Recommendations</Text>
            {rankedStores.map((store, index) => {
                const reason = RankingEngine.getReasonForRanking(
                    store,
                    context!,
                    {
                        allergens: personalModel?.allergies || [],
                        favoriteDrinkTypes: ["fruit_tea", "milk_tea"],
                        favoriteShops: personalModel?.favoriteShopIds || [],
                    },
                );

                return (
                    <View key={store.id} style={styles.storeCard}>
                        <View style={styles.storeHeader}>
                            <Text style={styles.storeRank}>#{index + 1}</Text>
                            <View style={styles.storeInfo}>
                                <Text style={styles.storeName}>{store.name}</Text>
                                <Text style={styles.storeCategory}>{store.category}</Text>
                            </View>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.score}>{store.score}</Text>
                                <Text style={styles.scoreLabel}>/100</Text>
                            </View>
                        </View>

                        <Text style={styles.reason}>{reason}</Text>

                        <View style={styles.breakdown}>
                            <Text style={styles.breakdownTitle}>Score Breakdown:</Text>
                            <Text style={styles.breakdownText}>
                                Distance: {store.breakdown.distance} | Weather:{" "}
                                {store.breakdown.weather} | Time:{" "}
                                {store.breakdown.timeOfDay} | Match:{" "}
                                {store.breakdown.userPreference}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    )
} 