import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import ContextAggregator from "../../src/services/ContextAggregator";

// Add type definitions
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

export default function App() {
	const [context, setContext] = useState<ContextData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const testContextAggregator = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await ContextAggregator.aggregateContext();
			setContext(data);
			console.log("Context data:", data);
		} catch (err) {
			setError((err as Error).message);
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>ZotBoba Context Test</Text>

			<Button
				title={loading ? "Loading..." : "Get Context"}
				onPress={testContextAggregator}
				disabled={loading}
			/>

			{error && <Text style={styles.error}>Error: {error}</Text>}

			{context && (
				<View style={styles.results}>
					<Text style={styles.sectionTitle}>Location:</Text>
					<Text>Lat: {context.location.latitude.toFixed(4)}</Text>
					<Text>Lng: {context.location.longitude.toFixed(4)}</Text>
					<Text>
						Distance: {context.location.distanceFromIrvine.toFixed(2)} mi
					</Text>

					<Text style={styles.sectionTitle}>Weather:</Text>
					<Text>Temp: {context.weather.temperature}°F</Text>
					<Text>Condition: {context.weather.condition}</Text>

					<Text style={styles.sectionTitle}>Time:</Text>
					<Text>
						{context.timeOfDay.period} ({context.timeOfDay.hour}:00)
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },
	title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
	error: { color: "red", marginTop: 10 },
	results: { marginTop: 20 },
	sectionTitle: { fontWeight: "bold", marginTop: 15, marginBottom: 5 },
});
