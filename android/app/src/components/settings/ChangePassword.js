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
						borderBottomWidth={1}
						autoCapitalize='none'
						placeholder='Senha'
						textContentType='password'
						borderBottomColor={'#b2b5b1'}
					/>
				</View>
				<View>
					<RUMineTextInput
						onChangeText={ text => this.setState({ confirmNewPassword: text }) }
						autoCapitalize='none'
						borderBottomWidth={1}
						placeholder='Confirmar senha'
						textContentType='password'
						borderBottomColor={'#b2b5b1'}
					/>
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Cancelar'color={'white'} height={50} backgroundColor={'black'} borderColor={'black'}  onTap={this.props.changePassword} />
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Salvar'  color={'white'} backgroundColor={'#54c43b'} borderColor = {'#54c43b'}  height={50} onTap={this.props.changePassword} />
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