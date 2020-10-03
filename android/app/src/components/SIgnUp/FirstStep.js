import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	PermissionsAndroid,
	KeyboardAvoidingView,
	Image
} from 'react-native';
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import ImagePicker from "react-native-image-picker";
import {RNPhotoEditor} from "react-native-photo-editor";
import ImageResizer from "react-native-image-resizer";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";

var RNFS = require('react-native-fs');


export default class FirstStep extends React.Component {
	constructor() {
		super();
		this.state= {
			name: null,
			email: null,
			showErrorMessage: false,
			showNameErrorMessage: false,
			showEmailAlreadyInUse: false,
			showEmailBadlyFormatted: false,
			profileImage: null,
			imageCompressed: null,
			showImage: true,
		}
	}

	componentDidMount = () => {
		if (this.props.name) {
			this.state.name = this.props.name;
			this.state.email = this.props.email;
			this.props.profileImage = this.props.profileImage;
			this.state.showEmailAlreadyInUse = this.props.showEmailAlreadyInUse;
			this.state.showEmailBadlyFormatted = this.props.showEmailBadlyFormatted;
		}
	}

	async sendImagePropt() {
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
				} else if (response.error) {
				} else if (response.customButton) {
				} else {
					const name = Date.now().toString() + '.jpg';
					RNFS.mkdir(RNFS.PicturesDirectoryPath + '/Spotted');
					RNFS.copyFile(response.path, RNFS.PicturesDirectoryPath + '/Spotted/' + name);
					response.path = RNFS.PicturesDirectoryPath + '/Spotted/' + name;
					let image = 'file://' + response.path;
					RNPhotoEditor.Edit({
						path: response.path,
						onDone: () => {
							ImageResizer.createResizedImage(response.path, response.width / 5, response.height / 5, 'JPEG', 60).then(
								(resolve) => {
									this.setState({imageCompressed: resolve.uri});
									this.setState({profileImage: image});

								},
								(error) => {
								}).catch((err) => {
							})
						}
					});

				}
			});
		}
	}

	validateNameAndEmail = () => {
		if (!this.state.email || !this.state.name) {
			this.setState({showErrorMessage: true});
			return false;
		}
		if (this.state.name.split(' ').length < 2) {

			this.setState({showNameErrorMessage: true, showErrorMessage: false});
			return false;
		}

		return true;
	}

	redirect = (route, params) => {
		this.props.redirect(route, params);
	}

	goToForward = () => {
		if (this.validateNameAndEmail()) {
			this.props.foward({...this.state});
			this.setState({ showImage: false })
		}
	}




	render() {
		return(
			<KeyboardAvoidingView behavior={'height'} style={styles.container}>
				<View>
					<TouchableOpacity  onPress={() => {this.props.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 7,  paddingLeft: 1, width:theme.width * 0.2, height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, marginTop:4, opacity: 0.9 }}
								source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fchevron-circle-left-solid-white.png?alt=media&token=91ef5798-4bce-4901-8b51-dc3ba395f7c6' }}
							/>
						</View>
					</TouchableOpacity>
					<View style={{justifyContent: 'center', alignContent: 'center'}}>
						<TouchableOpacity onPress={this.sendImagePropt.bind(this)}>
							<Text style={{alignSelf: 'center', justifyContent: 'center', fontSize: 9, marginTop: 4, color: '#b2b5b1'}}> Escolher imagem: </Text>
							{
								this.state.showImage &&
								<View style={{width: 90, height: 90, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', borderRadius: 100}}>
									<UserImgProfile circular height={80} width={80} uri={this.state.profileImage}/>
								</View>
							}
						</TouchableOpacity>
					</View>
					{this.state.showErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha todos os campos </Text>}
					{this.state.showNameErrorMessage && <Text style={{color: 'red'}}> * Por favor, preencha com o seu nome completo </Text>}
					{this.state.showEmailBadlyFormatted && <Text style={{color: 'red'}}> * Email com formato incorreto incorreto </Text>}
					{this.state.showEmailAlreadyInUse && <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
						<Text> Parece que esse email já está cadastrado.</Text><TouchableOpacity onPress={this.redirect.bind(this, 'PasswordRestore', {email: this.state.email})}><Text style={{color: 'red'}}> Clique aqui </Text></TouchableOpacity>
						<Text> para recuperar a senha</Text>
					</View>}

					<View style={{flexDirection: 'row'}}>
						<RUMineTextInput
							onChangeText={ text => this.setState({ name: text }) }
							autoCapitalize='words'
							placeholder='Nome'
							textContentType='name'
							autoFocus={true}
							borderBottomWidth={1}
							borderBottomColor={'#b2b5b1'}
							value={this.state.name}
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
							value={this.state.email}
							borderBottomColor={'#b2b5b1'}
						/>
					</View>
				</View>
				<View style={{paddingBottom: 20}}>
					<FatBottomedButton text='Avançar' backgroundColor={theme.primary} color={theme.secondary} onTap={this.goToForward.bind(this)}/>
				</View>
			</KeyboardAvoidingView>
		)
	}
}

const styles= StyleSheet.create({
	container: {
		padding:20,
		justifyContent:'space-between',
		flexDirection: 'column',
		height: theme.height * 0.95
	},
	form: {
		marginTop: 25,
	},
})

