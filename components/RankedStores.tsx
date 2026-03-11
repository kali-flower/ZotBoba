import { styles } from "@/constants/styles";
import { ContextData, RankedStore } from "@/constants/types";
import { PersonalModel } from "@/src/models/personalModel";
import RankingEngine from "@/src/services/RankingEngine";
import { getCurrentUser } from "@/src/storage/currentUserControls";
import {
    savePersonalModel
} from "@/src/storage/personalModelUse";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

type Props = {
	rankedStores: RankedStore[];
	context: ContextData;
	personalModel: PersonalModel | null;
};

export default function RankedStores(props: Props) {
	const rankedStores = props.rankedStores;
	const context = props.context;
	const [personalModel, setPersonalModel] = useState(props.personalModel);

	const toggleFavorite = async (storeId: string) => {
		if (!personalModel) return;

		const username = await getCurrentUser();
		if (!username) {
			Alert.alert("Error", "Please log in to save favorites");
			return;
		}

		const isFavorite = personalModel.favoriteShopIds.includes(storeId);
		const updatedFavorites =
			isFavorite ?
				personalModel.favoriteShopIds.filter((id) => id !== storeId)
			:	[...personalModel.favoriteShopIds, storeId];

		const updatedModel = {
			...personalModel,
			favoriteShopIds: updatedFavorites,
		};
		setPersonalModel(updatedModel);
		await savePersonalModel(username, updatedModel);
	};

	const rateStore = async (
		storeId: string,
		storeName: string,
		rating: number,
	) => {
		if (!personalModel) return;

		const username = await getCurrentUser();
		if (!username) {
			Alert.alert("Error", "Please log in to rate stores");
			return;
		}

		// Remove existing rating for this store if any
		const existingRatings =
			personalModel.ratings?.filter((r) => r.storeId !== storeId) || [];

		// Add new rating
		const newRating = {
			storeId,
			storeName,
			rating,
			ratedAt: new Date().toISOString(),
		};

		const updatedModel = {
			...personalModel,
			ratings: [...existingRatings, newRating],
		};

		setPersonalModel(updatedModel);
		await savePersonalModel(username, updatedModel);
	};

	const getStoreRating = (storeId: string): number | null => {
		if (!personalModel?.ratings) return null;
		const rating = personalModel.ratings.find((r) => r.storeId === storeId);
		return rating ? rating.rating : null;
	};

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>⭐ Top Recommendations</Text>
			{rankedStores.map((store, index) => {
				const reason = RankingEngine.getReasonForRanking(store, context!, {
					allergens: personalModel?.allergies || [],
					favoriteDrinkTypes: ["fruit_tea", "milk_tea"],
					favoriteShops: personalModel?.favoriteShopIds || [],
				});

				const isFavorite = personalModel?.favoriteShopIds.includes(store.id);
				const currentRating = getStoreRating(store.id);

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

						{/* Rating Stars and Favorite Button */}
						<View style={styles.actionsRow}>
							<Text style={styles.actionLabel}>Rate:</Text>
							<View style={styles.starsContainer}>
								{[1, 2, 3, 4, 5].map((star) => (
									<TouchableOpacity
										key={star}
										onPress={() => rateStore(store.id, store.name, star)}
									>
										<Text style={styles.star}>
											{currentRating && star <= currentRating ? "⭐" : "☆"}
										</Text>
									</TouchableOpacity>
								))}
							</View>

							{/* Favorite Button */}
							<TouchableOpacity
								style={styles.favoriteButton}
								onPress={() => toggleFavorite(store.id)}
							>
								<Text style={styles.favoriteIcon}>
									{isFavorite ? "❤️" : "🤍"}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.breakdown}>
							<Text style={styles.breakdownTitle}>Score Breakdown:</Text>
							<Text style={styles.breakdownText}>
								Distance: {store.breakdown.distance} | Weather:{" "}
								{store.breakdown.weather} | Time: {store.breakdown.timeOfDay} |
								Match: {store.breakdown.userPreference}
							</Text>
						</View>
					</View>
				);
			})}
		</View>
	);
}
