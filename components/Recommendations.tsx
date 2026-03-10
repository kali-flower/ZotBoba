// components/RecommendationsScreen.tsx
import CurrentContext from "@/components/CurrentContext";
import RankedStores from "@/components/RankedStores";
import UserPreferences from "@/components/UserPreferences";
import { styles } from "@/constants/styles";
import { ContextData, RankedStore } from "@/constants/types";
import { PersonalModel } from "@/src/models/personalModel";
import ContextAggregator from "@/src/services/ContextAggregator";
import RankingEngine from "@/src/services/RankingEngine";
import StoreDataService from "@/src/services/StoreDataService";
import { loadPersonalModel } from "@/src/storage/personalModelStorage";
import { colors } from "@/src/theme/tokens";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Recommendations() {
  const [context, setContext] = useState<ContextData | null>(null);
  const [rankedStores, setRankedStores] = useState<RankedStore[]>([]);
  const [personalModel, setPersonalModel] = useState<PersonalModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const contextData = (await ContextAggregator.aggregateContext()) as any;
      setContext(contextData as ContextData);

      const userModel = await loadPersonalModel();
      setPersonalModel(userModel);

      const stores = await StoreDataService.getStoresNearLocation(
        contextData.location,
        20,
      );

      const userPrefs = {
        allergens: userModel.allergies,
        favoriteDrinkTypes: ["fruit_tea", "milk_tea"],
        favoriteShops: userModel.favoriteShopIds,
      };

      const ranked = RankingEngine.rankStores(stores, contextData, userPrefs);
      setRankedStores(ranked);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.title}>🧋 ZotBoba</Text>
      <Text style={styles.subtitle}>Context-Aware Recommendations</Text>

      <TouchableOpacity
        onPress={getRecommendations}
        disabled={loading}
        style={{
          backgroundColor: colors.navbar,
          padding: 12,
          borderRadius: 8,
          borderColor: colors.card_border,
          borderWidth: 1,
        }}
      >
        <Text style={{ color: "#333", textAlign: "center", fontWeight: "600" }}>
          {loading ? "Loading..." : "Get Recommendations"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Finding best matches...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {context && !loading && <CurrentContext context={context} />}

      {context && rankedStores.length > 0 && !loading && (
        <RankedStores
          context={context}
          rankedStores={rankedStores}
          personalModel={personalModel}
        />
      )}

      {personalModel && rankedStores.length > 0 && (
        <UserPreferences personalModel={personalModel} />
      )}
    </View>
  );
}