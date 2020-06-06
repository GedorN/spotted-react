import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	Button,
	Dimensions,
	Image,
	Text,
} from 'react-native';

const width = Dimensions.get('screen').width;
import theme from "../../../../components/General/Theme";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import RUMineTextInput from "./Inputs/RUMineTextInput";
import FatBottomedButton from "./buttons/FatBottomedButton";

export default class PasswordRestore extends React.Component{
	constructor (props) {
		super(props);
		this.state = {
			user: null,
			emailSent: false,
		};
	}

	recover = () => {
		if (!this.state.user) {
			return ;
		}
		const params = {};
		params.email = this.state.user;
		let recovery = heimdallr.PasswordRestore(params);
		this.setState( {emailSent: true} );
		recovery.then((resolve) => {
			console.log('resolve: ', resolve);
		});
	}

	cancel = () => {
		this.props.navigation.goBack();
	}


	render() {
		return (
			<View style={styles.container}>
				{/*<Image*/}
				{/*	style={{width: 210, height: 258, padding: 0,  zIndex: -1}}*/}
				{/*	source={require('../../../../assets/images/simbol.png')}*/}
				{/*/>*/}
				<Image
					style={{width: theme.width, height: theme.height, padding: 0, position: 'absolute', zIndex: -1, opacity: 0.2}}
					source={require('../../../../assets/images/simbol.png')}
				/>
				{ !this.state.emailSent &&
					<View>
						<Text style={{fontWeight: 'bold', marginTop: 30, fontSize: 16}}>
							Esqueceu sua senha?
						</Text>
						<Text style={{fontWeight: 'bold', marginBottom: 30, fontSize: 16}}>
							Não tem problema. Diga-nos o seu email para que a nossa equipe possa te ajudar
						</Text>
						<View style={styles.form}>
							<RUMineTextInput
								autoCapitalize='none'
								placeholder='E-mail...'
								autoCompleteType='email'
								borderBottomWidth={1}
								keyboardType='email-address'
								textContentType='emailAddress'
								onChangeText={text => this.setState({ user: text })}
							/>
							<View style={{marginTop: 120}}>
								<FatBottomedButton color={theme.primary} text={'Recuperar'} color={'white'} backgroundColor={theme.primary} onTap={this.recover.bind(this)}/>
							</View>
							<View style={{marginTop: 20}}>
								<FatBottomedButton color={theme.primary} text={'Cancelar'} onTap={this.cancel.bind(this)}/>
							</View>
						</View>
					</View>
				}
				{ this.state.emailSent &&
					<View>
						<View style={styles.form}>
							<Text style={{fontWeight: 'bold', marginBottom: 30, fontSize: 16}}>
								Tudo certo!!! Em breve você receberá um email da nossa equipe
							</Text>
							<View style={{marginTop: 20}}>
								<FatBottomedButton color={theme.primary} text={'Voltar'} onTap={this.cancel.bind(this)}/>
							</View>
						</View>
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30
	},
	form: {
		width: width * 0.8,
	},
});
