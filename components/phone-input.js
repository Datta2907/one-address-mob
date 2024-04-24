import { StyleSheet, Text, TextInput, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import Variables from "../common/constants";
import { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export function PhoneInput({
    parsedDetails,
    errorMessage,
    preferredCountries
}) {
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('IN');

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

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <CountryPicker
                    containerButtonStyle={
                        styles.countryPickerButton
                    }
                    countryCode={countryCode}
                    withCallingCode
                    withCallingCodeButton={false}
                    withFilter
                    withFlag
                    preferredCountries={preferredCountries}
                    onSelect={setCountryCode}
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