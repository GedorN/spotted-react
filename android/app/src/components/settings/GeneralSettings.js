import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	Image,
} from 'react-native'

import {
	TextInput,
} from 'react-native-paper'

import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import FatBottomedButton from "../buttons/FatBottomedButton";
import theme from "../../../../../components/General/Theme";

export default class GeneralSettings extends  React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: heimdallr.user_name,
			email: heimdallr.email,
			userImage: heimdallr.user_image,
		};
	}

	componentDidMount = () => {
		// this.setState({ email: heimdallr.user })
	}

	saveEdition = () => {
		console.warn('kk otario');
		const params = {};
		params.name = this.state.userName;
		params.user_image = this.state.userImage;
		heimdallr.updateProfile(params).then(() => {
			console.warn('Dados alterados com sucesso');
		})

	}

	render () {
		return (
			<View>
				<TouchableOpacity onPress={this.props.close}>
					<View style={{flexDirection: 'row'}}>
						<Image
							style={{width: 20, height: 20, marginRight: 10}}
							source={require('../../../../../assets/images/arrow-left.png')}
						/>
						<Text>
							voltar
						</Text>
					</View>
				</TouchableOpacity>
				<View style={{flexDirection:'column', marginTop: 10}}>
					<Text>
						Foto de perfil:
					</Text>
					<TouchableOpacity>
						<View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: 20}}>
							<UserImgProfile circular height={120} width={120} uri={heimdallr.user_image} />
						</View>
					</TouchableOpacity>
				</View>
				<View style={{marginTop: 20}}>
					<TextInput
						label='Nome'
						autoCompleteType={'username'}
						textContentType={'name'}
						value={this.state.userName}
						onChangeText={userName => this.setState({ userName })}
						mode='outlined'
						selectionColor={theme.primary}
						theme={{ colors: { primary: theme.primary, underlineColor:'transparent',}}}
					/>
				</View>
				<View style={{marginTop: 10}}>
					<TextInput
						label='Email (você não pode alterar)'
						autoCompleteType={'username'}
						textContentType={'name'}
						value={this.state.email}
						onChangeText={email => this.setState({ email })}
						mode='outlined'
						selectionColor={theme.primary}
						editable={false}
						theme={{ colors: { primary: theme.primary, underlineColor:'transparent',}}}
					/>
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Alterar senha' color={theme.primary} onTap={this.props.changePassword} />
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Salvar' color={theme.primary} onTap={() => this.saveEdition()} />
				</View>
			</View>

		)
	}
}

const styles = StyleSheet.create({

});