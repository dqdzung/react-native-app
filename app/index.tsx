import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Image, View } from "native-base";
import gavelImg from "@/assets/images/gavel.png";
import PlusOne from "@/components/PlusOne";

const Home = () => {
	const [arr, setArr] = useState<string[]>([]);
	const [timerCount, setTimer] = useState<number>(2);

	useEffect(() => {
		if (!arr.length) return;
		let interval = setInterval(() => {
			setTimer((prev) => {
				if (prev === 0) {
					setArr([]);
					return 2;
				} else {
					return prev - 1;
				}
			});
		}, 1000); //each count lasts for a second
		//cleanup the interval on complete
		return () => clearInterval(interval);
	}, [arr]);

	return (
		<View style={styles.container}>
			{arr.map((uuid) => (
				<PlusOne key={uuid} />
			))}

			<Image source={gavelImg} alt="gavel.png" size="xl" />

			<Button
				size={"lg"}
				borderRadius={10}
				colorScheme="secondary"
				onPress={() => {
					setArr((prev) => [...prev, uuid()]);
					// setTimer(5);
				}}
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
});

const uuid = () => {
	return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
