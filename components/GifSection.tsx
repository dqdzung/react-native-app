import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { View } from "native-base";
import { Image as GifImage } from "expo-image";
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";

const GifSection = () => {
	const [gallerySound, setGallerySound] = useState<Sound>();

	const playSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("@/assets/gallery-sfx.wav")
		);
		sound?.setIsLoopingAsync(true);
		sound?.playAsync();
		setGallerySound(sound);
	};

	useEffect(() => {
		playSound();
	}, []);

	useEffect(() => {
		return gallerySound
			? () => {
					gallerySound.unloadAsync();
			}
			: undefined;
	}, [gallerySound]);

	return (
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
	);
};

export default GifSection;

const styles = StyleSheet.create({
	image: {
		aspectRatio: 1.65,
		flex: 1,
	},
	gifContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		width: "100%",
		top: 210,
	},
});

const PW_GIF =
	"https://media.tenor.com/XsuhQTQ2WGUAAAAi/ace-attorney-phoenix-wright.gif";
const ME_GIF =
	"https://media.tenor.com/CvjsQ6ZKg0cAAAAi/pointing-edgeworth.gif";
const IMAGE_TRANSITION = 200;
