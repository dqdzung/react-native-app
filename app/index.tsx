import { StyleSheet } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "native-base";
import PlusOne from "@/components/PlusOne";
import GifSection from "@/components/GifSection";
import Gavel from "@/components/Gavel";
import TIMINGS from "@/constants/Timings";
import utils from "@/utils";

const Home = () => {
	const [arr, setArr] = useState<string[]>([]);
	const [_, setTimer] = useState<number>(TIMINGS.TIMER_COUNT);
	const [init, setInit] = useState(false);

	const isArguing = useMemo(() => init && arr.length === 0, [arr, init]);

	const handleFinish = () => setArr((prev) => [...prev, utils.uuid()]);

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
					return TIMINGS.TIMER_COUNT;
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

			<Gavel onFinish={handleFinish} />
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
