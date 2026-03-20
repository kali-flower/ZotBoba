// ContextAggregator.js
// service collects location, weather, and time data

import * as Location from "expo-location";

// constants
const WEATHER_API_KEY =
	process.env.EXPO_PUBLIC_WEATHER_API_KEY || "YOUR_API_KEY_HERE";
const IRVINE_CENTER = { lat: 33.6846, lng: -117.8265 }; // UCI area
const RADIUS_MILES = 20;

class ContextAggregator {
	constructor() {
		this.currentContext = {
			location: null,
			weather: null,
			timeOfDay: null,
			lastUpdated: null,
		};
	}

	// step 1: get user's location
	async getLocation() {
		try {
			// permission to access location check
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				throw new Error("Location permission denied");
			}

			// get actual GPS coordinates
			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});

			const userCoords = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			};

			// calculate how far from Irvine
			const distance = this.calculateDistance(
				userCoords.latitude,
				userCoords.longitude,
				IRVINE_CENTER.lat,
				IRVINE_CENTER.lng,
			);

			this.currentContext.location = {
				...userCoords,
				distanceFromIrvine: distance,
				withinRadius: distance <= RADIUS_MILES,
			};

			return this.currentContext.location;
		} catch (error) {
			console.error("Error getting location:", error);
			throw error;
		}
	}

	// distance between two GPS coordinates
	calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 3959;
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

	// step 2: get weather data from API
	async getWeather(latitude, longitude) {
		try {
			const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=imperial`;

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Weather API request failed");
			}

			const data = await response.json();

			// store important weather info
			this.currentContext.weather = {
				temperature: Math.round(data.main.temp),
				feelsLike: Math.round(data.main.feels_like),
				condition: data.weather[0].main, // "Clear", "Rain", etc.
				description: data.weather[0].description,
				humidity: data.main.humidity,
			};

			console.log("weather fetched: ", this.currentContext.weather);

			return this.currentContext.weather;
		} catch (error) {
			console.error("Error fetching weather:", error);
			throw error;
		}
	}

	// step 3: get current time of day
	getTimeOfDay() {
		const hour = new Date().getHours();

		let timeOfDay;
		if (hour >= 5 && hour < 12) {
			timeOfDay = "morning";
		} else if (hour >= 12 && hour < 17) {
			timeOfDay = "afternoon";
		} else if (hour >= 17 && hour < 21) {
			timeOfDay = "evening";
		} else {
			timeOfDay = "night";
		}

		this.currentContext.timeOfDay = {
			period: timeOfDay,
			hour: hour,
		};

		return this.currentContext.timeOfDay;
	}

	// main loop to aggregate all context data
	async aggregateContext() {
		try {
			// step 1: Get location
			const location = await this.getLocation();

			// weather based on that location
			const weather = await this.getWeather(
				location.latitude,
				location.longitude,
			);

			// time of day
			const timeOfDay = this.getTimeOfDay();

			this.currentContext.lastUpdated = new Date().toISOString();

			return {
				location,
				weather,
				timeOfDay,
				lastUpdated: this.currentContext.lastUpdated,
			};
		} catch (error) {
			console.error("Error aggregating context:", error);
			throw error;
		}
	}
}

export default new ContextAggregator();
