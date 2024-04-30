import { View, TextInput, Text, StyleSheet, Keyboard, KeyboardAvoidingView, ScrollView, Alert, ToastAndroid } from "react-native"
import CommonButton from "../components/common-button"
import { useEffect, useState } from "react";
import { MaterialIcons, Ionicons, FontAwesome5, AntDesign, Entypo } from '@expo/vector-icons';
import Variables from "../common/constants";
import SelectDropdown from "react-native-select-dropdown";
import SuccessAnimation from "../components/success-animation";
import { loginWithPassword, sendVerificationCode, verifyCode, verifyGoogleIdToken } from "../services/auth";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCommunitiesInCity } from "../services/community";

const screens = {
    signUp: "signUp",
    signIn: "signIn",
    login: "login",
    enterEmail: "enterEmail",
    verifyCode: "verifyCode",
    loading: "loading",
}

const passwordErrorMessage = 'Password Must Contain \n 1.Atleast one capital alphabet.\n 2.Atleast one lower alphabet.\n 3.Atleast one number.\n 4.Atleast one special character.\n 5.A length of range [8-15]';

export function SignInOrSignUpComponent({ navigation }) {
    const [currentTab, setCurrentTab] = useState(screens.login);
    const [parentTab, setParentTab] = useState(screens.signIn);
    // login screen variables
    const [loginEmail, setLoginEmail] = useState('');
    const [loginEmailError, setLoginEmailError] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginPasswordError, setLoginPasswordError] = useState('');
    //send email-otp variables
    const [role, setRole] = useState('');
    const [roleError, setRoleError] = useState('');
    const [communities, setCommunities] = useState();
    const [community, setCommunity] = useState('');
    const [communityError, setCommunityError] = useState('');
    const [oauthEmail, setOauthEmail] = useState('');
    const [oauthEmailError, setOauthEmailError] = useState('');
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
            offlineAccess: true,
        })
        getCommunities();
    }, [])

    function signIn() {
        if (currentTab != screens.loading) {
            setCurrentTab(screens.login);
            setParentTab(screens.signIn);
            setRole('');
            setRoleError('');
            setCommunity('');
            setCommunityError('');
            setOauthEmail('');
            setOauthEmailError('');
            setOtp('');
            setOtpError('');
        }
    }

    function signUp() {
        if (currentTab != screens.loading) {
            setCurrentTab(screens.enterEmail);
            setParentTab(screens.signUp);
            setLoginEmail('');
            setLoginEmailError('');
            setLoginPassword('');
            setLoginPasswordError('');
        }
    }

    function isEmailValid(newText) {
        if (newText.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return true;
        } else {
            return false;
        }
    }

    function isPasswordValid(text) {
        if (text.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/)) {
            return true;
        } else {
            return false;
        }
    }

    async function getCommunities() {
        const result = await getCommunitiesInCity();
        if (result.success) {
            setCommunities(result.data)
        } else {
            Alert.alert(res.message, [{ text: 'OK' }])
        }
    }

    async function login() {
        Keyboard.dismiss();
        loginEmailError == '' && loginEmail ? setLoginEmailError('') : setLoginEmailError('Invalid Email');
        loginPasswordError == '' && loginPassword ? setLoginPasswordError('') : setLoginPasswordError(passwordErrorMessage);
        if (!loginEmailError && !loginPasswordError) {
            setCurrentTab(screens.loading);
            const res = await loginWithPassword(loginEmail, loginPassword);
            if (res.success) {
                await AsyncStorage.setItem("authToken", res.data.token)
            } else {
                Alert.alert(res.message, [{ text: 'OK' }])
            }
        }
    }

    function validateDetails() {
        oauthEmailError == '' && oauthEmail ? setOauthEmailError('') : setOauthEmailError('Invalid Email');
        community == '' ? setCommunityError('Select a community') : setCommunityError('');
        return !communityError && !oauthEmailError;
    }

    async function sendCode() {
        Keyboard.dismiss();
        const isDataValid = validateDetails();
        if (isDataValid) {
            setCurrentTab(screens.loading);
            const res = await sendVerificationCode(oauthEmail);
            if (res.success) {
                setCurrentTab(screens.verifyCode);
            } else {
                Alert.alert(res.message, [{ text: 'OK' }])
            }
        }
    }

    async function signUpWithGoogle() {
        try {
            const isDataValid = validateDetails();
            if (isDataValid) {
                setCurrentTab(screens.loading);
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                //need to store token details in redux
                if (userInfo) {
                    let verifyWithGoogleServer = await verifyGoogleIdToken(userInfo.idToken, userInfo.user.email)
                    if (verifyWithGoogleServer.success) {
                        //navigate with these details
                        navigation.navigate('registerUser', {
                            firstName: userInfo.user.givenName,
                            lastName: userInfo.user.familyName,
                            email: userInfo.user.email,
                            role,
                            community,
                            photo: userInfo.user.photo,
                            isNewUser: true,
                        })
                    }
                }
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                Alert.alert('Warning', 'Sign In is already in progress!', [{ text: 'OK' }])
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    'Something went wrong, please sign up again!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                );
                setCurrentTab(screens.enterEmail);
                signUp();
            }
        }
    }

    async function verifyOtp() {
        if (!otpError && otp) {
            const res = await verifyCode(oauthEmail, otp);
            setCurrentTab(screens.loading);
            if (res.success) {
                //navigate with current details
                navigation.navigate('registerUser', {
                    firstName: '',
                    lastName: '',
                    email: oauthEmail,
                    role,
                    community,
                    photo: '',
                    isNewUser: true,
                })
                setOtp('');
            } else {
                Alert.alert(res.message, [{ text: 'OK' }])
            }
        }
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.scrollContainer} enabled>
            <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
                <View style={styles.container}>
                    <Text style={[styles.baseText, styles.heading]}>COMGR</Text>
                    <View style={styles.signInUpBox}>
                        <CommonButton
                            clicked={signIn}
                            text={'SIGN IN'}
                            id={'SIGN_IN'}
                            styles={parentTab == screens.signIn ? styles.tabSelected : styles.pressedItem}
                            textStyle={styles.baseText}
                        ></CommonButton>
                        <CommonButton
                            clicked={signUp}
                            text={'SIGN UP'}
                            id={'SIGN_UP'}
                            styles={parentTab != screens.signIn ? styles.tabSelected : styles.pressedItem}
                            textStyle={styles.baseText}
                        ></CommonButton>
                    </View>
                    {currentTab == screens.login ?
                        //signup using google auth else using otp then register for a particular committee
                        <View style={styles.inputBox}>
                            <MaterialIcons name="email" size={20} color="black" style={styles.icons} />
                            <TextInput
                                style={styles.credentialInputs}
                                placeholder="Email"
                                placeholderTextColor={Variables.colors.white}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                multiline={false}
                                selectionColor={Variables.colors.white}
                                keyboardType="email-address"
                                value={loginEmail}
                                onChangeText={newText => {
                                    isEmailValid(newText) ? setLoginEmailError('') : setLoginEmailError('Invalid Email');
                                    setLoginEmail(newText);
                                }}
                            />
                            {loginEmailError.length ? <Text style={styles.errorMessage}>{loginEmailError}</Text> : <></>}
                            <FontAwesome5 name="unlock" size={20} color="white" style={styles.icons} />
                            <TextInput
                                style={styles.credentialInputs}
                                placeholder="Password"
                                placeholderTextColor={Variables.colors.white}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect={false}
                                multiline={false}
                                maxLength={15}
                                selectionColor={Variables.colors.white}
                                value={loginPassword}
                                onChangeText={newText => {
                                    isPasswordValid(newText) ? setLoginPasswordError('') : setLoginPasswordError(passwordErrorMessage);
                                    setLoginPassword(newText)
                                }}
                            />
                            {loginPasswordError.length ? <Text style={styles.errorMessage}>{loginPasswordError}</Text> : <></>}
                            <CommonButton
                                clicked={login}
                                text={'Login'}
                                id={'LOGIN'}
                                styles={styles.submitButton}
                                textStyle={styles.baseText}
                                rippleColor={'white'}
                                hideRippleEffect={styles.hideRippleEffect}
                            ></CommonButton>
                        </View>
                        :
                        currentTab == screens.enterEmail ?
                            <View style={styles.inputBox}>
                                <SelectDropdown buttonStyle={styles.dropDown} data={['PRESIDENT', 'RESIDENT', 'TENANTS', 'OTHERS']}
                                    onSelect={(selectedItem, index) => { setRole(selectedItem); setRoleError(''); }}
                                    defaultButtonText="Select Role"
                                    buttonTextAfterSelection={(selectedItem) => { return selectedItem }}
                                    rowTextForSelection={(selectedItem) => { return selectedItem }}
                                ></SelectDropdown>
                                {roleError.length ? <Text style={styles.errorMessage}>{roleError}</Text> : <></>}
                                {role != 'PRESIDENT' && <SelectDropdown buttonStyle={styles.dropDown} data={communities}
                                    onSelect={(selectedItem, index) => { setCommunity(selectedItem._id); setCommunityError(''); }}
                                    defaultButtonText="Select Community"
                                    buttonTextAfterSelection={(selectedItem) => { return selectedItem.name }}
                                    rowTextForSelection={(selectedItem) => { return selectedItem.name }}
                                    search={true}
                                    searchPlaceHolder="Search Here..."
                                    dropdownIconPosition="left"
                                    renderDropdownIcon={() => { return <Entypo name="location-pin" size={18} color="black" /> }}
                                    renderSearchInputLeftIcon={() => { return <FontAwesome5 name="search-location" size={18} color="black" /> }}
                                ></SelectDropdown>}
                                {communityError.length ? <Text style={styles.errorMessage}>{communityError}</Text> : <></>}
                                <MaterialIcons name="email" size={20} color="white" style={styles.icons} />
                                <TextInput
                                    style={styles.credentialInputs}
                                    placeholder="Email"
                                    placeholderTextColor={Variables.colors.white}
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    autoCorrect={false}
                                    multiline={false}
                                    selectionColor={Variables.colors.white}
                                    keyboardType="email-address"
                                    value={oauthEmail}
                                    onChangeText={newText => {
                                        isEmailValid(newText) ? setOauthEmailError('') : setOauthEmailError('Invalid Email');
                                        setOauthEmail(newText);
                                    }}
                                />
                                {oauthEmailError.length ? <Text style={styles.errorMessage}>{oauthEmailError}</Text> : <></>}
                                <CommonButton
                                    clicked={sendCode}
                                    text={'Send Verification Code'}
                                    id={'SEND_CODE'}
                                    styles={styles.submitButton}
                                    rippleColor={'white'}
                                    textStyle={styles.baseText}
                                    hideRippleEffect={styles.hideRippleEffect}
                                ></CommonButton>
                                <CommonButton
                                    clicked={signUpWithGoogle}
                                    text={'Sign Up With Google'}
                                    id={'SIGN_UP_GOOGLE'}
                                    styles={styles.submitButton}
                                    rippleColor={'white'}
                                    textStyle={[styles.baseText, styles.marginForIconOnLeft]}
                                    hideRippleEffect={styles.hideRippleEffect}
                                    icon={<AntDesign name="google" size={20} color="white" />}
                                ></CommonButton>
                            </View>
                            : currentTab == screens.verifyCode ?
                                <View style={styles.inputBox}>
                                    <Ionicons name="keypad" size={20} style={styles.icons} color="white" />
                                    <TextInput
                                        style={styles.credentialInputs}
                                        placeholder="Enter Code"
                                        placeholderTextColor={Variables.colors.white}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        maxLength={6}
                                        multiline={false}
                                        selectionColor={Variables.colors.white}
                                        keyboardType='number-pad'
                                        value={otp}
                                        onChangeText={code => {
                                            /^\d+$/.test(code) && code.length == 6 ? setOtpError('') : setOtpError('OTP should be 6 digit number')
                                            setOtp(code)
                                        }}
                                    />
                                    {otpError.length ? <Text style={styles.errorMessage}>{otpError}</Text> : <></>}
                                    <CommonButton
                                        clicked={verifyOtp}
                                        text={'Verify'}
                                        id={'VERIFY_CODE'}
                                        styles={styles.submitButton}
                                        rippleColor={'white'}
                                        textStyle={styles.baseText}
                                        hideRippleEffect={styles.hideRippleEffect}
                                    ></CommonButton>
                                </View> : currentTab == screens.loading ?
                                    <View style={styles.scrollContainer}>
                                        <SuccessAnimation
                                            path={require('../assets/loading.json')}
                                            styles={styles.loading}
                                            autoPlay={true}
                                            loop={true}
                                        ></SuccessAnimation>
                                    </View>
                                    :
                                    <View>
                                    </View>
                    }

                </View >
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    baseText: {
        color: Variables.colors.white,
        fontFamily: Variables.fontStyle
    },
    heading: {
        fontSize: 50,
        textAlign: 'center'
    },
    scrollContainer: {
        flex: 1
    },
    loading: {
        height: 300
    },
    container: {
        flex: 1,
        marginTop: "5%",
        marginHorizontal: "5%",
        justifyContent: 'space-between',
        paddingTop: '25%',
        paddingHorizontal: '10%',
        marginBottom: "10%"
    },
    signInUpBox: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: "20%",
        marginBottom: "10%",
    },
    pressedItem: {
        opacity: 0.5,
        paddingTop: '5%',
    },
    tabSelected: {
        opacity: 1,
        borderBottomWidth: 2,
        borderBottomColor: Variables.colors.white,
        paddingBottom: '5%',
        paddingTop: '5%',
    },
    inputBox: {
        flex: 5,
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
    marginForIconOnLeft: {
        marginLeft: '5%'
    },
    errorMessage: {
        color: Variables.colors.red,
        marginTop: '5%',
        marginLeft: '5%'
    }
})
export default SignInOrSignUpComponent