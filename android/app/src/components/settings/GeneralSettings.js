import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	Image, PermissionsAndroid,
} from 'react-native'

import {
	TextInput,
} from 'react-native-paper'
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import FatBottomedButton from "../buttons/FatBottomedButton";
import theme from "../../../../../components/General/Theme";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";

export default class GeneralSettings extends  React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: heimdallr.user_name,
			email: heimdallr.email,
			userImage: heimdallr.user_image,
			imageCompressed: null,
		};
	}

	componentDidMount = () => {
		// this.setState({ email: heimdallr.user })
	}

	async sendImagePropt() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
				{
					title: 'Spotted Camera Permission',
					message:
						'Spotted needs access to your camera ' +
						'so you can take awesome pictures ;)',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log('You can use the camera');
				const options = {
					title: 'Enviar imagem',
					takePhotoButtonTitle: 'Tirar foto',
					chooseFromLibraryButtonTitle: 'Pegar do celular',
					storageOptions: {
						skipBackup: true,
						path: 'images',
					},
				};

				ImagePicker.showImagePicker(options, response => {
					if (response.didCancel) {
						console.log('User cancelled image picker');
					} else if (response.error) {
						console.log('ImagePicker Error: ', response.error);
					} else if (response.customButton) {
						console.log('User tapped custom button: ', response.customButton);
					} else {
						console.log('Imagem escolhida');
						console.log(response);
						let image = 'file://' + response.path;
						console.log('path: ', image);
						ImageResizer.createResizedImage(response.path, response.width / 5, response.height / 5, 'JPEG', 60).then(
							(resolve) => {
								console.log('resolve: ', resolve);
								this.setState({imageCompressed: resolve.uri});

							},
							(error) => {
								console.log('Image resize error: ', error);
							}).catch((err) => {
							console.log(err);
						})
						this.setState({userImage: image});
						console.log('Imagem: ', this.state.postImages);
					}
				});
			} else {
				console.log('Camera permission denied');
			}
		} catch (err) {
			console.warn(err);
		}
	}

	deleteUser = () => {
		console.warn('clidcado o carai0');
		heimdallr.deleteConectedUser();
		this.props.action('closeHome');
		this.forceUpdate();
	}

	saveEdition = () => {
		if (this.state.userImage !== heimdallr.user_image) {
			console.warn('aqui mesmo');
			heimdallr.uploadImage(this.state.imageCompressed).then(
				(resolve) => {
					const params = {};
					params.name = this.state.userName;
					params.user_image = resolve;
					heimdallr.updateProfile(params).then((res) => {
						if(res) {
							this.refs.message.showMessage({
								message: "Configurações alteradas com sucesso",
								type: "success",
								icon: 'success'
							});
						} else {
							this.refs.message.showMessage({
								message: "Erro ao salvar configurações",
								type: "danger",
								icon: 'danger'
							});
						}
					})
				}
			)
		} else {
			const params = {};
			params.name = this.state.userName;
			heimdallr.updateProfile(params).then((resolve) => {
				if(resolve) {
					this.refs.message.showMessage({
						message: "Configurações alteradas com sucesso",
						type: "success",
						icon: 'success'
					});
				} else {
					this.refs.message.showMessage({
						message: "Erro ao salvar configurações",
						type: "danger",
						icon: 'danger'
					});
				}
			})
		}

	}

	render () {
		return (
			<View>
				<View style={{zIndex: 999}}>
					<TouchableOpacity onPress={this.props.close}>
						<View style={{flexDirection: 'row', height: 20, width: 50}}>
							<Image
								style={{width: 20, height: 20, marginRight: 10}}
								source={require('../../../../../assets/images/arrow-left.png')}
							/>
							<Text>
								voltar
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{flexDirection:'column', marginTop: 10}}>
					<Text>
						Foto de perfil:
					</Text>
					<TouchableOpacity onPress={this.sendImagePropt.bind(this)}>
						<View style={{flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: 20}}>
							<UserImgProfile circular height={120} width={120} uri={this.state.userImage} />
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
				<View style={{position: 'absolute', top: theme.height * 0.8, flex: 1}}>
					<FatBottomedButton text='Excluir conta' color={theme.primary} onTap={this.deleteUser.bind(this)} />
				</View>
				<FlashMessage ref='message' position="top" />
			</View>

		)
	}
}

const styles = StyleSheet.create({

});