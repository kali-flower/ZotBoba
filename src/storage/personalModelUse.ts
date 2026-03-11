import { DEFAULT_PERSONAL_MODEL, PersonalModel } from '../models/personalModel';
import { supabase } from './supabaseStore';


export async function loadPersonalModel(username: string): Promise<PersonalModel> {
    const { data } = await supabase
        .from('users')
        .select('personal_model')
        .eq('username', username)
        .single();
    return data?.personal_model ?? DEFAULT_PERSONAL_MODEL;
}


export async function savePersonalModel(username: string, model: PersonalModel) {
    await supabase
        .from('users')
        .update({ personal_model: model })
        .eq('username', username);
}
