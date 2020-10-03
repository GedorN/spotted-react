import React from 'react';
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Text,
	Image,
	TouchableOpacity
} from 'react-native';
import theme from "../../../../../components/General/Theme";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import FatBottomedButton from "../buttons/FatBottomedButton";

export default class ThirdStep extends React.Component {
	constructor() {
		super();
		this.state = {
			codeInput: null,
			countdownToReset: 30,
			creatingAccount: false,
			confirmationFunction: true,
		}
	}

	confirmCode = () => {
		if (!this.state.codeInput || this.state.codeInput === '') {
			return ;
		}
		this.props.foward({...this.state});
	}


	render() {
		return (
			<KeyboardAvoidingView behavior={'height'} style={styles.container}>
				<View>
					<TouchableOpacity  onPress={() => {this.props.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 7,  paddingLeft: 1, marginBottom: 12, width:theme.width * 0.2, height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, marginTop:4, opacity: 0.9 }}
								source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fchevron-circle-left-solid-white.png?alt=media&token=91ef5798-4bce-4901-8b51-dc3ba395f7c6' }}
							/>
						</View>
					</TouchableOpacity>
					{
						!this.props.inputedWrongCode &&
						<View>
							<Text>Enviamos um código de verificação para o seu telefone.</Text>
							<Text>Insira ele no campo abaixo:</Text>
						</View>
					}
					{
						this.props.inputedWrongCode &&
						<View >
							<Text style={{color: 'red'}}>Código inserido incorreto</Text>
							<Text style={{color: 'red'}}>Tente novamente:</Text>
						</View>
					}
					<RUMineTextInput
						onChangeText={ text => this.setState({ codeInput: text }) }
						autoCapitalize='none'
						placeholder='Código'
						keyboardType='numeric'
						autoFocus={true}
						textContentType='oneTimeCode'
						borderBottomWidth={1}
					/>
					<View style={{flex: 1, padding: 5, flexDirection: 'column'}}>
						<Text style={{padding: 5}}> Tempo para reenviar código: { this.props.countdown }s </Text>
					</View>
				</View>
				<View style={{paddingBottom: 20}}>
						<FatBottomedButton text='Confirmar' backgroundColor={theme.primary} color={theme.secondary} onTap={this.confirmCode.bind(this)} />
				</View>
			</KeyboardAvoidingView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding:20,
		justifyContent:'space-between',
		flexDirection: 'column',
		height: theme.height * 0.95
	},
})
