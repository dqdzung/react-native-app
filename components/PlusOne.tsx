import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

const START_POS = -120;
const FINISH_POS = -200;
const DURATION = 300;
const FADE_DELAY = 50;
const SHOW = 1;
const HIDE = 0;

const PlusOne = () => {
	const animatedValue = useRef(new Animated.Value(START_POS)).current;
	const [appeared, setAppear] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));

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
	});

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
