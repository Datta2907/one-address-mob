import { Button, FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Modal } from "react-native";
import Variables from "../common/constants";
import { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export function PhoneInput({
    parsedDetails,
    errorMessage
}) {
    const codesWithNames = [{ countryCode: "+91", country: "India", countryShortName: "IN" }, { countryCode: "+1", country: "Usa", countryShortName: "US" }]
    const [mobile, setMobile] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [countryShortForm, setCountryShortForm] = useState("IN");
    const [countryCode, setCountryCode] = useState('+91');

    const handleChangeText = (value) => {
        setMobile(value);
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
                        data={codesWithNames}
                        renderItem={({ item }) => <TouchableWithoutFeedback onPress={() => { setModalVisible(false); setCountryCode(item.countryCode); setCountryShortForm(item.countryShortName) }}><Text style={styles.codeStyle}>{item.countryCode} - {item.country}</Text></TouchableWithoutFeedback>}
                        keyExtractor={item => item.countryCode}
                    />
                </View>
            </Modal>
            <View style={styles.row}>
                <Button
                    style={
                        styles.countryPickerButton
                    }
                    title={countryCode}
                    onPress={displayModal}
                />
                <TextInput
                    style={styles.textInput}
                    keyboardType="phone-pad"
                    autoCorrect={false}
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
        alignItems: "stretch",
    },
    countryPickerButton: {
        alignItems: "center",
        borderBottomWidth: 1,
        marginRight: 5,
        borderBottomColor: Variables.colors.white,
        paddingVertical: '15%',
        paddingHorizontal: '2%',
        backgroundColor: Variables.colors.blue,
        width: '10%'
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
        textAlignVertical: 'center'
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
    }
});