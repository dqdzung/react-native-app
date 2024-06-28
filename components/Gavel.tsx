import { Animated, StyleSheet } from "react-native";
import React, { useRef } from "react";
import gavelImg from "@/assets/images/AA-gavel.png";
import baseImg from "@/assets/images/AA-base.png";
import { Button, Image, View } from "native-base";

const Gavel = ({ onFinish }: { onFinish: () => void }) => {
	const animatedValue = useRef(new Animated.Value(-15)).current;

	const gavelUp = () => {
		Animated.timing(animatedValue, {
			toValue: -80,
			duration: 70,
			useNativeDriver: false,
		}).start(gavelDown);
	};

	const gavelDown = () => {
		Animated.timing(animatedValue, {
			toValue: -15,
			duration: 10,
			useNativeDriver: false,
		}).start(onFinish);
	};

	return (
		<>
			<View style={{ alignItems: "center" }}>
				<Animated.View
					style={{
						position: "relative",
						zIndex: 3,
						transform: [{ translateY: animatedValue }],
					}}
				>
					<Image source={gavelImg} alt="gavel" style={styles.gavel} />
				</Animated.View>
				<Image source={baseImg} alt="base" style={styles.gavelBase} />
			</View>

			<Button
				size="md"
				colorScheme="secondary"
				onPress={gavelUp}
				style={styles.button}
			>
				ORDER!
			</Button>
		</>
	);
};

export default Gavel;

const styles = StyleSheet.create({
	button: {
		width: 120,
		borderRadius: 0,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	gavel: {
		position: "absolute",
		left: -34,
		height: 120,
		width: 100,
	},
	gavelBase: {
		height: 110,
		width: 200,
		zIndex: 2,
	},
});
