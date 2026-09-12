import React from 'react';
import {
	View,
	StyleSheet,
	Text
} from 'react-native';

import FatBottomedButton from "./buttons/FatBottomedButton";
import theme from "../components/General/Theme";
import {NavigationActions, StackActions} from "react-navigation";


export default class ThanksForReport extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}

	returnHome = () => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Home' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.thanksText}>
					Agradecemos por contribuir com a comunidade do Spotted. Seu denúncia foi salva e nós iremos avaliá-la com carinho
				</Text>
				<View style={{marginTop: 26}}>
					<FatBottomedButton backgroundColor={ theme.primary } color={ 'white' } text={ 'OK' } onTap={this.returnHome.bind(this)}/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 26
	},
	thanksText: {
		textAlign:'justify',
		fontWeight: 'bold'
	}
})
