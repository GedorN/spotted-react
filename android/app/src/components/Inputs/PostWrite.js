import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
	KeyboardAvoidingView,
	Dimensions, StatusBar,
} from 'react-native';
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import ImageResizer from "react-native-image-resizer";
import moment from 'moment-timezone';
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

	componentDidMount(): void {
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content', true);
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
			this.props.close();
			/* Save images in storage */
			this.state.postImages.forEach((img) => {
				console.log('before: ', this.state.postImages);
				let propCo =  600000 / img.fileSize;
				console.warn(img.fileSize);
				if (propCo < 1) {
					console.warn('Ué cusão');
				} else {
					console.warn('deu boa não');
				}
				let quality = propCo > 1 ? 100 : 100 * propCo;
				let constant = propCo < 1 ? 1 / propCo : 1;
				ImageResizer.createResizedImage(img.path, img.width / constant, img.height / constant, 'JPEG', quality ).then(
					(resolve) => {
						let link = heimdallr.uploadImage(resolve.uri);
						link.then(function (resolve) {
							checkedImages ++;
							console.log('URL resolve: ', resolve);
							urlArray.push(resolve);
							self.state.postImages = urlArray;
							/* Save the post*/
							self.savePost(checkedImages / posImagesLenght);
						})

					},
					(reject) => {
						console.warn('Deu merdinha');
					}
				)
			})
		} else {
			// caso a postagem não contenha imagem
			this.props.close();
			this.savePost(1);
		}
	}

	async savePost(sendedImages) {
		console.log('Semaphore: ', sendedImages);
		/* Essa condição é equivalente ao conceito de barreira (só que com uma implementação muito mais simples)
		 * Espera até que todas as fotos tenham sido enviadas para continuar
		 * */
		if (sendedImages >= 1) {
			let self = this;
			const params = {};
			params.active = 1;
			params.date = await heimdallr.getServerTime();
			params.text = this.state.postText;
			params.uid = heimdallr.user_id;
			params.images = this.state.postImages;
			params.user_name = heimdallr.user_name;
			params.user_image = heimdallr.user_image;
			params.comments = 0;
			heimdallr.getUID().then((uuid) => {
				params.pid = uuid;
				this.props.call();
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
						images.push(response);
						this.setState({postImages: images});
						console.log('Imagem: ', response);
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
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 280, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
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
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					<View style={{ flexDirection: 'row', marginBottom: 5}}>
						<View style={{width: 140, height: 200, backgroundColor: 'yellow'}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0].path}}
								style={{width: 139, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 140, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1].path}}
								style={{width: 139, height: 200,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
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
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 140, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0].path}}
								style={{width: 140, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{flexDirection: 'column'}}>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: 'file://' + this.state.postImages[1].path}}
									style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
								<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
									<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
								</TouchableOpacity>
							</View>
							<View style={{width: 140, height: 99}}>
								<Image
									source={{uri: 'file://' + this.state.postImages[2].path}}
									style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
								<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 2)}>
									<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			)
		} else if (this.state.postImages.length === 4) {
			return (
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10, flexDirection: 'row'}}>
					<View style={{ flexDirection: 'column'}}>
						<View style={{width: 140, height: 100}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0].path}}
								style={{width: 139, height: 99, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 140, height: 100}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1].path}}
								style={{width: 139, height: 99, borderBottomLeftRadius: 10, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexDirection: 'column',  marginBottom: 5}}>
						<View style={{width: 140, height: 100}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[2].path}}
								style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 2)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 140, height: 100}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[3].path}}
								style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
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
									style={{width: 20, height: 20,marginRight:5}}
								/>
							</TouchableOpacity>
						</View>
						{/*<UserImgProfile circular height={50} width={50} uri={heimdallr.user_image}/>*/}
						<View>
							<TextInput
								style={{width: width + 10,
									borderBottomWidth: 1,
									borderColor: 'grey',
									height: this.state.postImages.length > 0 ? height * 0.416 : height * 0.70,
								}}
								onChangeText={text => this.setState({postText: text})}
								autoCapitalize="sentences"
								multiline
								textAlignVertical="top"
								placeholder="O que você está pensando?"
								ref={input => (this.postTextInput = input)}
							/>
						</View>
						<TouchableOpacity disabled={this.state.postImages.length === 4} onPress={this.sendImagePropt.bind(this)}>
							<Image
								source={require('../../../../../assets/images/camera-icon.png')}
								style={{
									width: 35,
									height: 30,
									alignSelf:'flex-end',
									marginRight:28,
									marginTop:7,
									opacity: this.state.postImages.length === 4 ? 0.4 : 1
								}}
							/>
						</TouchableOpacity>
						<View style={{alignSelf:'center'}}>
							{this.getModalImagesLayout()}
						</View>
						<View style={{marginTop: this.state.postImages.length > 0 ? 25 : 15, width: width * 0.9, marginLeft: 25}}>
							<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={'Postar'} onTap={this.doPost.bind(this)}/>
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
		height: height,
		alignItems: 'center',
		alignContent: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		zIndex: 99999
	},
	header: {
		width: width,
		height: 20,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		alignContent: 'center',
		padding: 4,
		marginTop: 10,
	},
	postWriter: {
		// width: width + 10,
		// borderBottomWidth: 1,
		// borderColor: theme.primary,
		// height: this.state.postImages.length > 0 ? 300 : 500,
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