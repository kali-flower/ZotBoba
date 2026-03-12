export type SweetnessLevel = "low" | "medium" | "high";
export type IceLevel = "none" | "less" | "regular" | "extra";

export type StoreRating = {
	storeId: string;
	storeName: string;
	rating: number; // 1-5
	ratedAt: string;
};

export type PersonalModel = {
	sweetness: SweetnessLevel;
	ice: IceLevel;
	allergies: string[];
	favoriteShopIds: string[];
	ratings: StoreRating[];
};

export const DEFAULT_PERSONAL_MODEL: PersonalModel = {
	sweetness: "medium",
	ice: "regular",
	allergies: [],
	favoriteShopIds: [],
	ratings: [],
};
