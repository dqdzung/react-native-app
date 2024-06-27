import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Image, View } from "native-base";
import gavelImg from "@/assets/images/AA-gavel.png";
import baseImg from "@/assets/images/AA-base.png";
import PlusOne from "@/components/PlusOne";
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";
import { Image as GifImage } from "expo-image";

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
		}).start(() => {
			setArr((prev) => [...prev, uuid()]);
		});
	};

	const handleHit = () => {
		gavelUp();
		gavelSound?.replayAsync();
		gallerySound?.setIsLoopingAsync(false);
		gallerySound?.stopAsync();
	};

	const isArguing = useMemo(() => init && arr.length === 0, [arr, init]);

	useEffect(() => {
		if (!isArguing) return;
		gallerySound?.replayAsync();
		gallerySound?.setIsLoopingAsync(true);
	}, [isArguing]);

	useEffect(() => {
		Promise.all([loadGavelSound(), loadGallerySound()]).then(() => {
			setTimeout(() => {
				setInit(true);
			}, 2000);
		});

		return () => {
			gavelSound?.unloadAsync();
			gallerySound?.unloadAsync();
			setGavelSound(undefined);
			setGallerySound(undefined);
		};
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

	return (
		<View style={styles.container}>
			{arr.map((uuid) => (
				<PlusOne key={uuid} />
			))}

			{isArguing && (
				<View style={styles.gifContainer}>
					<GifImage
						source={PW_GIF}
						style={styles.image}
						transition={IMAGE_TRANSITION}
					/>
					<GifImage
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
					<Image source={gavelImg} alt="gavel" style={styles.gavel} />
				</Animated.View>
				<Image source={baseImg} alt="base" style={styles.gavelBase} />
			</View>
			<Button
				size="md"
				colorScheme="secondary"
				onPress={handleHit}
				style={styles.button}
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
	gifContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		width: "100%",
		top: 210,
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
