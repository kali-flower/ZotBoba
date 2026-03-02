// StoreDataService.js
// Provides boba shop and cafe data
// Week 7/8 - Shreya (Priority 1)

// Mock data - real boba shops near UCI/Irvine
const MOCK_STORES = [
	{
		id: "store_1",
		name: "ShareTea",
		latitude: 33.6434,
		longitude: -117.8417,
		category: "boba",
		menu: ["milk_tea", "fruit_tea"],
		specialties: ["iced"],
		hours: { open: 11, close: 22 },
		allergens: ["dairy"],
		rating: 4.3,
	},
	{
		id: "store_2",
		name: "Class 302",
		latitude: 33.6846,
		longitude: -117.8265,
		category: "boba",
		menu: ["milk_tea", "fruit_tea", "coffee"],
		specialties: ["iced", "hot"],
		hours: { open: 12, close: 23 },
		allergens: ["dairy", "soy"],
		rating: 4.5,
	},
	{
		id: "store_3",
		name: "Urth Caffé",
		latitude: 33.6591,
		longitude: -117.8409,
		category: "coffee",
		menu: ["coffee", "hot_tea"],
		specialties: ["hot", "iced"],
		hours: { open: 7, close: 20 },
		allergens: ["dairy", "nuts", "gluten"],
		rating: 4.2,
	},
	{
		id: "store_4",
		name: "Gong Cha",
		latitude: 33.6489,
		longitude: -117.8352,
		category: "boba",
		menu: ["milk_tea", "fruit_tea", "smoothie"],
		specialties: ["iced"],
		hours: { open: 10, close: 22 },
		allergens: ["dairy"],
		rating: 4.4,
	},
	{
		id: "store_5",
		name: "Ten Ren Tea",
		latitude: 33.6678,
		longitude: -117.8231,
		category: "boba",
		menu: ["milk_tea", "fruit_tea"],
		specialties: ["iced", "hot"],
		hours: { open: 11, close: 21 },
		allergens: ["dairy"],
		rating: 4.1,
	},
	{
		id: "store_6",
		name: "Coffee Bean & Tea Leaf",
		latitude: 33.6512,
		longitude: -117.8401,
		category: "coffee",
		menu: ["coffee", "hot_tea"],
		specialties: ["hot", "iced"],
		hours: { open: 6, close: 21 },
		allergens: ["dairy", "soy"],
		rating: 4.0,
	},
	{
		id: "store_7",
		name: "Quickly",
		latitude: 33.6823,
		longitude: -117.8298,
		category: "boba",
		menu: ["milk_tea", "fruit_tea", "smoothie"],
		specialties: ["iced"],
		hours: { open: 11, close: 23 },
		allergens: ["dairy"],
		rating: 3.9,
	},
	{
		id: "store_8",
		name: "Volcano Tea House",
		latitude: 33.6402,
		longitude: -117.8456,
		category: "boba",
		menu: ["milk_tea", "fruit_tea"],
		specialties: ["iced"],
		hours: { open: 12, close: 22 },
		allergens: ["dairy", "nuts"],
		rating: 4.6,
	},
	{
		id: "store_9",
		name: "Starbucks Reserve",
		latitude: 33.6567,
		longitude: -117.8378,
		category: "coffee",
		menu: ["coffee", "specialty"],
		specialties: ["hot", "iced"],
		hours: { open: 5, close: 22 },
		allergens: ["dairy", "soy", "nuts"],
		rating: 4.3,
	},
	{
		id: "store_10",
		name: "Happy Lemon",
		latitude: 33.6701,
		longitude: -117.8189,
		category: "boba",
		menu: ["milk_tea", "fruit_tea"],
		specialties: ["iced"],
		hours: { open: 11, close: 22 },
		allergens: [],
		rating: 4.7,
	},
];

class StoreDataService {
	/**
	 * Get stores near a given location
	 * @param {object} location - { latitude, longitude }
	 * @param {number} radiusMiles - Search radius in miles (default: 20)
	 * @returns {Promise<Array>} - Array of store objects
	 */
	async getStoresNearLocation(location, radiusMiles = 20) {
		// Simulate API delay
		await this.delay(300);

		// Filter stores within radius
		const nearbyStores = MOCK_STORES.filter((store) => {
			const distance = this.calculateDistance(
				location.latitude,
				location.longitude,
				store.latitude,
				store.longitude,
			);
			return distance <= radiusMiles;
		});

		console.log(
			`📍 Found ${nearbyStores.length} stores within ${radiusMiles} miles`,
		);
		return nearbyStores;
	}

	/**
	 * Get a specific store by ID
	 */
	async getStoreById(storeId) {
		await this.delay(100);
		const store = MOCK_STORES.find((s) => s.id === storeId);
		if (!store) {
			throw new Error(`Store ${storeId} not found`);
		}
		return store;
	}

	/**
	 * Get all stores (for testing)
	 */
	async getAllStores() {
		await this.delay(200);
		return MOCK_STORES;
	}

	/**
	 * Search stores by name or category
	 */
	async searchStores(query) {
		await this.delay(250);
		const lowerQuery = query.toLowerCase();

		return MOCK_STORES.filter(
			(store) =>
				store.name.toLowerCase().includes(lowerQuery) ||
				store.category.toLowerCase().includes(lowerQuery),
		);
	}

	/**
	 * Calculate distance between two GPS coordinates (Haversine formula)
	 */
	calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 3959; // Earth's radius in miles
		const dLat = this.toRadians(lat2 - lat1);
		const dLon = this.toRadians(lon2 - lon1);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.toRadians(lat1)) *
				Math.cos(this.toRadians(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	/**
	 * Simulate API delay
	 */
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export default new StoreDataService();
