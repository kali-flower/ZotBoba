// StoreDataService.js
// Provides boba shop and cafe data from Google Places API

const GOOGLE_PLACES_API_KEY =
	process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "YOUR_API_KEY_HERE";

// Keep mock data as fallback
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
	constructor() {
		this.useRealAPI = GOOGLE_PLACES_API_KEY !== "YOUR_API_KEY_HERE";
	}

	/**
	 * Get stores near a given location
	 * Uses Google Places API if available, falls back to mock data
	 */
	async getStoresNearLocation(location, radiusMiles = 20) {
		if (this.useRealAPI) {
			try {
				return await this.getStoresFromGooglePlaces(location, radiusMiles);
			} catch (error) {
				console.warn(
					"⚠️ Google Places API failed, using mock data:",
					error.message,
				);
				return this.getStoresFromMockData(location, radiusMiles);
			}
		} else {
			console.log("📦 Using mock data (no Google API key configured)");
			return this.getStoresFromMockData(location, radiusMiles);
		}
	}

	/**
	 * Fetch stores from Google Places API
	 */
	async getStoresFromGooglePlaces(location, radiusMiles) {
		console.log("🌐 Fetching from Google Places API...");

		const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
		const baseUrl = '/api/places';

		// Search for boba/bubble tea shops
		const bobaUrl = `${baseUrl}?location=${location.latitude},${location.longitude}&radius=${radiusMeters}&keyword=boba+bubble+tea`;

		// Search for cafes
		const cafeUrl = `${baseUrl}?location=${location.latitude},${location.longitude}&radius=${radiusMeters}&type=cafe`;

		const [bobaResponse, cafeResponse] = await Promise.all([
			fetch(bobaUrl),
			fetch(cafeUrl),
		]);

		if (!bobaResponse.ok || !cafeResponse.ok) {
			throw new Error("Google Places API request failed");
		}

		const bobaData = await bobaResponse.json();
		console.log("API response:", bobaData);
		const cafeData = await cafeResponse.json();

		// Combine and deduplicate results
		const allPlaces = [
			...(bobaData.results || []),
			...(cafeData.results || []),
		];

		// Convert to our format
		const stores = allPlaces.map((place) =>
			this.convertGooglePlaceToStore(place),
		).filter(Boolean);

		let uniqueStores = [];
		// Remove duplicates by place_id
		if (stores) {
			uniqueStores = Array.from(
				new Map(stores.map((store) => [store.id, store])).values(),
			);
		}

		if (uniqueStores.length == 0) {
			console.log('No stores open');
		}

		console.log(`✅ Found ${uniqueStores.length} stores from Google Places open`);
		return uniqueStores.length > 20 ? uniqueStores.slice(0, 20) : uniqueStores; // Limit to 20 stores
	}

	/**
	 * Convert Google Place result to our store format
	 */
	convertGooglePlaceToStore(place) {
		// Determine category based on types
		const isCoffee =
			place.types?.includes("cafe") ||
			place.name.toLowerCase().includes("coffee") ||
			place.name.toLowerCase().includes("starbucks");

		const category = isCoffee ? "coffee" : "boba";

		// Parse hours if available
		let hours = { open: 9, close: 21 }; // Default
		if (place.opening_hours?.periods?.[0]) {
			try {
				const period = place.opening_hours.periods[0];
				hours = {
					open: parseInt(period.open.time.substring(0, 2)),
					close: parseInt(period.close.time.substring(0, 2)),
				};
			} catch (e) {
				// Use default hours if parsing fails
			}
		}
		// Filter out closed stores
		const currentTime = new Date();
		const currentHour = currentTime.getHours();
		const isCurrentlyOpen = currentHour >= hours.open && currentHour < hours.close;
		if (!isCurrentlyOpen) return null;

		// Guess menu based on category
		const menu =
			category === "coffee" ? ["coffee", "hot_tea"] : ["milk_tea", "fruit_tea"];

		// Assume common allergens (this would ideally come from detailed menu data)
		const allergens =
			category === "coffee" ? ["dairy", "soy", "nuts"] : ["dairy"];

		return {
			id: place.id,
			name: place.displayName?.text,
			latitude: place.location?.latitude,
			longitude: place.location?.longitude,
			category,
			menu,
			specialties: ["iced", "hot"],
			hours,
			allergens,
			rating: place.rating || 4.0,
			// Additional Google Places data
			address: place.formattedAddress,
			priceLevel: place.price_level,
			isOpen: place.currentOpeningHours?.openNow,
		};
	}

	/**
	 * Get stores from mock data (fallback)
	 */
	async getStoresFromMockData(location, radiusMiles) {
		await this.delay(300);

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
			`📍 Found ${nearbyStores.length} mock stores within ${radiusMiles} miles`,
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
