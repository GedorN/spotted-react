import React from 'react';
import {
	View,
	StyleSheet,
	Text
} from 'react-native';
import theme from "../../../../../components/General/Theme";
import AnimatedLoader from "react-native-animated-loader";


export default class Loading extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: true
		}
	}

	render() {
		return (
			<View>
				<AnimatedLoader
					visible={this.state.visible}
					source={require("../../../../../assets/lf30_editor_q8ipcq3s")}
					animationStyle={styles.lottie}
					speed={1}
					loop={true}
					autoPlay={true}
				/>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	lottie: {
		width: 100,
		height: 100
	}
})


