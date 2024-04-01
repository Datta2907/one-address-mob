import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { getApplicationStatus } from "../services/home"

export const HomeComponent = () => {
    useEffect(async () => {
        await getApplicationStatus();
    }, [])

    return <View style={styles.container}>
        <Text>Application in progress</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})