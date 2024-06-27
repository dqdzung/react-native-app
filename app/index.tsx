import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Image, View } from "native-base";
import gavelImg from "@/assets/images/AA-gavel.png";
import baseImg from "@/assets/images/AA-base.png";
import PlusOne from "@/components/PlusOne";
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";
import { Image as ExpoImage } from "expo-image";

const Home = () => {
	const [arr, setArr] = useState<string[]>([]);
	const [_, setTimer] = useState<number>(TIMER_COUNT);
	const [gavelSound, setGavelSound] = useState<Sound>();
	const [gallerySound, setGallerySound] = useState<Sound>();
	const [init, setInit] = useState(false);
	const animatedValue = useRef(new Animated.Value(-15)).current;

	const loadGavelSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("@/assets/gavel-sfx.wav")
		);
		setGavelSound(sound);
	};

	const loadGallerySound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("@/assets/gallery-sfx.wav")
		);
		setGallerySound(sound);
	};

	const moveUp = () => {
		Animated.timing(animatedValue, {
			toValue: -80,
			duration: 70,
			useNativeDriver: false,
		}).start(moveDown);
	};

	const moveDown = () => {
		Animated.timing(animatedValue, {
			toValue: -15,
			duration: 10,
			useNativeDriver: false,
		}).start(() => {
			setArr((prev) => [...prev, uuid()]);
		});
	};

	const handleHit = () => {
		moveUp();
		gavelSound?.replayAsync();
		gallerySound?.setIsLoopingAsync(false);
		gallerySound?.stopAsync();
	};

	const isArguing = useMemo(() => init && arr.length === 0, [arr, init]);

	useEffect(() => {
		if (!isArguing) return;
		gallerySound?.playAsync();
		gallerySound?.setIsLoopingAsync(true);
	}, [isArguing]);

	useEffect(() => {
		loadGavelSound();
		loadGallerySound();
		setTimeout(() => {
			setInit(true);
		}, 2000);
	}, []);

	useEffect(() => {
		if (!arr.length) return;
		const interval = setInterval(() => {
			setTimer((prev) => {
				if (prev === 0) {
					setArr([]);
					return TIMER_COUNT;
				} else {
					return prev - 1;
				}
			});
		}, 1000); //each count lasts for a second
		return () => clearInterval(interval); //cleanup the interval on complete
	}, [arr]);

	useEffect(() => {
		return gavelSound
			? () => {
					gavelSound.unloadAsync();
					setGavelSound(undefined);
			  }
			: undefined;
	}, [gavelSound]);

	return (
		<View style={styles.container}>
			{arr.map((uuid) => (
				<PlusOne key={uuid} />
			))}

			{isArguing && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						position: "absolute",
						width: "100%",
						top: 210,
					}}
				>
					<ExpoImage
						source={PW_GIF}
						style={styles.image}
						transition={IMAGE_TRANSITION}
					/>
					<ExpoImage
						source={ME_GIF}
						style={styles.image}
						transition={IMAGE_TRANSITION}
					/>
				</View>
			)}

			<View style={{ alignItems: "center" }}>
				<Animated.View
					style={{
						position: "relative",
						zIndex: 3,
						transform: [{ translateY: animatedValue }],
					}}
				>
					<Image
						source={gavelImg}
						alt="gavel"
						style={{
							position: "absolute",
							left: -36,
							height: 120,
							width: 100,
						}}
					/>
				</Animated.View>
				<Image
					source={baseImg}
					alt="base"
					style={{
						height: 110,
						width: 200,
						zIndex: 2,
					}}
				/>
			</View>
			<Button
				size="md"
				colorScheme="secondary"
				onPress={handleHit}
				style={{
					width: 120,
					borderRadius: 0,
					borderBottomLeftRadius: 20,
					borderBottomRightRadius: 20,
				}}
			>
				ORDER!
			</Button>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		aspectRatio: 1.65,
		flex: 1,
	},
});

const IMAGE_TRANSITION = 200;
const TIMER_COUNT = 2;
const PW_GIF =
	"https://media.tenor.com/XsuhQTQ2WGUAAAAi/ace-attorney-phoenix-wright.gif";
const ME_GIF =
	"https://media.tenor.com/CvjsQ6ZKg0cAAAAi/pointing-edgeworth.gif";

const uuid = () => {
	return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
