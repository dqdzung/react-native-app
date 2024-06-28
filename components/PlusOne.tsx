import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";

const START_POS = -110;
const FINISH_POS = -170;
const DURATION = 300;
const FADE_DELAY = 50;
const SHOW = 1;
const HIDE = 0;

const PlusOne = () => {
	const animatedValue = useRef(new Animated.Value(START_POS)).current;
	const [appeared, setAppear] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));
	const [gavelSound, setGavelSound] = useState<Sound>();

	const playSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("@/assets/gavel-sfx.wav")
		);
		sound?.playAsync();
		setGavelSound(sound);
	};

	const moveUp = () => {
		Animated.timing(animatedValue, {
			toValue: FINISH_POS,
			duration: DURATION,
			useNativeDriver: false,
		}).start(fadeOut);
	};

	const fadeIn = () => {
		Animated.timing(fadeAnim, {
			toValue: SHOW,
			duration: DURATION,
			useNativeDriver: false,
		}).start();
	};

	const fadeOut = () => {
		Animated.timing(fadeAnim, {
			delay: FADE_DELAY,
			toValue: HIDE,
			duration: DURATION,
			useNativeDriver: false,
		}).start(() => setAppear(true));
	};

	useEffect(() => {
		moveUp();
		fadeIn();
		playSound();
	}, []);

	useEffect(() => {
		return gavelSound
			? () => {
					gavelSound.unloadAsync();
			}
			: undefined;
	}, [gavelSound]);

	if (appeared) return null;

	return (
		<Animated.View
			style={{
				opacity: appeared ? HIDE : fadeAnim,
				position: "absolute",
			}}
		>
			<Animated.Text
				style={{
					color: "#00D100",
					fontSize: 35,
					fontWeight: "bold",
					transform: [{ translateY: animatedValue }],
				}}
			>
				+1
			</Animated.Text>
		</Animated.View>
	);
};

export default PlusOne;

const styles = StyleSheet.create({});
