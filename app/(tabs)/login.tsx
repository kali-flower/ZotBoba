import NavBar from "@/components/ui/navbar";
import { styles } from "@/constants/styles";
import { setCurrentUser } from "@/src/storage/currentUserControls";
import { createAccount, getAccount } from "@/src/storage/supabaseAccounts";
import { colors } from "@/src/theme/tokens";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
    return (
        <>
            <NavBar />
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <LoginPage />
            </ScrollView>
        </>
    )
}

function LoginPage() {
    const [newUsername, setNewUsername] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [newUserError, setNewUserError] = useState("");
    const [loginError, setLoginError] = useState("");

    const handleSubmit = async () => {
        if (!newUsername.trim()) return;

        const success = await createAccount(newUsername);
        if (success) {
            await setCurrentUser(newUsername);
            router.push("/(tabs)");
        } else {
            setNewUserError("Username already taken");
        }
    }

    const loggingIn = async () => {
        if (!loginUsername.trim()) return;

        const success = await getAccount(loginUsername);
        if (success) {
            await setCurrentUser(loginUsername);
            router.push("/(tabs)");
        } else {
            setLoginError("Account not found");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.circleTopLeft} />
            <View style={styles.circleBottomLeft} />
            <View style={styles.circleCenterCenter} />
            <View style={styles.circleBottomCenter} />
            <View style={styles.circleBottomRight} />
            <View style={styles.circleTopRight} />
            <View style={styles.circleCenterRight} />

            <View style={loginPageStyles.content}>
                <View style={loginPageStyles.pageContainer}>
                    <Text style={loginPageStyles.title1}>
                        Don't have an account?
                    </Text>
                    <View style={loginPageStyles.loginContainer}>
                        <TextInput
                            value={newUsername}
                            onChangeText={setNewUsername}
                            placeholder="Enter username"
                            style={loginPageStyles.createAccountTextBox}
                        />

                        <TouchableOpacity onPress={handleSubmit} style={loginPageStyles.buttons}>
                            <Text style={loginPageStyles.buttonText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                    {newUserError ? <View style={loginPageStyles.errorContainer}><Text style={loginPageStyles.errorText}>{newUserError}</Text></View> : null}

                    <Text style={loginPageStyles.title2}>
                        Already have an account?
                    </Text>
                    <View style={loginPageStyles.loginContainer}>
                        <TextInput
                            value={loginUsername}
                            onChangeText={setLoginUsername}
                            placeholder="Enter username"
                            style={loginPageStyles.createAccountTextBox}
                        />

                        <TouchableOpacity onPress={loggingIn} style={loginPageStyles.buttons}>
                            <Text style={loginPageStyles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    {loginError ? <View style={loginPageStyles.errorContainer}><Text style={loginPageStyles.errorText}>{loginError}</Text></View> : null}
                </View>
            </View>
        </View>
    )
}


const loginPageStyles = StyleSheet.create({
    createAccountTextBox: {
        flex: 1,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
    },
    title1: {
        fontSize: 25,
        paddingBottom: 15,
        paddingLeft: 10
    },
    title2: {
        fontSize: 25,
        paddingTop: 30,
        paddingBottom: 15,
        paddingLeft: 10
    },
    buttons: {
        backgroundColor: colors.circles,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderColor: colors.card_border,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 8,
        zIndex: 1,
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
    loginContainer: {
        flexDirection: "row",
        marginTop: 15,
        gap: 10,
    },
    pageContainer: {
        backgroundColor: colors.search_bg,
        borderColor: colors.card_border,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 17,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    errorText: {
        color: "red"
    },
    errorContainer: {
        paddingHorizontal: 10,
        paddingTop: 10
    }
})