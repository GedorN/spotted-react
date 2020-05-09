import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
	Modal,
} from 'react-native'

import {
	ActivityIndicator,
	TextInput,
} from 'react-native-paper'

import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import FatBottomedButton from "../buttons/FatBottomedButton";
import theme from "../../../../../components/General/Theme";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import AwesomeAlert from "react-native-awesome-alerts";
import EyeOfThePassword from "../Inputs/EyeOfThePassword";
import { StackActions, NavigationActions } from 'react-navigation';


export default class GeneralSettings extends  React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: heimdallr.user_name,
			email: heimdallr.email,
			userImage: heimdallr.user_image,
			imageCompressed: null,
			showAlert: false,
			securePassword: true,
			showConfirmCodeModal: false,
			user: null,
			password: null,
			showLoadingModal: false,
		};
	}

	componentDidMount = () => {
		// this.setState({ email: heimdallr.user })
	}

	toggleSecureEntry = () => {
		this.setState({ securePassword: !this.state.securePassword });
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
						let propCo =  900000 / response.fileSize;
						let quality = propCo > 1 ? 100 : 100 * propCo;
						let constant = propCo > 1 ? 0.8 : 1;
						ImageResizer.createResizedImage(response.path, response.width / 5, response.height / constant, 'JPEG', quality).then(
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
		if (!this.state.password) {
			return ;
		}
		heimdallr.deleteUser(heimdallr.email, this.state.password).then(
			(resolve) => {
				this.setState({ showConfirmCodeModal: false});
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Home' })],
				});
				this.props.navigation.dispatch(resetAction);
			},
			(reject) => {
				this.setState({ showConfirmCodeModal: false});
				console.warn('rejetiado');
				this.refs.message.showMessage({
					message: "Usuário ou senha incorreto. Tente novamente",
					type: "danger",
					icon: 'danger',
				});
			}
		);
	}

	saveEdition = () => {
		this.setState({ showLoadingModal: true });
		if (this.state.userImage !== heimdallr.user_image) {
			console.warn('aqui mesmo');
			heimdallr.uploadImage(this.state.imageCompressed).then(
				(resolve) => {
					const params = {};
					params.name = this.state.userName;
					params.user_image = resolve;
					params.uid = heimdallr.user_id;
					heimdallr.updateProfile(params).then((res) => {
						heimdallr.updateUserData(params);
						if(res) {
							showMessage({
								message: "Configurações alteradas com sucesso",
								type: "success",
								icon: 'success'
							});
							this.setState({ showLoadingModal: false });
							const resetAction = StackActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: 'Home' })],
							});
							this.props.navigation.dispatch(resetAction);
						} else {
							this.refs.message.showMessage({
								message: "Erro ao salvar configurações",
								type: "danger",
								icon: 'danger',
								style: {backgroundColor: 'black'}
							});
							this.setState({ showLoadingModal: false });
						}
					})
				}
			)
		} else {
			const params = {};
			params.name = this.state.userName;
			params.uid = heimdallr.user_id;
			heimdallr.updateProfile(params).then((resolve) => {
				heimdallr.updateUserData(params);
				if(resolve) {
					showMessage({
						message: "Configurações alteradas com sucesso",
						type: "success",
						icon: 'success'
					});
					this.setState({ showLoadingModal: false });
					const resetAction = StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: 'Home' })],
					});
					this.props.navigation.dispatch(resetAction);
				} else {
					showMessage({
						message: "Erro ao salvar configurações",
						type: "danger",
						icon: 'danger',

					});
					this.setState({ showLoadingModal: false });
				}
			})
		}

	}

	logOut = () => {
		heimdallr.signOut().then(() => {
			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Home' })],
			});
			this.props.navigation.dispatch(resetAction);
		});
	}

	render () {
		return (
			<View>
				<View style={{zIndex: 0}}>
					<TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
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
						disabled={true}
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
					<FatBottomedButton text='Salvar' color={'white'} backgroundColor={theme.primary} onTap={() => this.saveEdition()} />
				</View>
				<View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', position: 'absolute', top: theme.height * 0.8, width: theme.width * 0.9}}>
					<TouchableOpacity onPress={() => {this.setState({ showAlert: true })}}>
						<Text style={{color: theme.primary}}>
							Excluir conta
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.logOut.bind(this)}>
						<Text style={{color: theme.primary}}>
							Desconectar
						</Text>
					</TouchableOpacity>
				</View>

				<AwesomeAlert
					show={this.state.showAlert}
					showProgress={false}
					title="Não seremos os mesmos sem você"
					message="Você realmente deseja apagar a sua conta? Essa ação não poderá ser desfeita e nos deixará muito tristes :("
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={true}
					showConfirmButton={true}
					cancelText="Cancelar"
					confirmText="Continuar"
					contentContainerStyle={{backgroundColor: 'white', zIndex: 9999999}}
					confirmButtonColor={theme.primary}
					onCancelPressed={() => {
						this.setState({ showAlert: false })
					}}
					onConfirmPressed={() => {this.setState({ showConfirmCodeModal: true, showAlert: false })}}
				/>
				<Modal
					statusBarTranslucent={true}
					hardwareAccelerated={true}
					animationType='fade'
					transparent={true}
					visible={this.state.showConfirmCodeModal}
					style={{height: 50}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalContainer}>
							<Text style={styles.textTitle}>Verificação</Text>
								<View>
									<Text>Para continuar precisamos que digite a sua senha novamente:</Text>
								</View>
							<EyeOfThePassword
								secureTextEntry={this.state.securePassword}
								toggleSecureEntry={this.toggleSecureEntry.bind(this)}
								placeholder='Senha'
								autoCompleteType='password'
								textContentType='password'
								onChangeText={text => this.setState({password: text})}
							/>
							<View style={{flexDirection: 'row'}}>
								<View style={{flex: 1, padding: 5}}>
									<FatBottomedButton text='Cancelar' color={theme.primary} onTap={() => {this.setState({ showConfirmCodeModal: false })}}
									/>
								</View>
								<View style={{flex: 1, padding: 5}}>
									<FatBottomedButton text='Confirmar' backgroundColor={theme.primary} color={'white'} onTap={this.deleteUser.bind(this)}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
				<Modal statusBarTranslucent={true}
				       hardwareAccelerated={true}
				       animationType='fade'
				       transparent={true}
				       visible={this.state.showLoadingModal}
				       style={{height: 50}}>
					<View style={styles.centeredView}>
						<View style={styles.modalContainer}>
							<ActivityIndicator animating={true} color={theme.primary} size={'large'}/>
							<Text style={{textAlign: 'center'}}> Aplicando alterações </Text>
						</View>
					</View>
				</Modal>
				<FlashMessage ref={'message'} style={{ zIndex: 99 }} />
			</View>

		)
	}
}

const styles = StyleSheet.create({
	modalContainer: {
		// height: 150,
		width: 300,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	textTitle: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});