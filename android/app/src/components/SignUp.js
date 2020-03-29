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
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import RUMineTextInput from "./Inputs/RUMineTextInput";
import FatBottomedButton from "./buttons/FatBottomedButton";
import theme from "../../../../components/General/Theme";
import GirlsJustWannaDatePicker from "./Inputs/GirlsJustWannaDatePicker";
import ImageResizer from "react-native-image-resizer";

export default  class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state= {
			email: null,
			name: null,
			password: null,
			birth: 'Nascimento',
			confirmPassword: null,
			showDatePicker: false,
			profileImage: null,
			imageCompressed: null,
			showErrorMessage: false,
			showNameErrorMessage: false,
			showErrorDifferentPasswords: false,
			showErrorPasswordLength: false,
		};
	}

	componentDidMount(): void {
		console.log(this.props);
	}


	signUpFieldsVerification = () => {
		console.log('vou verificar');
		if (!this.state.email || !this.state.name || !this.state.birth || !this.state.password || !this.state.confirmPassword) {
			this.setState({showErrorMessage: true});
			return false;
		}
		if (this.state.name.split(' ').length < 2) {
			this.setState({showNameErrorMessage: true});
			return false;
		}

		if (this.state.password !== this.state.confirmPassword) {
			this.setState({showErrorDifferentPasswords: true});
			return false;
		}

		if (this.state.password.length < 6) {
			this.setState({showErrorPasswordLength: true});
			return false;
		}
		return true;
	}

	register = () => {
		console.log('chegou');
		let fieldsOK = this.signUpFieldsVerification();
		if (!fieldsOK) {
			return ;
		}
		const params = {};
		params.email = this.state.email;
		params.password = this.state.password;
		console.log('params: ', params);
		let result = heimdallr.signUp(params);
		result.then( (resolve) => {
			console.log('voltou>: ', resolve);
			this.saveUser(resolve);
			this.props.navigation.goBack();
		});
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
				params.password = this.state.password;
				params.uid = user.user.uid;
				params.user_image = resolve;
				let success = heimdallr.saveCollection('user', params);
				success.then((r) => {
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
			params.active = 1;
			params.password = this.state.password;
			params.uid = user.user.uid;
			let success = heimdallr.saveCollection('user', params);
			success.then((r) => {
				this.updateUser(params);
			});
		}

	}

	updateUser = (user) => {
		let result = heimdallr.updateProfile(user);
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
							<View style={{width: 90, height: 90, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', borderWidth: this.state.profileImage ? 0 : 1, borderColor: theme.primary, borderRadius: 100}}>
								<UserImgProfile circular height={80} width={80} uri={this.state.profileImage}/>
							</View>
						</TouchableOpacity>
					</View>
					{this.state.showErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha todos os campos </Text>}
					{this.state.showNameErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha com o seu nome completo </Text>}
					{this.state.showErrorDifferentPasswords && <Text style={{color: 'red'}}> * As senhas digitadas não são iguais </Text>}
					{this.state.showErrorPasswordLength && <Text style={{color: 'red'}}> * A senha deve ter no mínimo 6 caracteres </Text>}

					<View style={styles.form}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ email: text }) }
							autoCapitalize='none'
							placeholder='Email'
							keyboardType='email-address'
							textContentType='emailAddress'
						/>
					</View>
					<View style={{flexDirection: 'row', marginTop: 30}}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ name: text }) }
							autoCapitalize='words'
							placeholder='Nome'
							textContentType='name'
							marginRight={4}
							flex={1}
						/>
						<GirlsJustWannaDatePicker text={'Nascimento'} textDecorationLine={'underline'} onChange={this.setDate.bind(this)}/>
					</View>
					<View style={styles.form}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ password: text }) }
							autoCapitalize='none'
							placeholder='Password'
							textContentType='password'
						/>
					</View>
					<View style={styles.form}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ confirmPassword: text }) }
							autoCapitalize='none'
							placeholder='Confirm password'
							keyboardType='email-address'
							textContentType='emailAddress'
						/>
					</View>
					<View style={styles.form}>
						<View style={{marginBottom: 10}}>
							<FatBottomedButton text='Sign Up' backgroundColor={theme.primary} color={'white'} onTap={this.register.bind(this)}
							/>
						</View>
						<View>
							<FatBottomedButton text='Cancelar' backgroundColor={theme.primary} color={'white'} onTap={() => this.props.navigation.goBack()}
							/>
						</View>
					</View>
				</View>
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