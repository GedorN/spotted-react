import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
	Modal,
	TextInput
} from 'react-native'

import {
	ActivityIndicator,
} from 'react-native-paper'

import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import FatBottomedButton from "../buttons/FatBottomedButton";
import theme from "../../../../../components/General/Theme";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import AwesomeAlert from "react-native-awesome-alerts";
import EyeOfThePassword from "../Inputs/EyeOfThePassword";
import { StackActions, NavigationActions } from 'react-navigation';
import {RNPhotoEditor} from "react-native-photo-editor";
var RNFS = require('react-native-fs');



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
						let propCo =  900000 / response.fileSize;
						let quality = propCo > 1 ? 100 : 100 * propCo;
						let constant = propCo > 1 ? 0.8 : 1;

						const name = Date.now().toString() + '.jpg';
						RNFS.mkdir(RNFS.PicturesDirectoryPath + '/Spotted');
						RNFS.copyFile(response.path, RNFS.PicturesDirectoryPath + '/Spotted/' + name);
						response.path = RNFS.PicturesDirectoryPath + '/Spotted/' + name;
						let image = 'file://' + response.path;


						RNPhotoEditor.Edit({
							path: response.path,
							onDone: () => {
								ImageResizer.createResizedImage(response.path, response.width / 5, response.height / constant, 'JPEG', quality).then(
									(resolve) => {
										console.log('resolve: ', resolve);
										this.setState({imageCompressed: resolve.uri});
										this.setState({userImage: image});
										console.log('Imagem: ', this.state.postImages);
									},
									(error) => {
										console.log('Image resize error: ', error);
									}).catch((err) => {
									console.log(err);
								})
							}
						});

					}
				});
			}
		} catch (err) {
		}
	}

	deleteUser = () => {
		if (!this.state.password) {
			return ;
		}
		heimdallr.deleteUser(heimdallr.email, this.state.password).then(
			() => {
				this.setState({ showConfirmCodeModal: false});
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Home' })],
				});
				this.props.navigation.dispatch(resetAction);
			},
			() => {
				this.setState({ showConfirmCodeModal: false});
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
			heimdallr.uploadImage(this.state.imageCompressed).then(
				() => {
					const params = {};
					params.name = this.state.userName;
					params.uid = heimdallr.user_id;
					heimdallr.userEditImage(this.state.userImage).then((res) => {
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
				<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
								<View style={{flexDirection: 'row', marginTop: 7,width:theme.width * 0.2,height:theme.height * 0.04}}>
									<Image
										style={{width: 30, height: 30, marginTop:4, opacity: 0.6}}
										source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
									/>
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
							placeholder = {this.state.userName}
							style={{ borderBottomWidth: 0.8, borderBottomColor: '#b2b5b1', height: 40 }}
							value = {this.state.userName}
							onChangeText = { userName => this.setState({ userName }) }
							width = { theme.width*0.9 }
						/>
					<View style = {{ width: theme.width * 0.87, alignSelf: 'center', marginTop: 7 }}>
						<Text style = {{ opacity: 0.8, fontSize: 11 }}>Nome</Text>
					</View>
				</View>
				<View style={{marginTop: 20}}>
					<TextInput
							placeholder = {this.state.email}
							editable = {false}
							style={{ borderBottomWidth: 0.8, borderBottomColor: '#b2b5b1', height: 40 }}
							value = {this.state.email}
							onChangeText = { email => this.setState({ email }) }
							width = { theme.width*0.9 }
						/>
					<View  style = {{ width: theme.width * 0.87, alignSelf: 'center', marginTop:7}}>
						<Text style = {{ opacity: 0.8, fontSize: 11, color: '#b2b5b1' }}>Você não pode alterar</Text>
					</View>
				</View>
				<View style={{marginTop: 40}}>
					<FatBottomedButton text='Alterar senha' color={'white'} height={50} backgroundColor={'black'} borderColor={'black'}  onTap={this.props.changePassword} />
				</View>
				<View style={{marginTop: 20}}>
					<FatBottomedButton text='Salvar' color={'white'} backgroundColor={'#54c43b'} borderColor = {'#54c43b'}  height={50} onTap={() => this.saveEdition()} />
				</View>
				<View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', position: 'absolute', top: theme.height * 0.8, width: theme.width * 0.88}}>
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
