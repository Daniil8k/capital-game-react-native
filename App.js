import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

import Header from "./components/Header";
import getWeather from "./services/getWeather";
import shuffle from "./utils/shuffle";
let countryByCity = require("./assets/country_by_city.json");

export default function App() {
	let [questionIndex, setQuestionIndex] = useState(0);
	let [allCount, setAllCount] = useState(0);
	let [successCount, setSuccessCount] = useState(0);
	let [mistakeCount, setMistakeCount] = useState(0);
	let [answers, setAnswers] = useState([]);
	let [currentCountry, setCurrentCountry] = useState("");

	const shuffleQuestions = () => {
		shuffle(countryByCity);
		nextQuestion();
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

	const colorizeAnswers = (choosenCity, correctCity) => {
		setAnswers(
			answers.map((answer) => {
				if (answer.city === correctCity) {
					return { ...answer, isSuccess: true };
				} else if (answer.city === choosenCity) {
					return { ...answer, isMistake: true };
				}

				return answer;
			})
		);
	};

	const nextQuestion = (choosenCity) => {
		let correctCity = countryByCity[questionIndex].city;

		if (choosenCity === correctCity) {
			setSuccessCount((prev) => ++prev);
		} else {
			setMistakeCount((prev) => ++prev);
		}

		colorizeAnswers(choosenCity, correctCity);
		setQuestionIndex((prev) => ++prev);
		setQuestionIndex((index) => {
			generateQuestion(index)
			return index
		});
	};

	const generateQuestion = async (index = questionIndex) => {
		let newAnswers = [];
		let question = countryByCity[index];
		newAnswers.push(await getAnswer(question.city));

		for (let i = 0; i < 3; i++) {
			newAnswers.push(await getAnswer());
		}

		setAnswers(shuffle(newAnswers));
		setCurrentCountry(question.country);
	};

	// useEffect(generateQuestion, [questionIndex]);

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
				{currentCountry ? (
					<View style={styles.question}>
						<TouchableOpacity onPress={() => shuffleQuestions()}>
							<Icon name="refresh" color="black" />
						</TouchableOpacity>
						<Text style={styles.questionCountry}>
							What`s capital of
							<Text style={styles.country}>{` ${currentCountry} `}</Text>?
						</Text>
					</View>
				) : (
					<Text></Text>
				)}
				<Image
					style={styles.flag}
					source={{
						uri: "https://countryflagsapi.com/png/" + currentCountry,
					}}
				/>
				<View style={styles.btnContainer}>
					{answers.map((answer, index) => {
						let isCold = answer.weather <= 0 ? true : false;
						let prefix = isCold ? "" : "+";

						return (
							<TouchableOpacity
								key={answer.city + index}
								onPress={() => nextQuestion(answer.city)}
								style={[
									styles.btn,
									answer.isSuccess && styles.btnSuccess,
									answer.isMistake && styles.btnMistake,
								]}
							>
								<Text style={styles.btnText}>{answer?.city}</Text>
								<View style={styles.right}>
									<Text
										style={[
											{ ...styles.btnText, ...styles.weather },
											isCold ? { color: "#A3E1D4" } : { color: "#9b2948" },
										]}
									>
										{prefix + answer?.weather}
									</Text>
									<Icon name="location-city" color="black" />
								</View>
							</TouchableOpacity>
						);
					})}
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
		marginTop: 40,
		marginBottom: 40,
	},
	questionCountry: {
		fontSize: 24,
	},
	flag: {
		width: 200,
		height: 140,
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
	btnSuccess: {
		backgroundColor: "#90EE90",
	},
	btnMistake: {
		backgroundColor: "red",
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
