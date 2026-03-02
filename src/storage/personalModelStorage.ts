import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PERSONAL_MODEL, PersonalModel } from "../models/personalModel";

const KEY = "zotboba.personalModel.v1";

export async function loadPersonalModel(): Promise<PersonalModel> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_PERSONAL_MODEL;

    return JSON.parse(raw);
  } catch {
    return DEFAULT_PERSONAL_MODEL;
  }
}

export async function savePersonalModel(model: PersonalModel) {
  await AsyncStorage.setItem(KEY, JSON.stringify(model));
}