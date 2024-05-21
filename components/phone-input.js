import { FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Modal, TouchableOpacity } from "react-native";
import Variables from "../common/constants";
import { useEffect, useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import phoneNumberWithCodes from "../common/mobileCodes"

export function PhoneInput({
    parsedDetails,
    errorMessage
}) {
    const [mobile, setMobile] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [countryShortForm, setCountryShortForm] = useState("IN");
    const [countryCode, setCountryCode] = useState('+91');

    useEffect(() => {
        const delayDebounceFnc = setTimeout(() => {
            checkNumberValidity()
        }, 2000);
        return () => clearTimeout(delayDebounceFnc);
    }, [mobile])

    const checkNumberValidity = () => {
        const isValid = isValidPhoneNumber(countryCode + mobile, countryShortForm);
        if (isValid) {
            const phone = parsePhoneNumber(countryCode + mobile, countryShortForm);
            if (phone && phone.isValid()) {
                parsedDetails(phone);
                errorMessage('')
            } else {
                parsedDetails(undefined);
                errorMessage('Invalid Phone Number')
            }
        } else {
            parsedDetails(undefined);
            errorMessage('Invalid Phone Number');
        }
    }

    const handleChangeText = (value) => {
        setMobile(value);
    };

    function displayModal() {
        setModalVisible(true)
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.mobileDialog}>
                    <FlatList
                        data={phoneNumberWithCodes}
                        renderItem={({ item }) =>
                            <TouchableWithoutFeedback
                                onPress={() => { setModalVisible(false); setCountryCode(item.dial_code); setCountryShortForm(item.code) }}>
                                <Text style={styles.codeStyle}>{item.emoji} {item.name} ({item.dial_code})</Text>
                            </TouchableWithoutFeedback>}
                        keyExtractor={item => item.code}
                    />
                </View>
            </Modal>
            <View style={styles.row}>
                <TouchableOpacity onPress={displayModal} style={styles.countryInputHolder}>
                    <TextInput
                        style={styles.countryInput}
                        value={countryCode}
                        pointerEvents="none"
                        editable={false}
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    multiline={true}
                    blurOnSubmit={true}
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    onChangeText={handleChangeText}
                    value={mobile}
                    placeholder="Phone Number"
                    placeholderTextColor={Variables.colors.white}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: '10%'
    },
    row: {
        flexDirection: "row",
    },
    countryInputHolder: {
        width: '20%',
        marginRight: '2%'
    },
    countryInput: {
        opacity: 0.5,
        textAlign: "center",
        textAlignVertical: "center",
        borderBottomWidth: 1,
        borderBottomColor: Variables.colors.white,
        color: Variables.colors.white,
        paddingBottom: '25%'
    },
    errorBorder: {
        borderColor: "#FF0000",
    },
    textInput: {
        opacity: 0.5,
        borderColor: Variables.colors.white,
        borderBottomWidth: 1,
        color: Variables.colors.white,
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingBottom: '5%'
    },
    errorInput: {
        borderColor: "#FF0000",
    },
    errorText: {
        color: "#FF0000",
        fontSize: 14,
        marginTop: 4,
    },
    mobileDialog: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Variables.colors.white,
        margin: '8%',
        paddingVertical: '10%',
    },
    codeStyle: {
        marginVertical: '5%',
        padding: '2%',
        borderBottomColor: Variables.colors.blue,
        borderBottomWidth: 1,
    },
    flag: {
        width: 30,
        height: 30,
        margin: '2%'
    },
});