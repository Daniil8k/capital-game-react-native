export default function getWeather(cityName) {
	return fetch(
		"https://api.weatherapi.com/v1/current.json?key=2f21a9b719db41ad849151311221301&q=" +
			cityName.toLowerCase()
	)
		.then((response) => response.json())
		.then((data) => {
			return data.current.temp_c;
		})
		.catch((error) => {
			console.log(error);
			return "";
		});
}
