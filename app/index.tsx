import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Image, View } from "native-base";
import gavelImg from "@/assets/images/gavel.png";
import PlusOne from "@/components/PlusOne";
import { Sound } from "expo-av/build/Audio";
import { Audio } from "expo-av";
import { Image as ExpoImage } from "expo-image";

const Home = () => {
	const [arr, setArr] = useState<string[]>([]);
	const [_, setTimer] = useState<number>(TIMER_COUNT);
	const [audio, setAudio] = useState<Sound>();
	const [init, setInit] = useState(false);

	const loadSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("@/assets/gavel-sfx.wav")
		);
		setAudio(sound);
	};

	const handleHit = () => {
		audio?.replayAsync();
		setArr((prev) => [...prev, uuid()]);
	};

	useEffect(() => {
		loadSound();
		setTimeout(() => {
			setInit(true);
		}, 3000);
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

			{init && arr.length === 0 && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						position: "absolute",
						width: "100%",
						top: 200,
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

			<Image source={gavelImg} alt="gavel.png" size="xl" />

			<Button
				size="lg"
				borderRadius={10}
				colorScheme="secondary"
				onPress={handleHit}
			>
				ORDER! ORDER!
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
		gap: 40,
	},
	image: {
		aspectRatio: 1.65,
		flex: 1,
	},
});

const IMAGE_TRANSITION = 1000;
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
