import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { getApplicationStatus } from "../services/home"

export const HomeComponent = () => {
    useEffect(() => {
        async function getStatus() {
            await getApplicationStatus();
        }
        getStatus();
    }, [])

    return (<View><Text>Hello Home</Text></View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})