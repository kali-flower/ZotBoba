import AsyncStorage from '@react-native-async-storage/async-storage';


export async function setCurrentUser(username: string) {
    await AsyncStorage.setItem('currentUser', username);
}


export async function getCurrentUser(): Promise<string | null> {
    return await AsyncStorage.getItem('currentUser');
}

export async function logout() {
    await AsyncStorage.removeItem('currentUser');
}