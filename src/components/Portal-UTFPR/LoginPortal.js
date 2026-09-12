import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image, TouchableOpacity, StatusBar
} from 'react-native';
import RUMineTextInput from "../Inputs/RUMineTextInput";
import EyeOfThePassword from "../Inputs/EyeOfThePassword";
import FatBottomedButton from "../buttons/FatBottomedButton";
import theme from "../../components/General/Theme";
import heimdallr from "../../components/Heimdallr/Heimdallr";
import {ProgressBar} from "react-native-paper";


export default class LoginPortal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ra: null,
			password: null,
			securePassword: true,
			errorMessage: false,
			loading: false,
		}
	}

	componentDidMount(): void {
		StatusBar.setBackgroundColor('#FFFFFF');
		StatusBar.setBarStyle('dark-content');
		let hasError = this.props.navigation.getParam('error');
		this.state.errorMessage = hasError;
		this.setState({});

	}

	toggleSecureEntry = () => {
		this.setState({ securePassword: !this.state.securePassword });
	}

	doLogin = () => {
		if (!this.state.ra || !this.state.password) {
			return;
		}
		this.setState({ loading: true });
		heimdallr.loginPortal({ username: this.state.ra, password: this.state.password }).then(
			() => {
				this.setState({ loading: false });
				heimdallr.sendEvent('portal_UTFPR_login_done');
				this.props.navigation.replace('PortalUTFPR');
			},
			() => {
				this.setState({ errorMessage: "*Login ou senha incorretos. Tente novamente", loading: false });
			}
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{width: theme.width, position: 'absolute', top: 0}}>
					<ProgressBar size="large" visible={this.state.loading} indeterminate color={'#F6C500'} />
				</View>
				<View style = {{alignSelf:'flex-start', position: 'absolute'}}>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 2,  paddingLeft: 15, width:theme.width * 0.2,height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, marginTop:4, opacity: 0.6}}
								source={require('../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View >
					<Image style={styles.UTFPRLogo}  source={{uri: `http://portal.utfpr.edu.br/icones/cabecalho/logo-utfpr/@@images/image.png`}} />
				</View>
				<View style={{marginTop: 30}}>
					<Text>Faça login para sincronizar as suas informações</Text>
					{
						this.state.errorMessage &&
						<Text style={{color: 'red', marginTop: 5}} >{this.state.errorMessage}</Text>
					}
				</View>
				<View style={styles.form}>
					<RUMineTextInput
						placeholder='Registro Acadêmico'
						keyboardType='number-pad'
						autoFocus={true}
						textContentType='none'
						borderBottomWidth={1}
						onChangeText={text => this.setState({ra: text})}
					/>
					<EyeOfThePassword
						secureTextEntry={this.state.securePassword}
						toggleSecureEntry={this.toggleSecureEntry.bind(this)}
						placeholder='Senha'
						autoCompleteType='password'
						textContentType='password'
						onChangeText={text => this.setState({password: text})}
					/>
					<View style={{marginTop: 40}}>
						<FatBottomedButton color={'black'} borderColor={'#F6C500'} backgroundColor={'#F6C500'} text={'Entrar'}  height={50} onTap={this.doLogin.bind(this)} />
					</View>
				</View>
			</View>
		)
	}
}



const styles= StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
		padding: 20,
		paddingTop:theme.height * 0.05
	},
	form: {
		width: theme.width * 0.9,
		marginTop: 20,
	},
	UTFPRLogo: {
		width: theme.width * 0.8,
		height: theme.height * 0.15,
	}
})
