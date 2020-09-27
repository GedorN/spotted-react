import React from 'react';
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';

import {TextInputMask} from "react-native-masked-text";
import theme  from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import EyeOfThePassword from "../Inputs/EyeOfThePassword";

export default class SecondStep extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			securePassword: true,
			password: null,
			phone: null,
			showErrorMessage: false,
			showPhoneError: false,
			showErrorPasswordLength: false,
		}
	}

	componentDidMount(): void {
		if (this.props.phone) {
			this.state.phone = this.props.phone;
			this.state.password = this.props.password;
			this.setState({ phone: this.props.phone, password: this.props.password });
		}
	}

	toggleSecureEntry = () => {
		this.setState({ securePassword: !this.state.securePassword });
	}

	validatePhoneAndPassword = () => {
		if (!this.state.phone || !this.state.password) {
			this.setState({showErrorMessage: true});
			return false;
		}
		if (this.state.phone.length < 14) {
			this.setState({ showPhoneError: true, showErrorMessage: false });
			return false;
		}
		if (this.state.password.length < 6) {
			this.setState({showErrorPasswordLength: true, showErrorMessage: false, showPhoneError: false});
			return false;
		}
		return true;
	}

	goToForward = () => {
		if (this.validatePhoneAndPassword()) {
			this.props.foward({...this.state});
		}
	}

	render() {
		return (
			<KeyboardAvoidingView behavior={'padding'} style={styles.container}>
				<View>
					<TouchableOpacity  onPress={() => {this.props.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 7,  paddingLeft: 1, marginBottom: 12, width:theme.width * 0.2, height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, marginTop:4, opacity: 0.9 }}
								source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fchevron-circle-left-solid-white.png?alt=media&token=91ef5798-4bce-4901-8b51-dc3ba395f7c6' }}
							/>
						</View>
					</TouchableOpacity>
					{this.state.showErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha todos os campos </Text>}
					{this.state.showPhoneError && <Text style={{color: 'red'}}> * Insira um telefone celular válido </Text>}
					{this.state.showErrorPasswordLength && <Text style={{color: 'red'}}> * A senha deve ter no mínimo 6 caracteres </Text>}
					<TextInputMask
						style={{borderBottomWidth : 1, borderColor:'#b2b5b1'}}
						type={'cel-phone'}
						options={{
						maskType: 'BRL',
						withDDD: true,
						dddMask: '(99) '
						}}
						placeholder={'Celular'}
						autoFocus={true}
						value={this.state.phone}
						onChangeText={text => {
							this.setState({
								phone: text
							})
						}}
					/>
					<View style={styles.form}>
						<EyeOfThePassword
							onChangeText={ text => this.setState({ password: text }) }
							autoCapitalize='none'
							toggleSecureEntry={this.toggleSecureEntry.bind(this)}
							secureTextEntry={this.state.securePassword}
							placeholder='Password'
							textContentType='password'
							borderBottomColor={'#b2b5b1'}
							value={this.state.password}
						/>
					</View>
				</View>
				<View style={{paddingBottom: 50}}>
					<FatBottomedButton text="Avançar" color={theme.secondary} backgroundColor={theme.primary} onTap={this.goToForward.bind(this)} />
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
	form: {
		marginTop: 25,
	},
})
