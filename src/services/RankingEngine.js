// RankingEngine.js
// Ranks boba shops based on context and preferences
// Week 7 - Shreya (UPDATED with proper ratings scoring)

class RankingEngine {
	constructor() {
		// Weights for different factors (can be tuned later)
		this.weights = {
			distance: 0.3, // 30% - how far away
			weather: 0.2, // 20% - weather match
			timeOfDay: 0.15, // 15% - is it open?
			userPreference: 0.35, // 35% - matches user taste
		};
	}

	// Main method: rank all stores
	rankStores(stores, context, userPreferences) {
		// Score each store
		const scoredStores = stores.map((store) => {
			const score = this.calculateScore(store, context, userPreferences);
			return {
				...store,
				score: score,
				breakdown: this.getScoreBreakdown(store, context, userPreferences),
				isFavorite: userPreferences.favoriteShops?.includes(store.id) || false, // Track if favorite
			};
		});

		// favorites first, then by score
		const ranked = scoredStores.sort((a, b) => {
			// Favorites always come first
			if (a.isFavorite && !b.isFavorite) return -1;
			if (!a.isFavorite && b.isFavorite) return 1;
			// if both favorites or both not, sort by score
			return b.score - a.score;
		});

		// Return top 5
		return ranked.length > 9 ? ranked.slice(0, 9) : ranked;
	}

	// Calculate total score for a store
	calculateScore(store, context, userPreferences) {
		const distanceScore = this.scoreDistance(store, context.location);
		const weatherScore = this.scoreWeather(store, context.weather);
		const timeScore = this.scoreTimeOfDay(store, context.timeOfDay);
		const preferenceScore = this.scoreUserPreference(store, userPreferences);

		// Weighted sum
		const totalScore =
			distanceScore * this.weights.distance +
			weatherScore * this.weights.weather +
			timeScore * this.weights.timeOfDay +
			preferenceScore * this.weights.userPreference;

		return Math.round(totalScore); // Score out of 100
	}

	// Score #1: Distance (closer = better)
	scoreDistance(store, userLocation) {
		const distance = this.calculateDistance(
			userLocation.latitude,
			userLocation.longitude,
			store.latitude,
			store.longitude,
		);

		if (distance <= 2) return 100;
		if (distance <= 5) return 80;
		if (distance <= 10) return 60;
		if (distance <= 15) return 40;
		if (distance <= 20) return 20;
		return 0;
	}

	// Helper: Calculate distance between two points
	calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 3959; // Earth radius in miles
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

	// Score #2: Weather match
	scoreWeather(store, weather) {
		const temp = weather.temperature;

		if (temp > 75) {
			if (
				store.menu?.includes("fruit_tea") ||
				store.menu?.includes("smoothie") ||
				store.specialties?.includes("iced")
			) {
				return 100;
			}
			return 70;
		}

		if (temp < 55) {
			if (
				store.menu?.includes("coffee") ||
				store.menu?.includes("hot_tea") ||
				store.specialties?.includes("hot")
			) {
				return 100;
			}
			return 70;
		}

		return 85;
	}

	// Score #3: Time of day
	scoreTimeOfDay(store, timeOfDay) {
		const hour = timeOfDay.hour;

		if (store.hours) {
			const isOpen = this.isStoreOpen(store.hours, hour);
			if (!isOpen) {
				return 0;
			}
		}

		if (timeOfDay.period === "morning" && store.category === "coffee") {
			return 100;
		}

		if (timeOfDay.period === "afternoon" && store.category === "boba") {
			return 100;
		}

		return 80;
	}

	isStoreOpen(hours, currentHour) {
		if (!hours.open || !hours.close) return true;

		if (hours.close < hours.open) {
			return currentHour >= hours.open || currentHour < hours.close;
		}

		return currentHour >= hours.open && currentHour < hours.close;
	}

	// Score #4: User preference match (UPDATED - now reads ratings from userPreferences)
	scoreUserPreference(store, userPreferences) {
		let score = 50; // Base score

		// Check allergens - CRITICAL
		if (userPreferences.allergens && userPreferences.allergens.length > 0) {
			const hasAllergen = userPreferences.allergens.some((allergen) =>
				store.allergens?.includes(allergen),
			);
			if (hasAllergen) {
				return 0; // HARD NO if allergen present
			}
		}

		// Check drink type preference
		if (userPreferences.favoriteDrinkTypes && store.menu) {
			const matchingTypes = userPreferences.favoriteDrinkTypes.filter((type) =>
				store.menu.includes(type),
			);
			score += matchingTypes.length * 15;
		}

		// Check if it's a favorite shop
		if (userPreferences.favoriteShops?.includes(store.id)) {
			score += 30; // Big bonus for favorites
		}

		// Check user's ratings (UPDATED - reads from ratings array in userPreferences)
		if (userPreferences.ratings) {
			const userRating = userPreferences.ratings.find(
				(r) => r.storeId === store.id,
			);
			if (userRating) {
				// 5 stars = +30, 4 stars = +20, 3 stars = +0, 2 stars = -20, 1 star = -30
				if (userRating.rating === 5) score += 30;
				else if (userRating.rating === 4) score += 20;
				else if (userRating.rating === 3)
					score += 0; // neutral
				else if (userRating.rating === 2) score -= 20;
				else if (userRating.rating === 1) score -= 30;
			}
		}

		return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
	}

	// Helper: Get detailed score breakdown
	getScoreBreakdown(store, context, userPreferences) {
		return {
			distance: this.scoreDistance(store, context.location),
			weather: this.scoreWeather(store, context.weather),
			timeOfDay: this.scoreTimeOfDay(store, context.timeOfDay),
			userPreference: this.scoreUserPreference(store, userPreferences),
		};
	}

	// Helper: Get human-readable reason for ranking
	getReasonForRanking(store, context, userPreferences) {
		const reasons = [];

		const distance = this.calculateDistance(
			context.location.latitude,
			context.location.longitude,
			store.latitude,
			store.longitude,
		);
		if (distance <= 2) {
			reasons.push(`Very close (${distance.toFixed(1)} mi)`);
		}

		if (
			context.weather.temperature > 75 &&
			(store.menu?.includes("fruit_tea") || store.specialties?.includes("iced"))
		) {
			reasons.push("Great cold drinks for this weather");
		}
		if (
			context.weather.temperature < 55 &&
			(store.menu?.includes("coffee") || store.specialties?.includes("hot"))
		) {
			reasons.push("Perfect for a warm drink");
		}

		if (userPreferences.favoriteShops?.includes(store.id)) {
			reasons.push("One of your favorites");
		}

		if (userPreferences.allergens?.length > 0) {
			reasons.push("Allergen-safe");
		}

		return reasons.length > 0 ? reasons.join(" • ") : "Good match";
	}
}

export default new RankingEngine();
