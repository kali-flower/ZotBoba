// app/(tabs)/explore.tsx
// Settings screen - Edit user preferences
// Week 8 - Shreya

import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  IceLevel,
  PersonalModel,
  SweetnessLevel,
} from "../../src/models/personalModel";
import {
  loadPersonalModel,
  savePersonalModel,
} from "../../src/storage/personalModelStorage";

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
		const loaded = await loadPersonalModel();
		setModel(loaded);
		setLoading(false);
	};

	const handleSave = async () => {
		if (!model) return;

		setSaving(true);
		try {
			await savePersonalModel(model);
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
			:	[...model.allergies, allergen];

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
			<View style={styles.container}>
				<Text style={styles.loadingText}>Loading preferences...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>⚙️ Settings</Text>
				<Text style={styles.subtitle}>Customize your boba preferences</Text>

				{/* Sweetness Level */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>🍬 Sweetness Level</Text>
					<View style={styles.optionGroup}>
						{(["low", "medium", "high"] as SweetnessLevel[]).map((level) => (
							<TouchableOpacity
								key={level}
								style={[
									styles.optionButton,
									model.sweetness === level && styles.optionButtonActive,
								]}
								onPress={() => setSweetness(level)}
							>
								<Text
									style={[
										styles.optionText,
										model.sweetness === level && styles.optionTextActive,
									]}
								>
									{level.charAt(0).toUpperCase() + level.slice(1)}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Ice Level */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>🧊 Ice Level</Text>
					<View style={styles.optionGroup}>
						{(["none", "less", "regular", "extra"] as IceLevel[]).map(
							(level) => (
								<TouchableOpacity
									key={level}
									style={[
										styles.optionButton,
										model.ice === level && styles.optionButtonActive,
									]}
									onPress={() => setIce(level)}
								>
									<Text
										style={[
											styles.optionText,
											model.ice === level && styles.optionTextActive,
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
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						🚫 Allergens & Dietary Restrictions
					</Text>
					<Text style={styles.sectionDescription}>
						Stores with these allergens will be filtered out
					</Text>

					{/* Common allergens */}
					<View style={styles.allergenGrid}>
						{COMMON_ALLERGENS.map((allergen) => (
							<TouchableOpacity
								key={allergen}
								style={[
									styles.allergenChip,
									model.allergies.includes(allergen) &&
										styles.allergenChipActive,
								]}
								onPress={() => toggleAllergen(allergen)}
							>
								<Text
									style={[
										styles.allergenText,
										model.allergies.includes(allergen) &&
											styles.allergenTextActive,
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
						<View style={styles.customAllergensContainer}>
							<Text style={styles.customAllergensTitle}>Custom:</Text>
							<View style={styles.allergenGrid}>
								{model.allergies
									.filter((a) => !COMMON_ALLERGENS.includes(a))
									.map((allergen) => (
										<TouchableOpacity
											key={allergen}
											style={[styles.allergenChip, styles.allergenChipActive]}
											onPress={() => removeAllergen(allergen)}
										>
											<Text
												style={[styles.allergenText, styles.allergenTextActive]}
											>
												{allergen} ✕
											</Text>
										</TouchableOpacity>
									))}
							</View>
						</View>
					)}

					{/* Add custom allergen */}
					<View style={styles.addAllergenContainer}>
						<TextInput
							style={styles.allergenInput}
							placeholder="Add custom allergen..."
							value={newAllergen}
							onChangeText={setNewAllergen}
							onSubmitEditing={addCustomAllergen}
						/>
						<TouchableOpacity
							style={styles.addButton}
							onPress={addCustomAllergen}
						>
							<Text style={styles.addButtonText}>Add</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Summary */}
				<View style={styles.summarySection}>
					<Text style={styles.summaryTitle}>📋 Your Preferences</Text>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryText}>Sweetness: {model.sweetness}</Text>
						<Text style={styles.summaryText}>Ice: {model.ice}</Text>
						<Text style={styles.summaryText}>
							Allergens:{" "}
							{model.allergies.length === 0 ?
								"None"
							:	model.allergies.join(", ")}
						</Text>
					</View>
				</View>

				{/* Save Button */}
				<TouchableOpacity
					style={[styles.saveButton, saving && styles.saveButtonDisabled]}
					onPress={handleSave}
					disabled={saving}
				>
					<Text style={styles.saveButtonText}>
						{saving ? "Saving..." : "💾 Save Preferences"}
					</Text>
				</TouchableOpacity>
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
		backgroundColor: "#fff",
		borderWidth: 2,
		borderColor: "#ddd",
	},
	optionButtonActive: {
		backgroundColor: "#0066cc",
		borderColor: "#0066cc",
	},
	optionText: {
		fontSize: 15,
		fontWeight: "500",
		color: "#333",
	},
	optionTextActive: {
		color: "#fff",
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
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
	},
	allergenChipActive: {
		backgroundColor: "#ff6b6b",
		borderColor: "#ff6b6b",
	},
	allergenText: {
		fontSize: 14,
		color: "#333",
	},
	allergenTextActive: {
		color: "#fff",
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
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		fontSize: 15,
	},
	addButton: {
		backgroundColor: "#0066cc",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		justifyContent: "center",
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
		backgroundColor: "#fff",
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
		backgroundColor: "#0066cc",
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
