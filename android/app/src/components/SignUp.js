import React from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity, PermissionsAndroid,
} from 'react-native';

const width = Dimensions.get('screen').width;
import DateTimePicker from '@react-native-community/datetimepicker';
import UserImgProfile from "../../../../components/General/UserImgProfile";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
export default  class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state= {
			email: null,
			name: null,
			password: null,
			birth: null,
			confirmPassword: null,
			showDatePicker: false,
			profileImage: null,
		};
	}

	register = () => {
		console.warn('recebido');
		const params = {};
		params.email = this.state.email;
		params.password = this.state.password;
		console.log('params: ', params);
		let result = heimdallr.signUp(params);
		result.then( (resolve) => {
			console.log('voltou>: ', resolve);
			this.saveUser(resolve);
		});
	}

	saveUser = (user) => {
		if (this.state.profileImage) {
			let result = heimdallr.uploadImage(this.state.profileImage);
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
						let image = 'file://' + response.path;
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

	setDate = (date) => {
		console.log('date', new Date(date.nativeEvent.timestamp));
		this.setState({birth: new Date(date.nativeEvent.timestamp)});
		console.log('te text is: ', this.state.birth.toString());
		this.postTextInput.setNativeProps({text: this.state.birth.toString()});
		this.setState({showDatePicker: false});
	}

	getDatePicker = () => {
		console.warn('selected');
		if (this.state.showDatePicker) {
			return (
				<DateTimePicker value={new Date('2020-06-12T14:42:42')}
				                mode={'date'}
				                is24Hour={true}
				                display="default"
				                onChange={this.setDate.bind(this)}
				/>
			);
		}
	}

	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.sendImagePropt.bind(this)}>
					<UserImgProfile circular height={80} width={80} uri={this.state.profileImage}/>
				</TouchableOpacity>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						onChangeText={ text => this.setState({ email: text }) }
						autoCapitalize='none'
						placeholder='Email'
						keyboardType='email-address'
						textContentType='emailAddress'
					/>
				</View>
				<View style={{width: width * 0.8, flexDirection: 'row'}}>
					<TextInput
						style={styles.inputLeft}
						onChangeText={ text => this.setState({ name: text }) }
						autoCapitalize='words'
						placeholder='Nome'
						textContentType='name'
					/>
					<TextInput
						style={styles.inputRight}
						onFocus={ focus => this.setState({showDatePicker: true}) }
						// onChangeText={ focus => this.setState({showDatePicker: true}) }
						autoCapitalize='none'
						ref={input => (this.postTextInput = input)}
						placeholder='Nascimento'
					/>
				</View>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						onChangeText={ text => this.setState({ password: text }) }
						autoCapitalize='none'
						placeholder='Password'
						textContentType='password'
					/>
				</View>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						onChangeText={ text => this.setState({ confirmPassword: text }) }
						autoCapitalize='none'
						placeholder='Confirm password'
						keyboardType='email-address'
						textContentType='emailAddress'
					/>
				</View>
				<View style={{marginBottom: 6, width: 100}}>
					<Button
						title='Sign Up'
						color='blue'
						onPress={this.register.bind(this)}
					/>
				</View>
				<View style={{width: 100}}>
					<Button
						title='Cancelar'
						color='red'
						onPress={() => this.props.navigation.goBack()}
					/>
				</View>
				{this.getDatePicker()}
			</View>
		);
	}
}

const styles= StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	formContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	form: {
		width: width * 0.8,
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