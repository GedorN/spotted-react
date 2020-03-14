import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	Image,
} from 'react-native';

import {
	TextInput,
} from 'react-native-paper'

import UserImgProfile from "../../../../components/General/UserImgProfile";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import RUMineTextInput from "./Inputs/RUMineTextInput";
import FatBottomedButton from "./buttons/FatBottomedButton";
import theme from "../../../../components/General/Theme";
import GeneralSettings from "./settings/GeneralSettings";
import ChangePassword from "./settings/ChangePassword";
const height = Dimensions.get('screen').height;

export default class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			userName: null,
			email: 'heuhue',
			changePassword: false,
		};
	}

	toggleChangepassword = () => {
		this.setState({ changePassword: !this.state.changePassword });
	}

	getSettingsScreen = () => {
		console.warn('na funcção');
		if (this.state.changePassword) {
			return (
				<ChangePassword changePassword={this.toggleChangepassword.bind(this)}/>
			)
		} else {
			console.warn('recebe ai');
			return (
				<GeneralSettings changePassword={this.toggleChangepassword.bind(this)} close={this.props.close}/>
			)
		}
	}

	saveEdition = () => {

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
	}
});