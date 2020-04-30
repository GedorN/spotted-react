import React from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class SevenBannerArmy extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		return (
			<View style={styles.banner}>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	banner: {
		height: theme.height * 0.1,
		borderWidth: 1,
		borderRadius: 20,
	}
})