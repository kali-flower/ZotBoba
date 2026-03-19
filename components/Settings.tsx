// app/(tabs)/settings.tsx
// Settings screen - Edit user preferences
// Week 8 - Shreya

import { styles } from "@/constants/styles";
import { getCurrentUser } from "@/src/storage/currentUserControls";
import { loadPersonalModel, savePersonalModel } from "@/src/storage/personalModelUse";
import { colors } from "@/src/theme/tokens";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import {
	IceLevel,
	PersonalModel,
	SweetnessLevel,
} from "../src/models/personalModel";

const COMMON_ALLERGENS = ["dairy", "nuts", "soy", "gluten", "eggs"];

export default function SettingsScreen() {
	const [model, setModel] = useState<PersonalModel | null>(null);
	const [newAllergen, setNewAllergen] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		loadPreferences();
	}, []);

	const loadPreferences = async () => {
		setLoading(true);
		const user = await getCurrentUser();
		const loaded = await loadPersonalModel(user!);
		setModel(loaded);
		setLoading(false);
	};

	const returnToSettings = async () => {
		router.replace("/(tabs)/account");
	}

	const handleSave = async () => {
		if (!model) return;

		setSaving(true);
		try {
			const user = await getCurrentUser();
			await savePersonalModel(user!, model);
			Alert.alert("Saved!", "Your preferences have been updated.");
		} catch (error) {
			Alert.alert("Error", "Failed to save preferences.");
		} finally {
			setSaving(false);
		}
	};

	const toggleAllergen = (allergen: string) => {
		if (!model) return;

		const allergens =
			model.allergies.includes(allergen) ?
				model.allergies.filter((a) => a !== allergen)
				: [...model.allergies, allergen];

		setModel({ ...model, allergies: allergens });
	};

	const addCustomAllergen = () => {
		if (!model || !newAllergen.trim()) return;

		const allergen = newAllergen.trim().toLowerCase();
		if (model.allergies.includes(allergen)) {
			Alert.alert("Already added", "This allergen is already in your list.");
			return;
		}

		setModel({ ...model, allergies: [...model.allergies, allergen] });
		setNewAllergen("");
	};

	const removeAllergen = (allergen: string) => {
		if (!model) return;
		setModel({
			...model,
			allergies: model.allergies.filter((a) => a !== allergen),
		});
	};

	const setSweetness = (level: SweetnessLevel) => {
		if (!model) return;
		setModel({ ...model, sweetness: level });
	};

	const setIce = (level: IceLevel) => {
		if (!model) return;
		setModel({ ...model, ice: level });
	};

	if (loading || !model) {
		return (
			<View style={styles2.container}>
				<Text style={styles2.loadingText}>Loading preferences...</Text>
			</View>
		);
	}

	return (
		<>
			<View style={styles.container}>
				<View style={styles.circleTopLeft} />
				<View style={styles.circleBottomLeft} />
				<View style={styles.circleCenterCenter} />
				<View style={styles.circleBottomCenter} />
				<View style={styles.circleBottomRight} />
				<View style={styles.circleTopRight} />
				<View style={styles.circleCenterRight} />
				<View style={styles2.content}>
					<Text style={styles2.title}>Preferences</Text>
					<Text style={styles2.subtitle}>Customize your boba preferences</Text>

					<View style={styles2.contentBackground}>
						{/* Sweetness Level */}
						<View style={styles2.section}>
							<Text style={styles2.sectionTitle}>🍬 Sweetness Level</Text>
							<View style={styles2.optionGroup}>
								{(["low", "medium", "high"] as SweetnessLevel[]).map((level) => (
									<TouchableOpacity
										key={level}
										style={[
											styles2.optionButton,
											model.sweetness === level && styles2.optionButtonActive,
										]}
										onPress={() => setSweetness(level)}
									>
										<Text
											style={[
												styles2.optionText,
												model.sweetness === level && styles2.optionTextActive,
											]}
										>
											{level.charAt(0).toUpperCase() + level.slice(1)}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Ice Level */}
						<View style={styles2.section}>
							<Text style={styles2.sectionTitle}>🧊 Ice Level</Text>
							<View style={styles2.optionGroup}>
								{(["none", "less", "regular", "extra"] as IceLevel[]).map(
									(level) => (
										<TouchableOpacity
											key={level}
											style={[
												styles2.optionButton,
												model.ice === level && styles2.optionButtonActive,
											]}
											onPress={() => setIce(level)}
										>
											<Text
												style={[
													styles2.optionText,
													model.ice === level && styles2.optionTextActive,
												]}
											>
												{level.charAt(0).toUpperCase() + level.slice(1)}
											</Text>
										</TouchableOpacity>
									),
								)}
							</View>
						</View>

						{/* Allergens */}
						<View style={styles2.section}>
							<Text style={styles2.sectionTitle}>
								🚫 Allergens & Dietary Restrictions
							</Text>
							<Text style={styles2.sectionDescription}>
								Stores with these allergens will be filtered out
							</Text>

							{/* Common allergens */}
							<View style={styles2.allergenGrid}>
								{COMMON_ALLERGENS.map((allergen) => (
									<TouchableOpacity
										key={allergen}
										style={[
											styles2.allergenChip,
											model.allergies.includes(allergen) &&
											styles2.allergenChipActive,
										]}
										onPress={() => toggleAllergen(allergen)}
									>
										<Text
											style={[
												styles2.allergenText,
												model.allergies.includes(allergen) &&
												styles2.allergenTextActive,
											]}
										>
											{allergen}
										</Text>
									</TouchableOpacity>
								))}
							</View>

							{/* Custom allergens */}
							{model.allergies.filter((a) => !COMMON_ALLERGENS.includes(a)).length >
								0 && (
									<View style={styles2.customAllergensContainer}>
										<Text style={styles2.customAllergensTitle}>Custom:</Text>
										<View style={styles2.allergenGrid}>
											{model.allergies
												.filter((a) => !COMMON_ALLERGENS.includes(a))
												.map((allergen) => (
													<TouchableOpacity
														key={allergen}
														style={[styles2.allergenChip, styles2.allergenChipActive]}
														onPress={() => removeAllergen(allergen)}
													>
														<Text
															style={[styles2.allergenText, styles2.allergenTextActive]}
														>
															{allergen} ✕
														</Text>
													</TouchableOpacity>
												))}
										</View>
									</View>
								)}

							{/* Add custom allergen */}
							<View style={styles2.addAllergenContainer}>
								<TextInput
									style={styles2.allergenInput}
									placeholder="Add custom allergen..."
									value={newAllergen}
									onChangeText={setNewAllergen}
									onSubmitEditing={addCustomAllergen}
								/>
								<TouchableOpacity
									style={styles2.addButton}
									onPress={addCustomAllergen}
								>
									<Text style={styles2.addButtonText}>Add</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Summary */}
						<View style={styles2.summarySection}>
							<Text style={styles2.summaryTitle}>📋 Your Preferences</Text>
							<View style={styles2.summaryCard}>
								<Text style={styles2.summaryText}>Sweetness: {model.sweetness}</Text>
								<Text style={styles2.summaryText}>Ice: {model.ice}</Text>
								<Text style={styles2.summaryText}>
									Allergens:{" "}
									{model.allergies.length === 0 ?
										"None"
										: model.allergies.join(", ")}
								</Text>
							</View>
						</View>

						{/* Save Button */}
						<TouchableOpacity
							style={[styles2.saveButton, saving && styles2.saveButtonDisabled]}
							onPress={handleSave}
							disabled={saving}
						>
							<Text style={styles2.saveButtonText}>
								{saving ? "Saving..." : "Save Preferences"}
							</Text>
						</TouchableOpacity>

						{/* Logout Button */}
						<TouchableOpacity
							style={styles2.logoutButton}
							onPress={returnToSettings}
						>
							<Text style={styles2.logoutButtonText}>
								{<u>Back to settings</u>}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</>
	);
}


const styles2 = StyleSheet.create({
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
	logoutButton: {
		paddingTop: 16,
		alignItems: "center",
		alignSelf: "center"
	},
	logoutButtonText: {
		fontSize: 13,
		color: "#666",
		marginBottom: 12,
	},
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	}, // replaced
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
	section: {
		marginBottom: 30,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
		color: "#333",
	},
	sectionDescription: {
		fontSize: 13,
		color: "#666",
		marginBottom: 12,
	},
	optionGroup: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	optionButton: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: colors.account_bg,
		borderWidth: 2,
		borderColor: "#ddd",
	},
	optionButtonActive: {
		backgroundColor: colors.navbar,
		borderColor: colors.card_border,
	},
	optionText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#333",
	},
	optionTextActive: {
		color: "#333",
	},
	allergenGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	allergenChip: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: colors.account_bg,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	allergenChipActive: {
		backgroundColor: colors.background,
		borderColor: colors.card_border,
		borderWidth: 2,
		borderStyle: "solid"
	},
	allergenText: {
		fontSize: 14,
		color: "#333",
	},
	allergenTextActive: {
		color: "#333",
		fontWeight: "500",
	},
	customAllergensContainer: {
		marginTop: 15,
	},
	customAllergensTitle: {
		fontSize: 13,
		color: "#666",
		marginBottom: 8,
	},
	addAllergenContainer: {
		flexDirection: "row",
		marginTop: 15,
		gap: 10,
	},
	allergenInput: {
		flex: 1,
		backgroundColor: colors.account_bg,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		fontSize: 15,
	},
	addButton: {
		backgroundColor: colors.circles,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		justifyContent: "center",
		borderColor: colors.card_border,
		borderWidth: 1,
	},
	addButtonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 15,
	},
	summarySection: {
		marginTop: 10,
		marginBottom: 20,
	},
	summaryTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 10,
		color: "#333",
	},
	summaryCard: {
		backgroundColor: colors.account_bg,
		padding: 15,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	summaryText: {
		fontSize: 14,
		marginBottom: 6,
		color: "#555",
	},
	saveButton: {
		backgroundColor: colors.circles,
		paddingVertical: 16,
		borderRadius: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	saveButtonDisabled: {
		backgroundColor: "#999",
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
});
