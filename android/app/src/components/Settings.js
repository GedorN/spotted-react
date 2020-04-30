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
import FlashMessage from "react-native-flash-message";

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
				<GeneralSettings changePassword={this.toggleChangepassword.bind(this)} close={this.props.close} action={this.props.action}/>
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
		backgroundColor: 'white'
	}
});