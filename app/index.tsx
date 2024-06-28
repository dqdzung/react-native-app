import { Animated, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, View } from "native-base";
import PlusOne from "@/components/PlusOne";
import GifSection from "@/components/GifSection";
import Gavel from "@/components/Gavel";

const Home = () => {
	const [arr, setArr] = useState<string[]>([]);
	const [_, setTimer] = useState<number>(TIMER_COUNT);
	const [init, setInit] = useState(false);

	const isArguing = useMemo(() => init && arr.length === 0, [arr, init]);

	useEffect(() => {
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

	return (
		<View style={styles.container}>
			{arr.map((uuid) => (
				<PlusOne key={uuid} />
			))}

			{isArguing && <GifSection />}

			<Gavel onFinish={() => setArr((prev) => [...prev, uuid()])} />
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
});

const TIMER_COUNT = 2;

const uuid = () => {
	return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
