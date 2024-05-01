import { useEffect, useState } from "react";
import { Keyboard, TextInput, View, StyleSheet, Text, ScrollView, Alert, KeyboardAvoidingView, Button, Image } from "react-native";
import { registerUser } from "../services/auth";
import * as ImagePicker from 'expo-image-picker';
import SelectDropdown from "react-native-select-dropdown";
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import Variables from "../common/constants";
import { useRoute } from "@react-navigation/native"
import CommonButton from "../components/common-button";
import { getRepresentatives } from "../services/user";
import StepIndicator from "react-native-step-indicator";
import Checkbox from "expo-checkbox";
import { PhoneInput } from "../components/phone-input";
import SuccessAnimation from "../components/success-animation";

const steps = {
    consent: 0,
    register: 1,
    applied: 2,
    inReview: 3,
    welcome: 4
}

const labels = ["Consent", "Register", "In-Progress", "Approved", "Welcome"]
const termsAndConditions = [
    'The content of the pages of this website is for your general information and use only. It is subject to change without notice.',
    'This app contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.',
    'Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.',
    'From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).',
    'Your use of this website and any dispute arising out of such use of the app is subject to The Law of India.',
]
const passwordErrorMessage = 'Password Must Contain \n 1.Atleast one capital alphabet.\n 2.Atleast one lower alphabet.\n 3.Atleast one number.\n 4.Atleast one special character.\n 5.A length of range [8-15]';

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: Variables.colors.green,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Variables.colors.green,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Variables.colors.green,
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
    const email = route.params.email;
    const community = route.params.community;
    const role = route.params.role;
    const showResidents = (role != 'PRESIDENT' && role != "RESIDENT");
    const [profilePic, setProfilePic] = useState(null);
    const [isChecked, setChecked] = useState(false);
    const [step, setStep] = useState(route.params.isNewUser ? steps.consent : route.params.status);
    const [representatives, setRepresentatives] = useState([]);
    const [terms, setTerms] = useState([]);
    const [firstName, setFirstName] = useState(route.params.firstName);
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState(route.params.lastName);
    const [lastNameError, setLastNameError] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [mobile, setMobile] = useState(undefined);
    const [mobileError, setMobileError] = useState('');
    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState('');
    const [isRepresentative, setIsRepresentative] = useState(undefined);
    const [representativeError, setRepresentativeError] = useState('');
    const [displaySensitiveDetailsConsent, setDisplaySensitiveDetailsConsent] = useState(undefined);
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordError, setRegisterPasswordError] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    useEffect(() => {
        setTermsAndConditions();
        if (showResidents) {
            getAllRepresentatives();
        }
    }, [])

    async function getAllRepresentatives() {
        let result = await getRepresentatives();
        if (result.success) {
            setRepresentatives(result.data);
        } else {
            Alert.alert('Error', result.message, [{ text: 'Ok' }]);
        }
    }
    function setTermsAndConditions() {
        let result = [];
        for (let i = 0; i < termsAndConditions.length; i++) {
            result.push(<Text style={styles.eachTerm} key={i}>{`\u2023 ${termsAndConditions[i]}`}</Text>)
        }
        setTerms(result);
    }

    function isPasswordValid(text) {
        if (text.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/)) {
            return true;
        } else {
            return false;
        }
    }

    function validateOnlyLetters(newText) {
        return !/^[a-z_]+( [a-z_]+)*$/i.test(newText);
    }

    async function pickImage() {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };

    async function register() {
        Keyboard.dismiss();
        gender != '' ? setGenderError('') : setGenderError('Select a gender');
        role != 'RESIDENT' && isRepresentative ? setRepresentativeError('') : setRepresentativeError('Select your flat owner or representative');
        firstNameError == '' && firstName ? setFirstNameError('') : setFirstNameError('Invalid First Name');
        lastNameError == '' && lastName ? setLastNameError('') : setLastNameError('Invalid Last Name');
        address != '' ? setAddressError('') : setAddressError('Address is required');
        registerPasswordError == '' && registerPassword ? setRegisterPasswordError('') : setRegisterPasswordError(passwordErrorMessage);
        registerPassword == verifyPassword ? setPasswordMatchError('') : setPasswordMatchError(`Passwords don't match!`);
        mobile == undefined ? setMobileError('Invalid Phone Number') : setMobileError('');
        const allVariablesValid = !genderError && !representativeError && !firstNameError && !lastNameError && !addressError && !mobileError && !registerPasswordError && !passwordMatchError;
        if (allVariablesValid) {
            console.log(gender, role, community, firstName, lastName, address, registerPassword, verifyPassword);
            // const res = await registerUser(firstName, lastName, role, oauthEmail, registerPassword);
            // if (res.success) {
            //     navigation.navigate('Home');
            // } else {
            //     Alert.alert('Warning', res.message, [{ text: 'OK' }])
            // }
        }
    }

    function submitConsent() {
        if (isChecked) {
            setStep(1);
        } else {
            Alert.alert('Warning', 'Please Agree to the Terms And Conditions!', [{ text: 'OK' }]);
        }
    }

    function setStepScreenView() {
        switch (step) {
            case steps.consent:
                return (
                    <View style={styles.scrollContainer}>
                        <Text style={[styles.baseText, styles.heading]}>Welcome</Text>
                        <View style={styles.conditionsBox}>
                            <ScrollView persistentScrollbar={true}>
                                {terms}
                            </ScrollView>
                        </View>
                        <View style={styles.checkBoxDialog}>
                            <Checkbox
                                style={styles.checkConsent}
                                value={isChecked}
                                onValueChange={setChecked}
                                color={isChecked ? '#4630EB' : undefined} />
                            <Text style={styles.baseText}>I Agree to the Terms And Conditions.</Text>
                        </View>
                        <CommonButton
                            clicked={submitConsent}
                            text={'Submit'}
                            id={'SUBMIT_CONSENT'}
                            styles={styles.submitButton}
                            rippleColor={'white'}
                            textStyle={styles.baseText}
                            hideRippleEffect={styles.hideRippleEffect}></CommonButton>
                    </View>
                )
            case steps.register:
                return (
                    <View style={styles.basicVerticalScrollContainer}>
                        <KeyboardAvoidingView behavior="padding" style={styles.basicContainer} enabled>
                            <ScrollView style={styles.basicHorizontalScrollContainer} keyboardShouldPersistTaps={'always'} persistentScrollbar={true}>
                                <Button title="Pick an image from camera roll" onPress={pickImage} />
                                {profilePic && <View style={styles.centerBox} ><Image source={{ uri: profilePic }} style={styles.profilePic} /></View>}
                                <SelectDropdown buttonStyle={styles.dropDown} data={['FEMALE', 'MALE', 'OTHERS', 'PREFER_NOT_TO_SAY']}
                                    onSelect={(selectedItem, index) => { setGender(selectedItem); setGenderError(''); }}
                                    defaultButtonText="Select Gender"
                                    buttonTextAfterSelection={(selectedItem) => { return selectedItem }}
                                    rowTextForSelection={(selectedItem) => { return selectedItem }}
                                ></SelectDropdown>
                                {genderError.length ? <Text style={styles.errorMessage}>{genderError}</Text> : <></>}
                                {role != 'RESIDENT' && <SelectDropdown buttonStyle={styles.dropDown} data={representatives}
                                    onSelect={(selectedItem, index) => { setAddress(selectedItem.address); setIsRepresentative(true) }}
                                    defaultButtonText="Select Your Representative"
                                    buttonTextAfterSelection={(selectedItem) => { return selectedItem.name }}
                                    rowTextForSelection={(selectedItem) => { return selectedItem.name }}
                                    dropdownIconPosition="left"
                                    renderDropdownIcon={() => { return <FontAwesome name="user" size={18} color="black" /> }}
                                ></SelectDropdown>}
                                {representativeError.length ? <Text style={styles.errorMessage}>{representativeError}</Text> : <></>}
                                <View style={styles.inputBox}>
                                    <MaterialCommunityIcons name="account-arrow-left" size={24} color="white" style={styles.icons} />
                                    <TextInput
                                        style={styles.credentialInputs}
                                        placeholder="FirstName"
                                        placeholderTextColor={Variables.colors.white}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        multiline={true}
                                        blurOnSubmit={true}
                                        selectionColor={Variables.colors.white}
                                        keyboardType="ascii-capable"
                                        value={firstName}
                                        maxLength={20}
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
                                        multiline={true}
                                        blurOnSubmit={true}
                                        selectionColor={Variables.colors.white}
                                        keyboardType="ascii-capable"
                                        value={lastName}
                                        maxLength={10}
                                        onChangeText={newText => {
                                            setLastName(newText);
                                            validateOnlyLetters(newText) ? setLastNameError('Invalid Last Name') : setLastNameError('')
                                        }}
                                    />
                                    {lastNameError.length ? <Text style={styles.errorMessage}>{lastNameError}</Text> : <></>}
                                    <MaterialIcons name="email" size={20} color="white" style={styles.icons} />
                                    <TextInput
                                        style={styles.credentialInputs}
                                        placeholder="Email"
                                        placeholderTextColor={Variables.colors.white}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        multiline={true}
                                        blurOnSubmit={true}
                                        selectionColor={Variables.colors.white}
                                        keyboardType="ascii-capable"
                                        value={email}
                                        editable={false}
                                        selectTextOnFocus={false}
                                    />
                                    <Entypo name="location-pin" size={24} color="black" style={styles.icons} />
                                    <TextInput
                                        style={styles.credentialInputs}
                                        placeholder="Address"
                                        placeholderTextColor={Variables.colors.white}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        multiline={true}
                                        blurOnSubmit={true}
                                        selectionColor={Variables.colors.white}
                                        keyboardType="ascii-capable"
                                        value={address}
                                        maxLength={30}
                                        editable={isRepresentative}
                                        onChangeText={newText => {
                                            setAddress(newText);
                                            newText == '' ? setAddressError('Address is required') : setAddressError('');
                                        }}
                                    />
                                    {addressError.length ? <Text style={styles.errorMessage}>{addressError}</Text> : <></>}
                                    <PhoneInput
                                        parsedDetails={setMobile}
                                        errorMessage={setMobileError}
                                    />
                                    {mobileError.length ? <Text style={styles.errorMessage}>{mobileError}</Text> : <></>}
                                    <FontAwesome5 name="unlock" size={20} color="white" style={styles.icons} />
                                    <TextInput
                                        style={styles.credentialInputs}
                                        placeholder="Set New Password"
                                        placeholderTextColor={Variables.colors.white}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        multiline={true}
                                        blurOnSubmit={true}
                                        selectionColor={Variables.colors.white}
                                        keyboardType="ascii-capable"
                                        value={registerPassword}
                                        maxLength={15}
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
                                        multiline={true}
                                        blurOnSubmit={true}
                                        selectionColor={Variables.colors.white}
                                        keyboardType="ascii-capable"
                                        value={verifyPassword}
                                        maxLength={15}
                                        onChangeText={newText => {
                                            setVerifyPassword(newText);
                                            registerPassword === newText ? setPasswordMatchError('') : setPasswordMatchError(`Passwords don't match`)
                                        }}
                                    />
                                    {passwordMatchError.length ? <Text style={styles.errorMessage}>{passwordMatchError}</Text> : <></>}
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                        <CommonButton
                            clicked={register}
                            text={'Register'}
                            id={'REGISTER'}
                            styles={styles.registerButton}
                            textStyle={styles.baseText}
                            rippleColor={'white'}
                            hideRippleEffect={styles.hideRippleEffect}
                        ></CommonButton>
                    </View>
                )
            case steps.applied:
                return (
                    <View style={styles.basicContainer}>
                        <SuccessAnimation
                            path={require('../assets/success-green-circle.json')}
                            styles={styles.emailVerified}
                            autoPlay={true}
                            loop={true}
                        ></SuccessAnimation>
                    </View>
                )
            case steps.inReview:
                return (
                    <View>
                        <Text>Inreview</Text>
                    </View>
                )
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
    basicContainer: {
        flex: 1
    },
    basicHorizontalScrollContainer: {
        flex: 1,
        paddingHorizontal: '5%',
    },
    basicVerticalScrollContainer: {
        flex: 1,
        paddingVertical: '5%',
    },
    baseText: {
        color: Variables.colors.white,
        fontFamily: Variables.fontStyle
    },
    heading: {
        fontSize: 30,
        textAlign: 'center'
    },
    conditionsBox: {
        height: '70%',
        marginTop: 20
    },
    eachTerm: {
        fontSize: 15,
        textAlign: 'left',
        marginBottom: 20,
        marginRight: 20,
        color: Variables.colors.white
    },
    checkBoxDialog: {
        marginBottom: 10,
        marginHorizontal: 15,
        marginTop: 20,
        flexDirection: 'row'
    },
    checkConsent: {
        marginBottom: 10,
        marginRight: 10
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
        height: 50,
        borderBottomWidth: 1,
        borderColor: Variables.colors.white,
        color: Variables.colors.white,
        textAlignVertical: 'center',
        textAlign: 'center',
        paddingLeft: '10%'
    },
    icons: {
        color: Variables.colors.white,
        position: 'relative',
        top: 40,
        left: 10
    },
    submitButton: {
        backgroundColor: Variables.colors.green,
        color: Variables.colors.white,
        alignItems: "center",
        borderRadius: 5,
        justifyContent: 'center',
        padding: '5%',
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
    dropDown: {
        width: "100%",
        borderRadius: 5,
        marginTop: '5%'
    },
    emailVerified: {
        height: 300
    },
    errorMessage: {
        color: Variables.colors.red,
        marginTop: '5%',
        marginLeft: '5%'
    },
    profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: '5%'
    },
    centerBox: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default RegisterUser;