// app/(tabs)/index.tsx
// Full working demo - Context + Stores + Ranking + PersonalModel
// Week 7/8 - Complete Pipeline

import CurrentContext from "@/components/CurrentContext";
import RankedStores from "@/components/RankedStores";
import UserPreferences from "@/components/UserPreferences";
import { styles } from "@/constants/styles";
import { ContextData, RankedStore } from "@/constants/types";
import { useState } from "react";
import {
	ActivityIndicator,
	Button,
	ScrollView,
	Text,
	View
} from "react-native";
import { PersonalModel } from "../../src/models/personalModel";
import ContextAggregator from "../../src/services/ContextAggregator";
import RankingEngine from "../../src/services/RankingEngine";
import StoreDataService from "../../src/services/StoreDataService";
import { loadPersonalModel } from "../../src/storage/personalModelStorage";



export default function App() {
	const [context, setContext] = useState<ContextData | null>(null);
	const [rankedStores, setRankedStores] = useState<RankedStore[]>([]);
	const [personalModel, setPersonalModel] = useState<PersonalModel | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getRecommendations = async () => {
		setLoading(true);
		setError(null);

		try {
			console.log("🚀 Starting recommendation pipeline...");

			// Step 1: Get context
			console.log("📍 Getting context...");
			const contextData = (await ContextAggregator.aggregateContext()) as any;
			setContext(contextData as ContextData);
			console.log("✅ Context:", contextData);

			// Step 2: Load user preferences
			console.log("👤 Loading user preferences...");
			const userModel = await loadPersonalModel();
			setPersonalModel(userModel);
			console.log("✅ Personal model:", userModel);

			// Step 3: Get nearby stores
			console.log("🏪 Getting stores...");
			const stores = await StoreDataService.getStoresNearLocation(
				contextData.location,
				20, // 20 mile radius
			);
			console.log(`✅ Found ${stores.length} stores`);

			// Step 4: Convert PersonalModel to RankingEngine format
			const userPrefs = {
				allergens: userModel.allergies, // Note: they call it 'allergies'
				favoriteDrinkTypes: ["fruit_tea", "milk_tea"], // Hardcoded for now
				favoriteShops: userModel.favoriteShopIds,
			};

			// Step 5: Rank them!
			console.log("🎯 Ranking stores...");
			const ranked = RankingEngine.rankStores(stores, contextData, userPrefs);
			setRankedStores(ranked);
			console.log("✅ Top 5 ranked!");

			console.log("🎉 Pipeline complete!");
		} catch (err) {
			setError((err as Error).message);
			console.error("❌ Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>🧋 ZotBoba</Text>
				<Text style={styles.subtitle}>Context-Aware Recommendations</Text>

				<Button
					title={loading ? "Loading..." : "Get Recommendations"}
					onPress={getRecommendations}
					disabled={loading}
				/>

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

				{/* Context Display */}
				{context && !loading && (
					<CurrentContext context={context} />
				)}

				{/* Ranked Stores */}
				{context && rankedStores.length > 0 && !loading && (
					<RankedStores context={context} rankedStores={rankedStores} personalModel={personalModel} />
				)}

				{/* User Preferences Display */}
				{personalModel && rankedStores.length > 0 && (
					<UserPreferences personalModel={personalModel} />
				)}
			</View>
		</ScrollView>
	);
}

