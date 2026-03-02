// testStoreData.js
// Quick test for StoreDataService

import StoreDataService from "./src/services/StoreDataService.js";

async function testStoreData() {
	console.log("🧪 Testing Store Data Service...\n");

	// Test 1: Get all stores
	console.log("📦 Test 1: Get all stores");
	const allStores = await StoreDataService.getAllStores();
	console.log(`Found ${allStores.length} stores total`);
	console.log("First store:", allStores[0].name);
	console.log("");

	// Test 2: Get stores near UCI
	console.log("📍 Test 2: Get stores near UCI");
	const uciLocation = { latitude: 33.6846, longitude: -117.8265 };
	const nearbyStores = await StoreDataService.getStoresNearLocation(
		uciLocation,
		5,
	);
	console.log(`Found ${nearbyStores.length} stores within 5 miles of UCI:`);
	nearbyStores.forEach((store) => {
		const distance = StoreDataService.calculateDistance(
			uciLocation.latitude,
			uciLocation.longitude,
			store.latitude,
			store.longitude,
		);
		console.log(`  - ${store.name} (${distance.toFixed(2)} mi)`);
	});
	console.log("");

	// Test 3: Search for specific store
	console.log('🔍 Test 3: Search for "ShareTea"');
	const searchResults = await StoreDataService.searchStores("ShareTea");
	console.log(`Found ${searchResults.length} results:`);
	searchResults.forEach((store) => console.log(`  - ${store.name}`));
	console.log("");

	// Test 4: Get store by ID
	console.log("🎯 Test 4: Get store by ID");
	const store = await StoreDataService.getStoreById("store_1");
	console.log("Store details:");
	console.log(`  Name: ${store.name}`);
	console.log(`  Category: ${store.category}`);
	console.log(`  Menu: ${store.menu.join(", ")}`);
	console.log(`  Hours: ${store.hours.open}:00 - ${store.hours.close}:00`);
	console.log(`  Allergens: ${store.allergens.join(", ") || "None"}`);
	console.log("");

	console.log("✅ All tests passed!");
}

// Run tests
testStoreData().catch((err) => {
	console.error("❌ Test failed:", err);
});
