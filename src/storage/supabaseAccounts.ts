import { supabase } from './supabaseStore';


export async function createAccount(username: string): Promise<boolean> {
    const { error } = await supabase
        .from('users')
        .insert({ username });
    return !error;
}


export async function getAccount(username: string) {
    const { data } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
    return data || null;
}