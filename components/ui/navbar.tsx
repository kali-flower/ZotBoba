import { getCurrentUser } from "@/src/storage/currentUserControls";
import { colors } from "@/src/theme/tokens";
import { typography } from "@/src/theme/typography";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NavBar() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const checkUser = async () => {
			const user = await getCurrentUser();
			setIsLoggedIn(!!user);
		};
		checkUser();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.home}>
				<Pressable onPress={() => router.push("/(tabs)")}>
					<Text style={styles.title}>ZotBoba</Text>
				</Pressable>
			</View>

			<View style={styles.rightButtons}>
				<Pressable onPress={() => router.push("/(tabs)")}>
					<Text style={styles.subtitle}>Home</Text>
				</Pressable>

				<Pressable
					onPress={() =>
						router.push(isLoggedIn ? "/(tabs)/search" : "/(tabs)/login")
					}
				>
					<Text style={styles.subtitle}>Search</Text>
				</Pressable>

				<Pressable
					onPress={() =>
						router.push(isLoggedIn ? "/(tabs)/account" : "/(tabs)/login")
					}
				>
					<Text style={styles.subtitle}>
						{isLoggedIn ? "Account" : "Login"}
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 80,
		backgroundColor: colors.navbar,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingRight: 30,
		paddingLeft: 30,
		zIndex: 1,
		borderBottomColor: "black",
		borderBottomWidth: 1,
	},
	home: {
		justifyContent: "flex-start",
	},
	rightButtons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	title: {
		...typography.title,
	},
	body: {
		...typography.body,
	},
	subtitle: {
		...typography.subtitle,
	},
});
