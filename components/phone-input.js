import { StyleSheet, Text, TextInput, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import Variables from "../common/constants";

export function PhoneInput({
    countryCode,
    phone,
    onChangeCountry,
    onChangePhone,
    preferredCountries
}) {
    const handleChangeCountry = (country) => {
        onChangeCountry(country);
    };

    const handleChangeText = (value) => {
        onChangePhone(value);
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
                    onSelect={handleChangeCountry}
                />
                <TextInput
                    style={styles.textInput}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    onChangeText={handleChangeText}
                    value={phone}
                    placeholder="Mobile"
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
        fontSize: 20,
        borderBottomWidth: 1,
        padding: '2%',
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