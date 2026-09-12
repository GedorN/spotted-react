import React from 'react';
import {
	StyleSheet,
	View,
	Text,
} from 'react-native';

import FatBottomedButton from "../buttons/FatBottomedButton";
import theme from "../../components/General/Theme";
import EyeOfThePassword from "../Inputs/EyeOfThePassword";
import heimdallr from "../../components/Heimdallr/Heimdallr";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import {ProgressBar} from "react-native-paper";


export default class ChangePassword extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			currentPassword: null,
			secureCurrentPassword: true,
			secureNewPassword: true,
			newPassword: null,
			activity: false,
		};
	}


	saveNewPassword = () => {
		if (!this.state.currentPassword || !this.state.newPassword || this.state.activity) {
			return ;
		}
		if (this.state.newPassword.length < 6) {
			showMessage({
				message: "A senha precisa ter ao menos 6 caracteres",
				type: "danger",
				icon: 'danger'
			});
			return ;
		}
		this.setState({ activity: true });
		heimdallr.editPassword(this.state.currentPassword, this.state.newPassword).then(
			() => {
				this.setState({ newPassword: '', currentPassword: '', activity: false });
				this.props.changePassword();
				showMessage({
					message: "Senha alterada com sucesso",
					type: "success",
					icon: 'success'
				});
			},
			() => {
				this.setState({ activity: false });
				showMessage({
					message: "Senha atual incorreta",
					type: "danger",
					icon: 'danger'
				});
			}
		)


	}

	toggleSecureEntryCurrentPassword = () => {
		this.setState({ secureCurrentPassword: !this.state.secureCurrentPassword });
	}

	toggleSecureEntryNewPassword = () => {
		this.setState({ secureNewPassword: !this.state.secureNewPassword });
	}


	render () {
		return (
			<View style={{padding: 0, margin: 0}}>
				<ProgressBar size="large" visible={this.state.activity} indeterminate color={theme.primary}/>
				<View style={styles.container}>
					<View>
						<Text style={{color: theme.primary}}>
							Redefinir senha:
						</Text>
					</View>
					<View style={{marginTop: 10, width: theme.width * 0.8}}>
						<EyeOfThePassword
							secureTextEntry={this.state.secureCurrentPassword}
							onChangeText={ text => this.setState({ currentPassword: text }) }
							toggleSecureEntry={this.toggleSecureEntryCurrentPassword.bind(this)}
							placeholder='Senha atual'
							autoCompleteType='password'
							textContentType='password'
							borderBottomColor={'#b2b5b1'}
						/>
					</View>
					<View style={{width: theme.width * 0.8}}>
						<EyeOfThePassword
							secureTextEntry={this.state.secureNewPassword}
							onChangeText={ text => this.setState({ newPassword: text }) }
							toggleSecureEntry={this.toggleSecureEntryNewPassword.bind(this)}
							placeholder='Nova senha'
							autoCompleteType='password'
							textContentType='password'
							borderBottomColor={'#b2b5b1'}
						/>
					</View>
					<View style={{marginTop: 20}}>
						<FatBottomedButton text='Cancelar'color={'white'} height={50} backgroundColor={'black'} borderColor={'black'}  onTap={this.props.changePassword} />
					</View>
					<View style={{marginTop: 20}}>
						<FatBottomedButton text='Salvar'  color={'white'} backgroundColor={'#54c43b'} borderColor = {'#54c43b'}  height={50} onTap={this.saveNewPassword.bind(this)} />
					</View>
					<FlashMessage ref={'message'} style={{ zIndex: 99 }} />
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
	}
});
