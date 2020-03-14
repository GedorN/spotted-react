import React from 'react';
import {
	StyleSheet,
	View,
	Text,
} from 'react-native';

import FatBottomedButton from "../buttons/FatBottomedButton";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import theme from "../../../../../components/General/Theme";


export default class ChangePassword extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			newPassword: null,
			confirmNewPassword: null,
		};
	}


	render () {
		return (
			<View style={styles.container}>
				<View>
					<Text style={{color: theme.primary}}>
						Redefinir senha:
					</Text>
				</View>
				<View style={{marginTop: 10}}>
					<RUMineTextInput
						onChangeText={ text => this.setState({ newPassword: text }) }
						autoCapitalize='none'
						placeholder='Senha'
						textContentType='password'
					/>
				</View>
				<View>
					<RUMineTextInput
						onChangeText={ text => this.setState({ confirmNewPassword: text }) }
						autoCapitalize='none'
						placeholder='Confirmar senha'
						textContentType='password'
					/>
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Cancelar' color={theme.primary} onTap={this.props.changePassword} />
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Salvar' color={theme.primary} onTap={this.props.changePassword} />
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	}
});