import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { getApplicationStatus } from "../services/user"
import CommonButton from "../components/common-button"
import Variables from "../common/constants"

export const HomeComponent = () => {
    useEffect(() => {
        async function getStatus() {
            await getApplicationStatus();
        }
        getStatus();
    }, [])

    return (<View style={styles.container}><Text style={styles.baseText}>Welcome Home</Text>
        <CommonButton
            clicked={getApplicationStatus}
            text={'Status'}
            id={'STATUS'}
            styles={styles.registerButton}
            textStyle={styles.baseText}
            rippleColor={'white'}
            hideRippleEffect={styles.hideRippleEffect}
        ></CommonButton></View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    registerButton: {
        backgroundColor: Variables.colors.green,
        color: Variables.colors.white,
        alignItems: "center",
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: '15%',
        paddingVertical: '5%',
        marginTop: '10%'
    },
    hideRippleEffect: {
        overflow: 'hidden',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    baseText: {
        color: Variables.colors.white,
        fontFamily: Variables.fontStyle
    },
})