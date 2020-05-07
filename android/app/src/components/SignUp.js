import React from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	PermissionsAndroid,
	Image,
	KeyboardAvoidingView,
	Modal
} from 'react-native';

import {
	ActivityIndicator
} from 'react-native-paper';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import RUMineTextInput from "./Inputs/RUMineTextInput";
import EyeOfThePassword from "./Inputs/EyeOfThePassword";
import FatBottomedButton from "./buttons/FatBottomedButton";
import theme from "../../../../components/General/Theme";
import ImageResizer from "react-native-image-resizer";
import { TextInputMask } from 'react-native-masked-text';
import {NavigationActions, StackActions} from "react-navigation";



export default  class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state= {
			email: null,
			name: null,
			password: null,
			phone: null,
			showDatePicker: false,
			profileImage: null,
			imageCompressed: null,
			showErrorMessage: false,
			showNameErrorMessage: false,
			showErrorPasswordLength: false,
			showEmailAlreadyInUse: false,
			showEmailBadlyFormatted: false,
			showPhoneError: false,
			securePassword: true,
			confirmationFunction: null,
			codeInput: null,
			showConfirmCodeModal: false,
			inputedWrongCode: false,
			creatingAccount: false,
		};
	}

	async componentDidMount(): void {
		// c.confirm('123456').then(
		// 	(resolve) => {
		// 		console.log('ai jesuis: ', resolve);
		// 	},
		// 	(reject) => {
		// 		console.log('afas: ', reject);
		// 	}
		// )
			// c().then(
			// 	(resolve) => {
			// 		console.log('rsoasd: ', resolve);
			// 	},
			// 	(reject) => {
			// 		console.log('rejece', reject);
			// 	}
			// )
	}

	toggleSecureEntry = () => {
		this.setState({ securePassword: !this.state.securePassword });
	}


	signUpFieldsVerification = () => {

		if (!this.state.email || !this.state.name || !this.state.phone || !this.state.password) {
			this.setState({showErrorMessage: true});
			return false;
		}
		if (this.state.name.split(' ').length < 2) {
			this.setState({showNameErrorMessage: true});
			return false;
		}

		if (this.state.phone.length < 14) {
			this.setState({ showPhoneError: true });
			return false;
		}

		if (this.state.password.length < 6) {
			this.setState({showErrorPasswordLength: true});
			return false;
		}
		return true;
	}

	sendVerificationMessage = async () => {
		let fieldsOK = this.signUpFieldsVerification();
		if (!fieldsOK) {
			return ;
		}
		this.setState({ showErrorMessage: false, showNameErrorMessage: false, showErrorPasswordLength: false, showEmailAlreadyInUse: false, showEmailBadlyFormatted: false  });
		const func = await heimdallr.sendVerificationMessage('+55' + this.state.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''));
		this.setState({ confirmationFunction: func });
		this.setState({ showConfirmCodeModal: true });
	}

	confirmCode = () => {
		if (!this.state.codeInput || this.state.codeInput === '') {
			return ;
		}
		this.setState({ creatingAccount: true });
		this.state.confirmationFunction.confirm(this.state.codeInput).then(
			(resolve) => {
				heimdallr.deleteConectedUser().then(
					(success) => {
						console.log('recebi que deu boa: ');
						this.register();
					}
				)
			},
			(reject) => {
				console.log('pq deu merda: ', reject);
				this.setState({ creatingAccount: false });
				this.setState({ inputedWrongCode: true });
			}
		)
	}

	register = () => {


		// let fieldsOK = this.signUpFieldsVerification();
		// if (!fieldsOK) {
		// 	return ;
		// }
		const params = {};
		params.email = this.state.email;
		params.password = this.state.password;
		console.log('params: ', params);
		let result = heimdallr.signUp(params);
		console.log('tá salvando?');
		result.then(
			(resolve) => {
				try {
					console.log('voltou>: ', resolve);
					this.saveUser(resolve);


				} catch (e) {
					console.log('mas que merda:', e);
				}
			},
			(reject) => {
				if (reject.message ==  "The email address is already in use by another account.") {
					this.setState({ showEmailAlreadyInUse: true });

				}
				if (reject.message ==  "The email address is badly formatted.") {
					this.setState({ showEmailBadlyFormatted: true });

				}
				this.setState({ creatingAccount: false });
				this.setState({showConfirmCodeModal: false });

			}
		);
	}

	saveUser = (user) => {
		if (this.state.profileImage) {
			let result = heimdallr.uploadImage(this.state.imageCompressed);
			result.then((resolve) => {
				console.log('saving user with image...', user);
				const params = {};
				params.name = this.state.name;
				params.email = this.state.email;
				params.creation_date = new Date();
				params.birth_date = this.state.birth;
				params.active = 1;
				params.phone = this.state.phone;
				params.password = this.state.password;
				params.uid = user.user.uid;
				params.user_image = resolve;
				console.log('enviar tudo como: ', params);
				let success = heimdallr.saveCollection('user', params);
				success.then((r) => {
					this.forceUpdate();
					this.updateUser(params);
				});
			});
		} else {
			console.log('saving user...', user);
			const params = {};
			params.name = this.state.name;
			params.email = this.state.email;
			params.creation_date = new Date();
			params.birth_date = this.state.birth;
			params.phone = this.state.phone;
			params.active = 1;
			params.password = this.state.password;
			params.uid = user.user.uid;
			let success = heimdallr.saveCollection('user', params);
			success.then((r) => {
				this.forceUpdate();
				this.updateUser(params);
			});
		}

	}

	updateUser = (user) => {
		heimdallr.updateProfile(user).then(
			(resolve) => {
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Home' })],
				});
				this.props.navigation.dispatch(resetAction);
			}
		);
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
						this.setState({profileImage: image});
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

	cancelPress = () => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Home' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	setDate = (event, date) => {
		console.log('setDate');
		this.setState({showDatePicker: false});
		console.log('date: ', date);
		this.setState({birth: date});
	}


	render(){
		return (
			<KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
				<View style={styles.container}>
					<Image
						style={{width: theme.width, height: theme.height, padding: 0, position: 'absolute', zIndex: -1, opacity: 0.2}}
						source={require('../../../../assets/images/simbol.png')}
					/>
					<View style={{justifyContent: 'center', alignContent: 'center'}}>
						<TouchableOpacity onPress={this.sendImagePropt.bind(this)}>
							<View style={{width: 90, height: 90, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', borderRadius: 100}}>
								<UserImgProfile circular height={80} width={80} uri={this.state.profileImage}/>
							</View>
						</TouchableOpacity>
					</View>
					{this.state.showErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha todos os campos </Text>}
					{this.state.showNameErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha com o seu nome completo </Text>}
					{this.state.showPhoneError && <Text style={{color: 'red'}}> * Insira um telefone celular válido </Text>}
					{this.state.showErrorPasswordLength && <Text style={{color: 'red'}}> * A senha deve ter no mínimo 6 caracteres </Text>}
					{this.state.showEmailBadlyFormatted && <Text style={{color: 'red'}}> * Email com formato incorreto incorreto </Text>}
					{this.state.showEmailAlreadyInUse && <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
															<Text> Parece que esse email já está cadastrado.</Text><TouchableOpacity onPress={() => {this.props.navigation.navigate('PasswordRestore')}}><Text style={{color: 'red'}}> Clique aqui </Text></TouchableOpacity>
															<Text> para recuperar a senha</Text>
														</View>}

					<View style={{flexDirection: 'row', marginTop: 30}}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ name: text }) }
							autoCapitalize='words'
							placeholder='Nome'
							textContentType='name'
							borderBottomWidth={1}
							marginRight={4}
							flex={1}
						/>
					</View>
					<View style={styles.form}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ email: text }) }
							autoCapitalize='none'
							placeholder='Email'
							keyboardType='email-address'
							textContentType='emailAddress'
							borderBottomWidth={1}
						/>
					</View>
					<View style={styles.form}>
						<TextInputMask
							style={{borderBottomWidth : 1, borderColor: theme.primary}}
							type={'cel-phone'}
							options={{
								maskType: 'BRL',
								withDDD: true,
								dddMask: '(99) '
							}}
							placeholder={'Celular'}
							value={this.state.phone}
							onChangeText={text => {
								this.setState({
									phone: text
								})
							}}
						/>
						{/*<RUMineTextInput*/}
						{/*	onChangeText={ text => this.setState({ email: text }) }*/}
						{/*	autoCapitalize='none'*/}
						{/*	placeholder='Telefone'*/}
						{/*	keyboardType='numeric'*/}
						{/*	textContentType='telephoneNumber'*/}
						{/*/>*/}
					</View>
					<View style={styles.form}>
						<EyeOfThePassword
							onChangeText={ text => this.setState({ password: text }) }
							autoCapitalize='none'
							toggleSecureEntry={this.toggleSecureEntry.bind(this)}
							secureTextEntry={this.state.securePassword}
							placeholder='Password'
							textContentType='password'
						/>
					</View>
					<View style={styles.form}>
						<View style={{marginBottom: 10}}>
							<FatBottomedButton text='Criar' backgroundColor={theme.primary} color={'white'} onTap={this.sendVerificationMessage.bind(this)}
							/>
						</View>
						<View>
							<FatBottomedButton text='Cancelar' color={theme.primary} onTap={this.cancelPress.bind(this)}
							/>
						</View>
					</View>
				</View>
				<Modal
					statusBarTranslucent={true}
					hardwareAccelerated={true}
					animationType='fade'
					transparent={true}
					visible={this.state.showConfirmCodeModal}
					style={{height: 50}}
				>
					{
						!this.state.creatingAccount &&
						<View style={styles.centeredView}>
							<View style={styles.modalContainer}>
								<TouchableOpacity onPress={() => {this.setState({ showConfirmCodeModal: false })}}>
									<View style={{alignSelf: 'flex-end'}}>
										<Image style={{width: 15, height: 15}} source={require('../../../../assets/images/times-solid.png')}/>
									</View>
								</TouchableOpacity>
								<Text style={styles.textTitle}>Confirmar código</Text>
								{
									!this.state.inputedWrongCode &&
									<View>
										<Text>Enviamos um código de verificação para o seu telefone.</Text>
										<Text>Insira ele no campo abaixo:</Text>
									</View>
								}
								{
									this.state.inputedWrongCode &&
									<View>
										<Text>Código inserido incorreto</Text>
										<Text>Tente novamente:</Text>
									</View>
								}
								<RUMineTextInput
									onChangeText={ text => this.setState({ codeInput: text }) }
									autoCapitalize='none'
									placeholder='Código'
									keyboardType='numeric'
									textContentType='oneTimeCode'
									borderBottomWidth={1}
								/>
								<View style={{flexDirection: 'row'}}>
									<View style={{flex: 1, padding: 5}}>
										<FatBottomedButton text='Reenviar' color={theme.primary} onTap={this.sendVerificationMessage.bind(this)}
										/>
									</View>
									<View style={{flex: 1, padding: 5}}>
										<FatBottomedButton text='Confirmar' backgroundColor={theme.primary} color={'white'} onTap={this.confirmCode.bind(this)}
										/>
									</View>
								</View>
							</View>
						</View>
					}
					{
						this.state.creatingAccount &&
						<View style={styles.centeredView}>
							<View style={styles.modalContainer}>
								<ActivityIndicator animating={true} color={theme.primary} size={'large'}/>
								<Text style={{marginTop: 5}}>Estamos preparando tudo para a sua chegada...</Text>
							</View>
						</View>
					}
				</Modal>
			</KeyboardAvoidingView>
		);
	}
}

const styles= StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 50
	},
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
	datePicker: {
		color: 'red'
	},
	formContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	form: {
		marginTop: 25,
	},
	input: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
	},
	inputRight: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
		flex: 1,
		marginRight: 4,
	},
	inputLeft: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
		flex: 1,
		marginRight: 4,
	}
});