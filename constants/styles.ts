import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
