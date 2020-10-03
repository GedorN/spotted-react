import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	KeyboardAvoidingView
} from 'react-native';

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

	componentDidMount(): void {
		const email = this.props.navigation.getParam('email');
		if (email) {
			this.state.user = email;
			this.setState({ user: email });
		}
	}

	recover = () => {
		if (!this.state.user) {
			return ;
		}
		const params = {};
		params.email = this.state.user;
		heimdallr.PasswordRestore(params);
		this.setState( {emailSent: true} );
	}

	cancel = () => {
		this.props.navigation.goBack();
	}


	render() {
		return (
			<KeyboardAvoidingView behavior={'height'} style={styles.container}>
				<Image
					style={{width: theme.width, height: theme.height, padding: 0, position: 'absolute', zIndex: -1, opacity: 0.1}}
					source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fsimbol.png?alt=media&token=59f607da-634a-4eae-b6fe-c3ef845c1a67' }}
				/>
				{
					!this.state.emailSent &&
					<View style = {{ borderRadius: 25, padding: 20, backgroundColor: 'white', elevation: 4, paddingBottom: 50, alignItems: 'center', alignSelf: 'center' }}>
						<Text style={{fontWeight: 'bold', marginTop: 20, fontSize: 16, lineHeight: 25, alignSelf: 'flex-start'}}>
							Esqueceu sua senha?
						</Text>
						<Text style={{fontWeight: 'bold', marginBottom: 30, fontSize: 16, lineHeight: 25, alignSelf: 'flex-start' }}>
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
								borderBottomColor={'#b2b5b1'}
								value={this.state.user}
								autoFocus={true}
								onChangeText={text => this.setState({ user: text })}
							/>
							<View style={{marginTop: 50}}>
								<FatBottomedButton color={theme.primary} text={'Recuperar'} height={50} color={'white'} backgroundColor={theme.primary} onTap={this.recover.bind(this)}/>
							</View>
							<View style={{marginTop: 15}}>
								<FatBottomedButton color={theme.primary} text={'Cancelar'} height={50} onTap={this.cancel.bind(this)}/>
							</View>
						</View>
					</View>
				}
				{
					this.state.emailSent &&
					<View>
						<View style={styles.form}>
							<Text style={{fontWeight: 'bold', marginBottom: 30, fontSize: 16}}>
								Tudo certo!!! Em breve você receberá um email da nossa equipe
							</Text>
							<View style={{marginTop: 20}}>
								<FatBottomedButton color={theme.primary} text={'Voltar'} height={50} onTap={this.cancel.bind(this)}/>
							</View>
						</View>
					</View>
				}
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 30,
		flexDirection: 'column',
		alignItems:'center',
		justifyContent:'center'
	},
	form: {
		width: theme.width * 0.8,
	},
});
