// app/(tabs)/account.tsx
// Account page - View and manage favorites, ratings, and preferences
// Week 8 - Final

import NavBar from "@/components/ui/navbar";
import { height, styles } from "@/constants/styles";
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
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
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
		const updated = {
			...personalModel,
			ratings: (personalModel.ratings || []).filter(
				(r) => r.storeId !== storeId,
			),
		};
		setPersonalModel(updated);
		await savePersonalModel(username, updated);
	};

	if (loading || !personalModel) {
		return (
			<>
				<NavBar /> {/* ADD NAVBAR HERE */}
				<View style={accountStyles.container}>
					<Text style={accountStyles.loadingText}>Loading...</Text>
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
			<ScrollView style={accountStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
				<View style={accountStyles.backgroudContainer}>
					<View style={styles.circleTopLeft} />
					<View style={styles.circleBottomLeft} />
					<View style={styles.circleCenterCenter} />
					<View style={styles.circleBottomCenter} />
					<View style={styles.circleBottomRight} />
					<View style={styles.circleTopRight} />
					<View style={styles.circleCenterRight} />
					<View style={accountStyles.content}>
						<Text style={accountStyles.title}>👤 Account</Text>
						<Text style={accountStyles.subtitle}>Logged in as {username}</Text>

						<View style={accountStyles.contentBackground}>

							{/* Stats */}
							<View style={accountStyles.statsContainer}>
								<View style={accountStyles.statCard}>
									<Text style={accountStyles.statNumber}>{favorites.length}</Text>
									<Text style={accountStyles.statLabel}>Favorites</Text>
								</View>
								<View style={accountStyles.statCard}>
									<Text style={accountStyles.statNumber}>{ratings.length}</Text>
									<Text style={accountStyles.statLabel}>Rated</Text>
								</View>
								<View style={accountStyles.statCard}>
									<Text style={accountStyles.statNumber}>{avgRating}</Text>
									<Text style={accountStyles.statLabel}>Avg Rating</Text>
								</View>
							</View>

							{/* Preferences Summary */}
							<View style={accountStyles.section}>
								<Text style={accountStyles.sectionTitle}>⚙️ Preferences</Text>
								<View style={accountStyles.card}>
									<Text style={accountStyles.prefText}>
										🍬 Sweetness: {personalModel.sweetness}
									</Text>
									<Text style={accountStyles.prefText}>🧊 Ice: {personalModel.ice}</Text>
									<Text style={accountStyles.prefText}>
										🚫 Allergies: {personalModel.allergies.join(", ") || "None"}
									</Text>
								</View>
								<TouchableOpacity
									style={accountStyles.editButton}
									onPress={() => router.push("/(tabs)/settings")}
								>
									<Text style={accountStyles.editButtonText}>Edit Preferences</Text>
								</TouchableOpacity>
							</View>

							{/* Favorites */}
							<View style={accountStyles.section}>
								<Text style={accountStyles.sectionTitle}>❤️ My Favorites</Text>
								{favorites.length === 0 ?
									<View style={accountStyles.emptyCard}>
										<Text style={accountStyles.emptyText}>No favorites yet</Text>
										<Text style={accountStyles.emptySubtext}>
											Tap the ❤️ icon on stores to save them here
										</Text>
									</View>
									: favorites.map((storeId, index) => {
										const rating = ratings.find((r) => r.storeId === storeId);
										const storeName = rating?.storeName || `Store ${index + 1}`;

										return (
											<View key={storeId} style={accountStyles.itemCard}>
												<View style={accountStyles.itemHeader}>
													<View style={accountStyles.itemInfo}>
														<Text style={accountStyles.itemName}>{storeName}</Text>
														{rating && (
															<Text style={accountStyles.ratingText}>
																{"⭐".repeat(rating.rating)} ({rating.rating}/5)
															</Text>
														)}
													</View>
													<TouchableOpacity
														style={accountStyles.removeButton}
														onPress={() => removeFavorite(storeId)}
													>
														<Text style={accountStyles.removeText}>Remove</Text>
													</TouchableOpacity>
												</View>
											</View>
										);
									})
								}
							</View>

							{/* Ratings */}
							<View style={{ marginBottom: 20 }}>
								<Text style={accountStyles.sectionTitle}>⭐ My Ratings</Text>
								{ratings.length === 0 ?
									<View style={accountStyles.emptyCard}>
										<Text style={accountStyles.emptyText}>No ratings yet</Text>
										<Text style={accountStyles.emptySubtext}>
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
											<View key={rating.storeId} style={accountStyles.itemCard}>
												<View style={accountStyles.itemHeader}>
													<View style={accountStyles.itemInfo}>
														<Text style={accountStyles.itemName}>{rating.storeName}</Text>
														<Text style={accountStyles.itemDate}>
															{new Date(rating.ratedAt).toLocaleDateString()}
														</Text>
													</View>
													<TouchableOpacity
														style={accountStyles.removeButton}
														onPress={() => removeRating(rating.storeId)}
													>
														<Text style={accountStyles.removeText}>Remove</Text>
													</TouchableOpacity>
												</View>

												{/* Editable stars */}
												<View style={accountStyles.starsRow}>
													{[1, 2, 3, 4, 5].map((star) => (
														<TouchableOpacity
															key={star}
															onPress={() =>
																updateRating(rating.storeId, rating.storeName, star)
															}
														>
															<Text style={accountStyles.starLarge}>
																{star <= rating.rating ? "⭐" : "☆"}
															</Text>
														</TouchableOpacity>
													))}
													<Text style={accountStyles.ratingNumber}>
														({rating.rating}/5)
													</Text>
												</View>
											</View>
										))
								}
							</View>

							{/* Logout Button */}
							<TouchableOpacity style={accountStyles.logoutButton} onPress={logoutUser}>
								<Text style={accountStyles.logoutButtonText}>Logout</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</>
	);
}

const accountStyles = StyleSheet.create({
	backgroudContainer: {
		flex: 1,
		backgroundColor: colors.background,
		flexGrow: 1,
		minHeight: height,
	},
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		padding: 20,
		paddingTop: 60,
		paddingBottom: 40,
	},
	contentBackground: {
		backgroundColor: colors.search_bg,
		borderColor: colors.card_border,
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 17,
		paddingTop: 30,
		paddingBottom: 30,
		paddingLeft: 20,
		paddingRight: 20
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
		backgroundColor: colors.account_bg,
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
		backgroundColor: colors.account_bg,
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
		backgroundColor: colors.circles,
		borderColor: colors.card_border,
		borderWidth: 1,
		padding: 12,
		paddingVertical: 16,
		borderRadius: 8,
		marginTop: 10,
	},
	editButtonText: {
		textAlign: "center",
		fontWeight: "600",
		color: "#fff",
	},
	emptyCard: {
		backgroundColor: colors.account_bg,
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
		backgroundColor: colors.account_bg,
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
		backgroundColor: colors.circles,
		borderColor: colors.card_border,
		borderWidth: 1,
		padding: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginTop: 10,
		alignSelf: "center",
	},
	logoutButtonText: {
		textAlign: "center",
		fontWeight: "600",
		color: "#fff",
	},
});
