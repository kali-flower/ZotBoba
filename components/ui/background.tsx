import { styles } from "@/constants/styles";
import { View } from 'react-native';

type Props = {
}

export default function Background() {
    return (
        <View style={{zIndex: -10}}>
            <View style={styles.container}>
                <View style={styles.circleTopLeft} />
                <View style={styles.circleBottomLeft} />
                <View style={styles.circleCenterCenter} />
                <View style={styles.circleBottomCenter} />
                <View style={styles.circleBottomRight} />
                <View style={styles.circleTopRight} />
                <View style={styles.circleCenterRight} />
            </View>
        </View>
    );
}