import { colors } from "@/src/theme/tokens";
import { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from 'react-native';

type Props = {
    children: ReactNode;
}

export default function Background({children} : Props) {
    return (
        <View style={styles.container}>
            <View style={styles.circleTopLeft} />
            <View style={styles.circleBottomLeft}/>
            <View style={styles.circleCenterCenter}/>
            <View style={styles.circleBottomCenter}/>
            <View style={styles.circleBottomRight}/>
            <View style={styles.circleTopRight}/>
            <View style={styles.circleCenterRight}/>
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const { width, height } = Dimensions.get("window");
const smallBobaSize = width * 0.1;
const bigBobaSize = width * 0.16;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    circleTopLeft: {
        position: "absolute",
        width: width*0.1,
        height: width*0.1,
        borderRadius: smallBobaSize,
        backgroundColor: colors.circles,
        top: 10,
        left: 60,
    },
    circleBottomLeft: {
        position: "absolute",
        width: width*0.16,
        height: width*0.16,
        borderRadius: bigBobaSize,
        backgroundColor: colors.circles,
        top: 700,
        left: -50,
    },
    circleCenterCenter: {
        position: "absolute",
        width: width*0.16,
        height: width*0.16,
        borderRadius: bigBobaSize,
        backgroundColor: colors.circles,
        top: 250,
        left: 900,
    },
    circleBottomCenter: {
        position: "absolute",
        width: width*0.1,
        height: width*0.1,
        borderRadius: smallBobaSize,
        backgroundColor: colors.circles,
        top: 650,
        left: 550,
    },
    circleBottomRight: {
        position: "absolute",
        width: width*0.16,
        height: width*0.16,
        borderRadius: bigBobaSize,
        backgroundColor: colors.circles,
        bottom: -110,
        right: 45,
    },
    circleTopRight: {
        position: "absolute",
        width: width*0.16,
        height: width*0.16,
        borderRadius: bigBobaSize,
        backgroundColor: colors.circles,
        top: -50,
        right: -110,
    },
    circleCenterRight: {
        position: "absolute",
        width: width*0.1,
        height: width*0.1,
        borderRadius: smallBobaSize,
        backgroundColor: colors.circles,
        top: 375,
        right: 110,
    },
});