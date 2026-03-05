import RankingEngine from "./src/services/RankingEngine.js";

// mock data
const mockStores = [
	{
		id: "store1",
		name: "Sunright Tea Studio",
		latitude: 33.69,
		longitude: -117.83,
		category: "boba",
		menu: ["milk_tea", "fruit_tea"],
		specialties: ["iced"],
		hours: { open: 10, close: 22 },
		allergens: [],
	},
	{
		id: "store2",
		name: "Sharetea",
		latitude: 33.65,
		longitude: -117.85,
		category: "coffee",
		menu: ["coffee", "hot_tea"],
		specialties: ["hot"],
		hours: { open: 7, close: 20 },
		allergens: ["dairy"],
	},
	{
		id: "store3",
		name: "Pink Pig",
		latitude: 33.5,
		longitude: -117.7,
		category: "boba",
		menu: ["milk_tea"],
		hours: { open: 11, close: 23 },
		allergens: [],
	},
];

const mockContext = {
	location: {
		latitude: 33.6846,
		longitude: -117.8265,
	},
	weather: {
		temperature: 80,
	},
	timeOfDay: {
		hour: 14,
		period: "afternoon",
	},
};

const mockUserPreferences = {
	allergens: ["dairy"],
	favoriteDrinkTypes: ["fruit_tea", "milk_tea"],
	favoriteShops: ["store1"],
};

const rankedStores = RankingEngine.rankStores(
	mockStores,
	mockContext,
	mockUserPreferences,
);

rankedStores.forEach((store, index) => {
	console.log(`\n${index + 1}. ${store.name}`);
	console.log(`   Score: ${store.score}/100`);
	console.log(`   Breakdown:`, store.breakdown);
	console.log(
		`   Reason: ${RankingEngine.getReasonForRanking(store, mockContext, mockUserPreferences)}`,
	);
});
