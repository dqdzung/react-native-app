import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio";

const PlusOne = () => {
	const animatedValue = useRef(new Animated.Value(-120)).current;
	const [appeared, setAppear] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));
	const [sound, setSound] = useState<Sound>();

	async function playSound() {
		console.log("Loading Sound");
		const { sound } = await Audio.Sound.createAsync(
			require("@/assets/gavel-sfx.wav")
		);
		setSound(sound);

		console.log("Playing Sound");
		await sound.playAsync();
	}

	const moveUp = () => {
		Animated.timing(animatedValue, {
			toValue: -200,
			duration: 300,
			useNativeDriver: false,
		}).start(fadeOut);
	};

	const fadeIn = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	const fadeOut = () => {
		Animated.timing(fadeAnim, {
			delay: 50,
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start(() => setAppear(true));
	};

	useEffect(() => {
		moveUp();
		fadeIn();
	});

	useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	useEffect(() => {
		if (!appeared) playSound();
	}, [appeared]);

	if (appeared) return null;

	return (
		<Animated.View
			style={{
				opacity: appeared ? 0 : fadeAnim,
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
