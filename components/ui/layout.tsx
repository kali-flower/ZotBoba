import { colors } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Background from "./background";
import NavBar from "./navbar";


type Props = {
    children: ReactNode,
}

export default function Layout({children}: Props) {
    return (
        <View style={styles.container}>
            <Background>
                <NavBar/>
                <View style={styles.content}>{children}</View>
            </Background>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
            flex: 1,
            backgroundColor: colors.background,
        },
    content: {
        flex: 1,
    },
});