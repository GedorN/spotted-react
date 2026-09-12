import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
} from 'react-native';

import GeneralSettings from "./settings/GeneralSettings";
import ChangePassword from "./settings/ChangePassword";

const height = Dimensions.get('screen').height;

export default class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			userName: null,
			email: null,
			changePassword: false,
		};
	}

	toggleChangepassword = () => {
		this.setState({ changePassword: !this.state.changePassword });
	}

	getSettingsScreen = () => {
		if (this.state.changePassword) {
			return (
				<ChangePassword changePassword={this.toggleChangepassword.bind(this)}/>
			)
		} else {
			return (
				<GeneralSettings changePassword={this.toggleChangepassword.bind(this)} navigation={this.props.navigation} action={this.props.action}/>
			)
		}
	}

	render () {
		return (
			<View style={styles.container}>
				{this.getSettingsScreen()}
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		padding: 20,
		height: height,
		backgroundColor: 'white'
	}
});
