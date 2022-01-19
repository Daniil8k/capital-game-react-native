import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

import Header from "./components/Header";
import getWeather from "./api/weather";
let countryByCity = require("./assets/country_by_city.json");

export default function App() {
	let [questionIndex, setQuestionIndex] = useState(0);
	let [allCount, setAllCount] = useState(0);
	let [successCount, setSuccessCount] = useState(0);
	let [mistakeCount, setMistakeCount] = useState(0);
	let [answers, setAnswers] = useState([]);
	let [loading, setLoading] = useState(false);

	let shuffle = (array) => {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	};

	const getRandomCity = () => {
		let index = Math.floor(Math.random() * (countryByCity.length - 1));
		return countryByCity[index]?.city;
	};

	const getAnswer = async (city = getRandomCity()) => {
		let weather = await getWeather(city);

		return {
			city,
			weather,
		};
	};

	const nextQuestion = (city) => {
		let rightCity = countryByCity[questionIndex].city;

		if (city === rightCity) {
			setSuccessCount((prev) => ++prev);
		} else {
			setMistakeCount((prev) => ++prev);
		}
		
		setQuestionIndex((prev) => ++prev);
	};

	const generateQuestion = async () => {
		setLoading(true)
		let newAnswers = [];
		let city = countryByCity[questionIndex].city;
		newAnswers.push(await getAnswer(city));

		for (let i = 0; i < 3; i++) {
			newAnswers.push(await getAnswer());
		}

		setAnswers(shuffle(newAnswers));
		setLoading(false)
	};

	useEffect(() => generateQuestion(), [questionIndex]);

	useEffect(() => {
		setAllCount(countryByCity.length);
		generateQuestion();
	}, []);

	return (
		<View style={styles.container}>
			<Header
				allCount={allCount}
				successCount={successCount}
				mistakeCount={mistakeCount}
			/>
			<View style={styles.content}>
				<Text style={styles.question}>
					What`s capital of
					<Text style={styles.country}>
						{` ${countryByCity[questionIndex].country} `}
					</Text>
					?
				</Text>
				<Image
					style={styles.flag}
					source={{
						uri:
							"https://countryflagsapi.com/png/" +
							(countryByCity[questionIndex]
								? countryByCity[questionIndex].country
								: ""),
					}}
				/>
				<View style={styles.btnContainer}>
					{!loading ? answers.map((answer, index) => {
						let isCold = answer.weather <= 0 ? true : false;
						let prefix = isCold ? "-" : "+";

						return (
							<TouchableOpacity
								key={answer.city + index}
								onPress={() => nextQuestion(answer.city)}
								style={styles.btn}
							>
								<Text style={styles.btnText}>{answer?.city}</Text>
								<View style={styles.right}>
									<Text style={[{ ...styles.btnText, ...styles.weather }, isCold ? {'color': '#A3E1D4'} : {'color': '#9b2948'}]}>
										{prefix + answer?.weather}
									</Text>
									<Icon name="location-city" color="black" />
								</View>
							</TouchableOpacity>
						);
					}) : <Icon name="hourglass-bottom" color="black" />}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
	},
	content: {
		alignItems: "center",
		justifyContent: "center",
	},
	country: {
		color: "green",
	},
	question: {
		marginTop: 80,
		marginBottom: 40,
		fontSize: 24,
	},
	flag: {
		width: 200,
		height: 120,
		marginBottom: 20,
	},
	btnContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	btn: {
		width: "100%",
		height: 50,
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: "yellow",
		marginBottom: 15,
		elevation: 2,
	},
	btnText: {
		color: "black",
		fontSize: 20,
	},
	right: {
		flexDirection: "row",
	},
	weather: {
		marginRight: 5,
	},
});
