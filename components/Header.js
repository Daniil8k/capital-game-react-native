import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Header as HeaderRNE, Icon } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

export default function Header({ allCount, successCount, mistakeCount }) {
	return (
		<View>
			<HeaderRNE
				placement="left"
				rightComponent={
					<View style={styles.headerRight}>
						<View style={styles.score}>
							<Icon style={styles.icon} name="how-to-vote" color="white" />
							<Text style={styles.value}>{allCount}</Text>
						</View>
						<View style={styles.score}>
							<Icon style={styles.icon} name="check-circle" color="#90EE90" />
							<Text style={styles.value}>{successCount}</Text>
						</View>
						<View style={styles.score}>
							<Icon style={styles.icon} name="error" color="red" />
							<Text style={styles.value}>{mistakeCount}</Text>
						</View>
					</View>
				}
				centerComponent={{ text: "Capital quiz", style: styles.heading }}
			/>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	heading: {
		color: "white",
		fontSize: 22,
		fontWeight: "bold",
	},
	headerRight: {
		flexDirection: "row",
		marginTop: 5,
	},
	score: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	icon: {
		marginRight: 10,
	},
	value: {
		color: "white",
		fontSize: 16,
		marginRight: 10,
	},
});
