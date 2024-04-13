import { useEffect, useState } from "react";
import { Keyboard, TextInput, View, StyleSheet, Image, Text } from "react-native";
import { registerUser } from "../services/auth";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Variables from "../common/constants";
import { useRoute } from "@react-navigation/native"
import CommonButton from "../components/common-button";
import { getUserRoles } from "../services/user";
import StepIndicator from "react-native-step-indicator";

const steps = {
    consent: 0,
    register: 1,
    applied: 2,
    inReview: 3,
    welcome: 4
}

const labels = ["Consent", "Register", "In-Progress", "Approved", "Welcome"]
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
}

export function RegisterUser({ navigation }) {
    const route = useRoute();
    // register screen variables
    console.log(route.params)
    let [step, setStep] = useState(0);
    let [roles, setRoles] = useState([]);
    let [firstName, setFirstName] = useState(route.params.firstName);
    let [firstNameError, setFirstNameError] = useState('');
    let [lastName, setLastName] = useState(route.params.lastName);
    let [lastNameError, setLastNameError] = useState('');
    let [email, setEmail] = useState(route.params.email);
    let [role, setRole] = useState('');
    let [roleError, setRoleError] = useState('');
    let [registerPassword, setRegisterPassword] = useState('');
    let [registerPasswordError, setRegisterPasswordError] = useState('');
    let [verifyPassword, setVerifyPassword] = useState('');
    let [passwordMatchError, setPasswordMatchError] = useState('');

    useEffect(() => {
        if (route.params.isNewUser) {
            setStep(steps.consent);
        } else {
            setStep(route.params.status);
        }
    }, [])

    async function getRoles() {
        const roles = await getUserRoles();
        setRoles(roles);
    }

    function validateOnlyLetters(newText) {
        return !/^[a-z]+$/i.test(newText);
    }

    async function register() {
        Keyboard.dismiss();
        roleError == '' && role ? setRoleError('') : setRoleError('Select a role');
        passwordMatchError == '' && verifyPassword ? setPasswordMatchError('') : setPasswordMatchError(`Passwords don't match!`);
        firstNameError == '' && firstName ? setFirstNameError('') : setFirstNameError('Invalid First Name');
        lastNameError == '' && lastName ? setLastNameError('') : setLastNameError('Invalid Last Name');
        registerPasswordError == '' && registerPassword ? setRegisterPasswordError('') : setRegisterPasswordError(passwordErrorMessage);
        const allVariablesExists = role && verifyPassword && firstName && lastName && registerPassword;
        const allVariablesValid = !roleError && !passwordMatchError && !firstNameError && !lastNameError && !registerPasswordError;
        if (allVariablesExists && allVariablesValid) {
            const res = await registerUser(firstName, lastName, role, oauthEmail, registerPassword);
            if (res.success) {
                //next step
            } else {
                Alert.alert(res.message, [{ text: 'OK' }])
            }
        }
    }

    function setStepScreenView() {
        switch (step) {
            case steps.consent:
                return (<View style={styles.scrollContainer}>
                    <Text>Consent</Text>
                </View>)
                break;
            case steps.register:
                return (
                    <View style={styles.scrollContainer}>
                        <SelectDropdown buttonStyle={styles.dropDown} data={['Developer', 'President', 'Resident', 'Non-Resident', 'NA']}
                            onSelect={(selectedItem, index) => { setRole(selectedItem); setRoleError(''); }}
                            defaultButtonText="Select Role"
                            buttonTextAfterSelection={(selectedItem) => { return selectedItem }}
                            rowTextForSelection={(selectedItem) => { return selectedItem }}
                            search={true}
                            searchPlaceHolder="Search Here..."
                            dropdownIconPosition="left"
                            renderDropdownIcon={() => { return <MaterialIcons name="work" size={18} color="black" /> }}
                            renderSearchInputLeftIcon={() => { return <Ionicons name="search" size={18} color="black" /> }}
                        ></SelectDropdown>
                        {roleError.length ? <Text style={styles.errorMessage}>{roleError}</Text> : <></>}
                        <View style={styles.inputBox}>
                            <MaterialCommunityIcons name="account-arrow-left" size={24} color="white" style={styles.icons} />
                            <TextInput
                                style={styles.credentialInputs}
                                placeholder="FirstName"
                                placeholderTextColor={Variables.colors.white}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                multiline={false}
                                selectionColor={Variables.colors.white}
                                keyboardType="ascii-capable"
                                value={firstName}
                                onChangeText={newText => {
                                    setFirstName(newText);
                                    validateOnlyLetters(newText) ? setFirstNameError('Invalid First Name') : setFirstNameError('')
                                }}
                            />
                            {firstNameError.length ? <Text style={styles.errorMessage}>{firstNameError}</Text> : <></>}
                            <MaterialCommunityIcons name="account-arrow-right" size={24} color="white" style={styles.icons} />
                            <TextInput
                                style={styles.credentialInputs}
                                placeholder="LastName"
                                placeholderTextColor={Variables.colors.white}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                multiline={false}
                                selectionColor={Variables.colors.white}
                                keyboardType="ascii-capable"
                                value={lastName}
                                onChangeText={newText => {
                                    setLastName(newText);
                                    validateOnlyLetters(newText) ? setLastNameError('Invalid Last Name') : setLastNameError('')
                                }}
                            />
                            {lastNameError.length ? <Text style={styles.errorMessage}>{lastNameError}</Text> : <></>}
                            <FontAwesome5 name="unlock" size={20} color="white" style={styles.icons} />
                            <TextInput
                                style={styles.credentialInputs}
                                placeholder="Set New Password"
                                placeholderTextColor={Variables.colors.white}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                multiline={false}
                                selectionColor={Variables.colors.white}
                                keyboardType="ascii-capable"
                                value={registerPassword}
                                onChangeText={newText => {
                                    setRegisterPassword(newText);
                                    isPasswordValid(newText) ? setRegisterPasswordError('') : setRegisterPasswordError(passwordErrorMessage)
                                }}
                            />
                            {registerPasswordError.length ? <Text style={styles.errorMessage}>{registerPasswordError}</Text> : <></>}
                            <FontAwesome5 name="unlock" size={20} color="white" style={styles.icons} />
                            <TextInput
                                style={styles.credentialInputs}
                                placeholder="Re-type New Password"
                                placeholderTextColor={Variables.colors.white}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                multiline={false}
                                selectionColor={Variables.colors.white}
                                keyboardType="ascii-capable"
                                value={verifyPassword}
                                onChangeText={newText => {
                                    setVerifyPassword(newText);
                                    registerPassword === newText ? setPasswordMatchError('') : setPasswordMatchError(`Passwords don't match`)
                                }}
                            />
                            {passwordMatchError.length ? <Text style={styles.errorMessage}>{passwordMatchError}</Text> : <></>}
                        </View>
                        <CommonButton
                            clicked={register}
                            text={'Register'}
                            id={'REGISTER'}
                            styles={styles.submitButton}
                            textStyle={styles.baseText}
                            rippleColor={'white'}
                            hideRippleEffect={styles.hideRippleEffect}
                        ></CommonButton>
                    </View>)
                break;
            case steps.applied:
                <View>
                    <Text>Applied</Text>
                </View>
                break;
            case steps.inReview:
                <View>
                    <Text>Inreview</Text>
                </View>
                break;
            default:
                break;
        }
    }
    return (
        <View style={styles.mainContainer}>
            <StepIndicator
                customStyles={customStyles}
                currentPosition={step}
                labels={labels}
            />
            {setStepScreenView()}
        </View>
    )
}

const styles = StyleSheet.create({
    baseText: {
        color: Variables.colors.white,
        fontFamily: Variables.fontStyle
    },
    mainContainer: {
        flex: 1,
        justifyContent: "space-between",
        margin: "5%",
    },
    scrollContainer: {
        flex: 1,
        padding: "5%"
    },
    credentialInputs: {
        opacity: 0.5,
        height: 70,
        borderBottomWidth: 1,
        borderColor: Variables.colors.white,
        color: Variables.colors.white,
        textAlignVertical: 'center',
        textAlign: 'center',
        paddingLeft: '10%',
    },
    icons: {
        color: Variables.colors.white,
        position: 'relative',
        top: 50,
        left: 20
    },
    submitButton: {
        backgroundColor: Variables.colors.green,
        color: Variables.colors.white,
        alignItems: "center",
        padding: '7%',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    hideRippleEffect: {
        overflow: 'hidden',
        borderRadius: 30,
        marginTop: '15%'
    },
    dropDown: {
        width: "100%",
        borderRadius: 5
    },
    errorMessage: {
        color: Variables.colors.red,
        marginTop: '5%',
        marginLeft: '5%'
    }
})

export default RegisterUser;