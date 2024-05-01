import { Button, FlatList, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Variables from "../common/constants";
import { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export function PhoneInput({
    parsedDetails,
    errorMessage
}) {
    const codesWithNames = [{ countryCode: "+91", country: "India" }, { countryCode: "+1", country: "Usa" }]
    const [mobile, setMobile] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [countryCode, setCountryCode] = useState('+91');

    const handleChangeText = (value) => {
        setMobile(value);
        const isValid = isValidPhoneNumber(value, countryCode);
        if (isValid) {
            const phone = parsePhoneNumber(value, countryCode);
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
                <FlatList
                    data={codesWithNames}
                    renderItem={({ item }) => <TouchableWithoutFeedback onPress={() => { setModalVisible(false); setCountryCode(item.countryCode) }}><Text>{item.countryCode} - {item.country}</Text></TouchableWithoutFeedback>}
                    keyExtractor={item => item.countryCode}
                />
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
});