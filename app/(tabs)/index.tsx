// app/(tabs)/index.tsx
// Full working demo - Context + Stores + Ranking + PersonalModel
// Week 7/8 - Complete Pipeline

import { useState } from "react";
import {
	ActivityIndicator,
	Button,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { PersonalModel } from "../../src/models/personalModel";
import ContextAggregator from "../../src/services/ContextAggregator";
import RankingEngine from "../../src/services/RankingEngine";
import StoreDataService from "../../src/services/StoreDataService";
import { loadPersonalModel } from "../../src/storage/personalModelStorage";

type ContextData = {
	location: {
		latitude: number;
		longitude: number;
		distanceFromIrvine: number;
		withinRadius: boolean;
	};
	weather: {
		temperature: number;
		condition: string;
		description: string;
	};
	timeOfDay: {
		period: string;
		hour: number;
	};
};

type RankedStore = {
	id: string;
	name: string;
	score: number;
	category: string;
	latitude: number;
	longitude: number;
	breakdown: {
		distance: number;
		weather: number;
		timeOfDay: number;
		userPreference: number;
	};
};

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
				)}

				{/* Ranked Stores */}
				{rankedStores.length > 0 && !loading && (
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
				)}

				{/* User Preferences Display */}
				{personalModel && rankedStores.length > 0 && (
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
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	content: {
		padding: 20,
		paddingTop: 60,
		paddingBottom: 40,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 5,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		color: "#666",
		marginBottom: 20,
		textAlign: "center",
	},
	loadingContainer: {
		marginTop: 30,
		alignItems: "center",
	},
	loadingText: {
		marginTop: 10,
		color: "#666",
	},
	errorContainer: {
		marginTop: 20,
		padding: 15,
		backgroundColor: "#fee",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#fcc",
	},
	errorTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 5,
	},
	errorText: {
		color: "#c00",
	},
	section: {
		marginTop: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
	},
	card: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	contextText: {
		fontSize: 14,
		marginBottom: 8,
		color: "#333",
	},
	storeCard: {
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	storeHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	storeRank: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#0066cc",
		marginRight: 12,
		width: 40,
	},
	storeInfo: {
		flex: 1,
	},
	storeName: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 2,
	},
	storeCategory: {
		fontSize: 12,
		color: "#666",
		textTransform: "capitalize",
	},
	scoreContainer: {
		alignItems: "center",
	},
	score: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#0066cc",
	},
	scoreLabel: {
		fontSize: 12,
		color: "#666",
	},
	reason: {
		fontSize: 14,
		color: "#555",
		fontStyle: "italic",
		marginBottom: 10,
		paddingLeft: 52,
	},
	breakdown: {
		paddingLeft: 52,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#eee",
	},
	breakdownTitle: {
		fontSize: 12,
		fontWeight: "600",
		color: "#666",
		marginBottom: 4,
	},
	breakdownText: {
		fontSize: 11,
		color: "#888",
	},
	prefText: {
		fontSize: 14,
		marginBottom: 8,
		color: "#333",
	},
});
