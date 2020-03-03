import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
	KeyboardAvoidingView,
	Dimensions,
} from 'react-native';
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import {Text} from "react-native-paper";
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default class PostWrite extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postText: [],
			postImages: [],
		};
	}

	deletePostImg (pos) {
		// sim... esse loop está bem feio, porém array.splice não funciona no react
		let images = [];images = this.state.postImages;
		let newImg = [];
		for (let i = 0; i < images.length; i++) {
			if (i != pos) {
				newImg.push(images[i]);
			}
		}this.setState({postImages: newImg});
	}

	doPost = () => {
		if (this.state.postText == '' && this.state.postImages.length == 0 ) {
			console.log('nothing to do...');
			return ;
		}

		/* caso a postagem possua ao menos uma foto */
		let posImagesLenght = this.state.postImages.length;
		if (this.state.postImages.length > 0) {
			console.log('with image');
			let urlArray = [];
			let self = this;
			let checkedImages = 0;
			/* Save images in storage */
			this.state.postImages.forEach((img) => {
				console.log('before: ', this.state.postImages);
				let link = heimdallr.uploadImage(img);
				link.then(function (resolve) {
					checkedImages ++;
					console.log('URL resolve: ', resolve);
					urlArray.push(resolve);
					self.state.postImages = urlArray;
					/* Save the post*/
					self.savePost(checkedImages / posImagesLenght);
				})
			})
		} else {
			// caso a postagem não contenha imagem
			this.savePost(1);
		}
	}

	savePost(sendedImages) {
		console.log('Semaphore: ', sendedImages);
		/* Essa condição é equivalente ao conceito de barreira (só que com uma implementação muito mais simples)
		 * Espera até que todas as fotos tenham sido enviadas para continuar
		 * */
		if (sendedImages >= 1) {
			let self = this;
			const params = {};
			params.active = 1;
			params.date = new Date();
			params.text = this.state.postText;
			params.uid = heimdallr.user_id;
			params.images = this.state.postImages;
			params.user_name = heimdallr.user_name;
			params.user_image = heimdallr.user_image;
			params.comments = 0;
			heimdallr.getUID().then((uuid) => {
				params.pid = uuid;
				let result = heimdallr.saveCollection('post', params);
				result.then((resolve) => {
					console.log('result: ', resolve);
					self.postTextInput.clear();
					self.setState({postImages: []});
					self.setState({showModal: false});
				});
			})
		} else {
			console.log(sendedImages, ' has already sended...');
		}
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
						let images = this.state.postImages;
						images.push('file://' + response.path);
						this.setState({postImages: images});
						console.log('Imagem: ', this.state.postImages);
						this.setState({showModal: true});
					}
				});
			} else {
				console.log('Camera permission denied');
			}
		} catch (err) {
			console.warn(err);
		}
	}

	getModalImagesLayout() {
		/*
		* Existe uma condição para cada quantidade de fotos (0 a 4). O layout muda completamente
		* */
		if (this.state.postImages.length === 1) {
			return (
				<View>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 280, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0]}}
								style={{width: 280, height: 200}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		} else if (this.state.postImages.length === 2) {
			return (
				<View>
					<View style={{ flexDirection: 'row', marginBottom: 5}}>
						<View style={{width: 160, height: 250, backgroundColor: 'yellow'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0]}}
								style={{width: 160, height: 250}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 160, height: 250, backgroundColor: 'purple'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1]}}
								style={{width: 160, height: 250}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		} else if (this.state.postImages.length === 3) {
			return (
				<View>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 160, height: 100, backgroundColor: 'yellow'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0]}}
								style={{width: 160, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1]}}
								style={{width: 160, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexDirection: 'row',  marginBottom: 5}}>
						<View style={{width: 320, height: 100, backgroundColor: 'pink'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[2]}}
								style={{width: 320, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 2)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		} else if (this.state.postImages.length === 4) {
			return (
				<View>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 160, height: 100, backgroundColor: 'yellow'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1]}}
								style={{width: 160, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1]}}
								style={{width: 160, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexDirection: 'row',  marginBottom: 5}}>
						<View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[2]}}
								style={{width: 160, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 2)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[3]}}
								style={{width: 160, height: 100}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 3)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		} else {
			return ;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View>
					<View>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.props.close}>
								<Image
									source={require('../../../../../assets/images/times-solid.png')}
									style={{width: 20, height: 20}}
								/>
							</TouchableOpacity>
						</View>
						{/*<UserImgProfile circular height={50} width={50} uri={heimdallr.user_image}/>*/}
						<View>
							<TextInput
								style={styles.postWriter}
								onChangeText={text => this.setState({postText: text})}
								autoCapitalize="sentences"
								multiline
								textAlignVertical="top"
								placeholder="O que você está pensando?"
								ref={input => (this.postTextInput = input)}
							/>
						</View>
						{this.getModalImagesLayout()}
						<TouchableOpacity onPress={this.sendImagePropt.bind(this)}>
							<View style={styles.imageButtonSelect}>
								<Image
									source={require('../../../../../assets/images/images.png')}
									style={{width: 50, height: 40}}
								/>
								<Text> Adicionar imagem... </Text>
							</View>
						</TouchableOpacity>
						<View style={{marginTop: 15, width: width * 0.9, marginLeft: 25}}>
							<FatBottomedButton color={theme.primary} text={'Postar'} onTap={this.doPost.bind(this)}/>
						</View>
					</View>
					{/*<View style={{flexDirection: 'row-reverse', marginTop: 2}}>*/}
					{/*	<TouchableOpacity onPress={this.doPost.bind(this)}*/}
					{/*	                  style={{marginRight: 20}}*/}
					{/*	>*/}
					{/*		<Image*/}
					{/*			style={{width: 30, height: 30}}*/}
					{/*			source={require('../../../../../assets/images/send.png')}*/}
					{/*		/>*/}
					{/*	</TouchableOpacity>*/}
					{/*	<TouchableOpacity*/}
					{/*		onPress={this.sendImagePropt.bind(this)}*/}
					{/*		style={{marginRight: 20}}*/}
					{/*	>*/}
					{/*		<Image*/}
					{/*			style={{width: 30, height: 30}}*/}
					{/*			source={require('../../../../../assets/images/camera-icon.png')}*/}
					{/*		/>*/}
					{/*	</TouchableOpacity>*/}
					{/*</View>*/}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		alignContent: 'center',
		position: 'absolute',
	},
	header: {
		width: width,
		height: 20,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		alignContent: 'center',
		padding: 4,
	},
	postWriter: {
		width: width + 10,
		borderBottomWidth: 1,
		borderColor: theme.primary,
		height: 500,
	},
	imageButtonSelect: {
		height: height * 0.1,
		width: width + 10,
		marginTop: 2,
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		backgroundColor: 'rgba(99, 96, 96, 0.2)',
	},
	deleteImgIcon: {
		width: 20,
		height: 20,
		borderColor: 'black',
		tintColor: 'white',
	},
});