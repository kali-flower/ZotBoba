// app/(tabs)/account.tsx
// Account page - View and manage favorites, ratings, and preferences
// Week 8 - Final

import NavBar from "@/components/ui/navbar";
import { PersonalModel } from "@/src/models/personalModel";
import { getCurrentUser, logout } from "@/src/storage/currentUserControls";
import {
	loadPersonalModel,
	savePersonalModel,
} from "@/src/storage/personalModelUse";
import { colors } from "@/src/theme/tokens";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function AccountPage() {
	const [username, setUsername] = useState<string | null>(null);
	const [personalModel, setPersonalModel] = useState<PersonalModel | null>(
		null,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		const user = await getCurrentUser();
		if (!user) {
			router.replace("/(tabs)/login");
			return;
		}
		setUsername(user);
		const model = await loadPersonalModel(user);
		setPersonalModel(model);
		setLoading(false);
	};

	const logoutUser = async () => {
		await logout();
		router.replace("/(tabs)");
	}

	const removeFavorite = async (storeId: string) => {
		if (!personalModel || !username) return;

		const updated = {
			...personalModel,
			favoriteShopIds: personalModel.favoriteShopIds.filter(
				(id) => id !== storeId,
			),
		};
		setPersonalModel(updated);
		await savePersonalModel(username, updated);
	};

	const updateRating = async (
		storeId: string,
		storeName: string,
		newRating: number,
	) => {
		if (!personalModel || !username) return;

		const existingRatings = (personalModel.ratings || []).filter(
			(r) => r.storeId !== storeId,
		);
		const updated = {
			...personalModel,
			ratings: [
				...existingRatings,
				{
					storeId,
					storeName,
					rating: newRating,
					ratedAt: new Date().toISOString(),
				},
			],
		};
		setPersonalModel(updated);
		await savePersonalModel(username, updated);
	};

	const removeRating = async (storeId: string) => {
		if (!personalModel || !username) return;

		Alert.alert(
			"Remove Rating",
			"Are you sure you want to remove this rating?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						const updated = {
							...personalModel,
							ratings: (personalModel.ratings || []).filter(
								(r) => r.storeId !== storeId,
							),
						};
						setPersonalModel(updated);
						await savePersonalModel(username, updated);
					},
				},
			],
		);
	};

	if (loading || !personalModel) {
		return (
			<>
				<NavBar /> {/* ADD NAVBAR HERE */}
				<View style={styles.container}>
					<Text style={styles.loadingText}>Loading...</Text>
				</View>
			</>
		);
	}

	const favorites = personalModel.favoriteShopIds || [];
	const ratings = personalModel.ratings || [];
	const avgRating =
		ratings.length > 0 ?
			(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(
				1,
			)
			: "—";

	return (
		<>
			<NavBar /> {/* ADD NAVBAR HERE */}
			<ScrollView style={styles.container}>
				<View style={styles.content}>
					<Text style={styles.title}>👤 Account</Text>
					<Text style={styles.subtitle}>Logged in as {username}</Text>

					{/* Stats */}
					<View style={styles.statsContainer}>
						<View style={styles.statCard}>
							<Text style={styles.statNumber}>{favorites.length}</Text>
							<Text style={styles.statLabel}>Favorites</Text>
						</View>
						<View style={styles.statCard}>
							<Text style={styles.statNumber}>{ratings.length}</Text>
							<Text style={styles.statLabel}>Rated</Text>
						</View>
						<View style={styles.statCard}>
							<Text style={styles.statNumber}>{avgRating}</Text>
							<Text style={styles.statLabel}>Avg Rating</Text>
						</View>
					</View>

					{/* Preferences Summary */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>⚙️ Preferences</Text>
						<View style={styles.card}>
							<Text style={styles.prefText}>
								🍬 Sweetness: {personalModel.sweetness}
							</Text>
							<Text style={styles.prefText}>🧊 Ice: {personalModel.ice}</Text>
							<Text style={styles.prefText}>
								🚫 Allergies: {personalModel.allergies.join(", ") || "None"}
							</Text>
						</View>
						<TouchableOpacity
							style={styles.editButton}
							onPress={() => router.push("/(tabs)/settings")}
						>
							<Text style={styles.editButtonText}>Edit Preferences</Text>
						</TouchableOpacity>
					</View>

					{/* Favorites */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>❤️ My Favorites</Text>
						{favorites.length === 0 ?
							<View style={styles.emptyCard}>
								<Text style={styles.emptyText}>No favorites yet</Text>
								<Text style={styles.emptySubtext}>
									Tap the ❤️ icon on stores to save them here
								</Text>
							</View>
							: favorites.map((storeId, index) => {
								const rating = ratings.find((r) => r.storeId === storeId);
								const storeName = rating?.storeName || `Store ${index + 1}`;

								return (
									<View key={storeId} style={styles.itemCard}>
										<View style={styles.itemHeader}>
											<View style={styles.itemInfo}>
												<Text style={styles.itemName}>{storeName}</Text>
												{rating && (
													<Text style={styles.ratingText}>
														{"⭐".repeat(rating.rating)} ({rating.rating}/5)
													</Text>
												)}
											</View>
											<TouchableOpacity
												style={styles.removeButton}
												onPress={() => removeFavorite(storeId)}
											>
												<Text style={styles.removeText}>Remove</Text>
											</TouchableOpacity>
										</View>
									</View>
								);
							})
						}
					</View>

					{/* Ratings */}
					<View style={{marginBottom: 30}}>
						<Text style={styles.sectionTitle}>⭐ My Ratings</Text>
						{ratings.length === 0 ?
							<View style={styles.emptyCard}>
								<Text style={styles.emptyText}>No ratings yet</Text>
								<Text style={styles.emptySubtext}>
									Rate stores to improve your recommendations
								</Text>
							</View>
							: ratings
								.sort(
									(a, b) =>
										new Date(b.ratedAt).getTime() -
										new Date(a.ratedAt).getTime(),
								)
								.map((rating) => (
									<View key={rating.storeId} style={styles.itemCard}>
										<View style={styles.itemHeader}>
											<View style={styles.itemInfo}>
												<Text style={styles.itemName}>{rating.storeName}</Text>
												<Text style={styles.itemDate}>
													{new Date(rating.ratedAt).toLocaleDateString()}
												</Text>
											</View>
											<TouchableOpacity
												style={styles.removeButton}
												onPress={() => removeRating(rating.storeId)}
											>
												<Text style={styles.removeText}>Remove</Text>
											</TouchableOpacity>
										</View>

										{/* Editable stars */}
										<View style={styles.starsRow}>
											{[1, 2, 3, 4, 5].map((star) => (
												<TouchableOpacity
													key={star}
													onPress={() =>
														updateRating(rating.storeId, rating.storeName, star)
													}
												>
													<Text style={styles.starLarge}>
														{star <= rating.rating ? "⭐" : "☆"}
													</Text>
												</TouchableOpacity>
											))}
											<Text style={styles.ratingNumber}>
												({rating.rating}/5)
											</Text>
										</View>
									</View>
								))
						}
					</View>

					{/* Logout Button */}
					<TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
						<Text style={styles.logoutButtonText}>{<u>Logout</u>}</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
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
		marginBottom: 30,
		textAlign: "center",
	},
	loadingText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginTop: 100,
	},
	statsContainer: {
		flexDirection: "row",
		gap: 10,
		marginBottom: 30,
	},
	statCard: {
		flex: 1,
		backgroundColor: colors.search_bg,
		borderColor: colors.card_border,
		borderWidth: 1,
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	statNumber: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 5,
	},
	statLabel: {
		fontSize: 12,
		color: "#666",
	},
	section: {
		marginBottom: 30,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
		color: "#333",
	},
	card: {
		backgroundColor: colors.search_bg,
		borderColor: colors.card_border,
		borderWidth: 1,
		padding: 15,
		borderRadius: 10,
	},
	prefText: {
		fontSize: 14,
		marginBottom: 8,
		color: "#333",
	},
	editButton: {
		backgroundColor: colors.navbar,
		borderColor: colors.card_border,
		borderWidth: 1,
		padding: 12,
		borderRadius: 8,
		marginTop: 10,
	},
	editButtonText: {
		textAlign: "center",
		fontWeight: "600",
		color: "#333",
	},
	emptyCard: {
		backgroundColor: colors.search_bg,
		borderColor: colors.card_border,
		borderWidth: 2,
		borderStyle: "dashed",
		padding: 30,
		borderRadius: 10,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: "#999",
		marginBottom: 5,
	},
	emptySubtext: {
		fontSize: 13,
		color: "#bbb",
		textAlign: "center",
	},
	itemCard: {
		backgroundColor: colors.search_bg,
		borderColor: colors.card_border,
		borderWidth: 1,
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
	},
	itemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 10,
	},
	itemInfo: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
		color: "#333",
	},
	itemDate: {
		fontSize: 12,
		color: "#666",
	},
	ratingText: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},
	removeButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	removeText: {
		color: "#c00",
		fontSize: 13,
		fontWeight: "500",
	},
	starsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	starLarge: {
		fontSize: 24,
	},
	ratingNumber: {
		fontSize: 14,
		color: "#666",
		marginLeft: 5,
	},
	logoutButton: {
		padding: 0,
		alignItems: "center",	
		alignSelf: "center",
	},
	logoutButtonText: {
		fontSize: 13,
		color: "#666",
		marginBottom: 12,
	},
});
