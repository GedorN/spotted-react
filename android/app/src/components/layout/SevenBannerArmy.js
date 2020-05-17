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
		width:theme.width*0.98,
		height: theme.height * 0.23,
		borderWidth: 1,
		
	}
})