import React from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class LikeAPrayer extends React.Component{
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	render() {
		return (
			<View style={styles.container}>
				<View style={{
					borderWidth: 1,
					height: theme.height * 0.1,
					width: theme.width * 0.4,
					borderTopLeftRadius: 30,
					borderTopRightRadius: 30,
				}}>
				</View>
				<View style={{
					borderWidth: 1,
					borderTopWidth: 0,
					height: theme.height * 0.25,
					width: theme.width * 0.4,
					borderBottomRightRadius: 30,
					borderBottomLeftRadius: 30
				}}>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: theme.width * 0.35,
		height: theme.height * 0.4,
	},
})