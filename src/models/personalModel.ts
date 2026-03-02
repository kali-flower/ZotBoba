export type SweetnessLevel = "low" | "medium" | "high"; // for now
export type IceLevel = "none" | "less" | "regular" | "extra"; // for now

export type PersonalModel = {
  sweetness: SweetnessLevel;
  ice: IceLevel;

  // keep it simple for now
  allergies: string[];        // e.g. ["dairy", "nuts"]
  favoriteShopIds: string[];  // store IDs from Yelp/Places later
};

export const DEFAULT_PERSONAL_MODEL: PersonalModel = {
  sweetness: "medium",
  ice: "regular",
  allergies: [],
  favoriteShopIds: [],
};