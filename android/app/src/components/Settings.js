import React from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';

export default class Settings extends React.Component {
	constructor() {
		super();
		this.state= {};
	}

	render () {
		return (
			<View style={styles.container}>

			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		padding: 5,
	}
});