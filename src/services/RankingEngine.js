class RankingEngine {
	constructor() {
		// weights for different factors
		this.weights = {
			distance: 0.3, // 30% - how far away
			weather: 0.2, // 20% - weather match
			timeOfDay: 0.15, // 15% - is it open?
			userPreference: 0.35, // 35% - matches user taste
		};
	}

	// rank all stores
	rankStores(stores, context, userPreferences) {
		const scoredStores = stores.map((store) => {
			const score = this.calculateScore(store, context, userPreferences);
			return {
				...store,
				score: score,
				breakdown: this.getScoreBreakdown(store, context, userPreferences),
			};
		});

		const ranked = scoredStores.sort((a, b) => b.score - a.score);

		// return top 5
		return ranked.slice(0, 5);
	}

	// calculate total score for a store
	calculateScore(store, context, userPreferences) {
		const distanceScore = this.scoreDistance(store, context.location);
		const weatherScore = this.scoreWeather(store, context.weather);
		const timeScore = this.scoreTimeOfDay(store, context.timeOfDay);
		const preferenceScore = this.scoreUserPreference(store, userPreferences);

		const totalScore =
			distanceScore * this.weights.distance +
			weatherScore * this.weights.weather +
			timeScore * this.weights.timeOfDay +
			preferenceScore * this.weights.userPreference;

		return Math.round(totalScore * 100);
	}

	// Sistance (closer = better)
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

	// weather match
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

	// time of day
	scoreTimeOfDay(store, timeOfDay) {
		const hour = timeOfDay.hour;

		// check if store is open
		if (store.hours) {
			const isOpen = this.isStoreOpen(store.hours, hour);
			if (!isOpen) {
				return 0; // Closed = no points
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

	// user preference match
	scoreUserPreference(store, userPreferences) {
		let score = 50;

		if (userPreferences.allergens && userPreferences.allergens.length > 0) {
			const hasAllergen = userPreferences.allergens.some((allergen) =>
				store.allergens?.includes(allergen),
			);
			if (hasAllergen) {
				return 0;
			}
		}

		if (userPreferences.favoriteDrinkTypes && store.menu) {
			const matchingTypes = userPreferences.favoriteDrinkTypes.filter((type) =>
				store.menu.includes(type),
			);
			score += matchingTypes.length * 15;
		}

		if (userPreferences.favoriteShops?.includes(store.id)) {
			score += 30;
		}

		if (store.userRating) {
			if (store.userRating >= 4) score += 20;
			if (store.userRating <= 2) score -= 30;
		}

		return Math.min(score, 100);
	}

	getScoreBreakdown(store, context, userPreferences) {
		return {
			distance: this.scoreDistance(store, context.location),
			weather: this.scoreWeather(store, context.weather),
			timeOfDay: this.scoreTimeOfDay(store, context.timeOfDay),
			userPreference: this.scoreUserPreference(store, userPreferences),
		};
	}

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
