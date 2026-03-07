export type ContextData = {
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

export type RankedStore = {
    id: string;
    name: string;
    score: number;
    category: string;
    latitude: number;
    longitude: number;
    breakdown: {
        distance: number;
        weather: number;
        timeOfDay: number;
        userPreference: number;
    };
};