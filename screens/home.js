import { useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { getApplicationStatus } from "../services/home"
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import Variables from "../common/constants";

export const HomeComponent = () => {
    useEffect(() => {
        async function getStatus() {
            await getApplicationStatus();
        }
        getStatus();
    }, [])

    return (
        <ProgressBar
            percent={75}
            filledBackground={Variables.colors.green}>
            <Step transition="scale">
                {({ accomplished }) => (
                    <img
                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                        width="30"
                        src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851"
                    />
                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <img
                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                        width="30"
                        src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/97/Pikachu_%28Smiling%29.png/revision/latest?cb=20170410234508"
                    />
                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <img
                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                        width="30"
                        src="https://orig00.deviantart.net/493a/f/2017/095/5/4/raichu_icon_by_pokemonshuffle_icons-db4ryym.png"
                    />
                )}
            </Step>
        </ProgressBar>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})