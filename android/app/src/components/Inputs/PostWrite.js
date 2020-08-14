import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
	Dimensions,
	StatusBar,
	Keyboard,
} from 'react-native';
import {ProgressBar} from "react-native-paper";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import ImageResizer from "react-native-image-resizer";
import Video from 'react-native-video';
import {Text} from "react-native-paper";
var RNFS = require('react-native-fs');
import {RNPhotoEditor} from "react-native-photo-editor";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default class PostWrite extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postText: [],
			postImages: [],
			anonymousUser: false,
			anonymousText: "Postar como anônimo ?",
			videoIncluded: false,
			gifIncluded: false,
			params: null,
			activity: false,
		};
	}

	componentDidMount(): void {
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content', true);
	}

	deletePostImg (pos) {
		console.log('é pra apagar qual: ', pos);
		console.log('antes:', this.state.postImages);
		let images = [];
		images = this.state.postImages;
		let newImg = [];
		for (let i = 0; i < images.length; i++) {
			if (i != pos) {
				newImg.push(images[i]);
			}
		}
		this.setState({postImages: newImg, videoIncluded: false, gifIncluded: false});
		console.log('o que vem daqui? ', Object.assign([], newImg));
		console.log('Depois, ', this.state.postImages);
	}

	doPost = async () => {
		if (this.state.postText == '' && this.state.postImages.length == 0  && this.state.postImages.length === 0 || this.state.activity) {
			return ;
		}

		this.setState({activity: true});

		/* caso a postagem possua ao menos uma foto */
		let posImagesLenght = this.state.postImages.length;
		if (this.state.postImages.length > 0) {
			const params = {};
			params.active = 1;
			params.date = await heimdallr.getServerTime();
			params.text = this.state.postText;
			params.uid = heimdallr.user_id;
			params.images = this.state.postImages;
			params.user_name = heimdallr.user_name;
			params.anonymous = this.state.anonymousUser;
			params.user_image = heimdallr.user_image;
			params.gif = this.state.gifIncluded;
			params.comments = 0;
			params.video = this.state.videoIncluded;
			params.liked_by = [];
			params.likes = 0;
			params.images = this.state.postImages.map(i => i.path);
			params.pid = await heimdallr.getUID();
			this.state.params = params;
			this.props.call({...params, newPost: true});

			let urlArray = [];
			let self = this;
			let checkedImages = 0;
			/* Save images in storage */
			this.state.postImages.forEach((img) => {
				if (this.state.gifIncluded) {
					checkedImages ++;
					urlArray.push(img.path);
					self.state.postImages = urlArray;
					/* Save the post*/
					self.savePost(checkedImages / posImagesLenght);
				} else if (img.type !== 'video/mp4') {
					console.log('before: ', this.state.postImages);
					let propCo =  900000 / img.fileSize;
					let quality = propCo > 1 ? 100 : 100 * propCo;
					let constant = propCo > 1 ? 0.8 : 1;
					ImageResizer.createResizedImage(img.path, img.width / constant, img.height / constant, 'JPEG', quality ).then(
						(resolve) => {
							let link = heimdallr.uploadImage(resolve.uri);
							link.then(function (resolve) {
								checkedImages ++;
								console.log('URL resolve: ', resolve);
								urlArray.push(resolve);
								self.state.params.images = urlArray;
								/* Save the post*/
								self.savePost(checkedImages / posImagesLenght);
							})

						},
					)
				} else {
					let link = heimdallr.uploadImage(img.uri);
					link.then(function (resolve) {
						checkedImages ++;
						console.log('URL resolve: ', resolve);
						urlArray.push(resolve);
						self.state.postImages = urlArray;
						/* Save the post*/
						self.savePost(checkedImages / posImagesLenght);
					})
				}
			})
		} else {
			// caso a postagem não contenha imagem
			const params = {};
			params.active = 1;
			params.date = await heimdallr.getServerTime();
			params.text = this.state.postText;
			params.uid = heimdallr.user_id;
			params.images = this.state.postImages;
			params.user_name = heimdallr.user_name;
			params.anonymous = this.state.anonymousUser;
			params.user_image = heimdallr.user_image;
			params.gif = this.state.gifIncluded;
			params.comments = 0;
			params.video = this.state.videoIncluded;
			params.liked_by = [];
			params.likes = 0;
			params.pid = await heimdallr.getUID();
			this.state.params = params;
			this.props.call(params);
			this.savePost(1);
		}
	}

	getAnonymous = () => {
		const isAnon = !this.state.anonymousUser;
		this.setState({anonymousUser: isAnon});
		if(isAnon){
           this.setState({anonymousText: "Será postado como anônimo"});
		}
		else{
			this.setState({anonymousText: "Postar como anônimo ?"})
		}
	}

	async savePost(sendedImages) {
		/* Essa condição é equivalente ao conceito de barreira (só que com uma implementação muito mais simples)
		 * Espera até que todas as fotos tenham sido enviadas para continuar
		 * */
		if (sendedImages >= 1) {
			heimdallr.sendEvent('post_write');
			heimdallr.sendEvent('post_created');
			let result = heimdallr.saveCollection('post', this.state.params);
			result.then((resolve) => {
				this.postTextInput.clear();
				this.setState({postImages: [], params : null});
			});
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
					mediaType: 'mixed',
					noData: false, // we use response.data to display gif
					allowsEditing: false // make sure we don't edit the gif
				};

				ImagePicker.showImagePicker(options, response => {
					if (response.didCancel) {
					} else if (response.error) {
						console.log('ImagePicker Error: ', response.error);
					} else if (response.customButton) {
						console.log('User tapped custom button: ', response.customButton);
					} else {
						if (response.type === 'video/mp4') {
							this.setState({postImages: [response], videoIncluded: true});
						} else {
							const name = Date.now().toString() + '.jpg';
							RNFS.mkdir(RNFS.PicturesDirectoryPath + '/Spotted');
							RNFS.copyFile(response.path, RNFS.PicturesDirectoryPath + '/Spotted/' + name);
							response.path = RNFS.PicturesDirectoryPath + '/Spotted/' + name;
							RNPhotoEditor.Edit({
								path: response.path,
								onDone: (a) => {
									let images = this.state.postImages;
									images.push(response);
									this.setState({postImages: images});
								}
							});
						}
					}
				});
			}
		} catch (err) {
			console.warn(err);
		}
	}

	_onImageChange = (event) => {
		const {linkUri, data} = event.nativeEvent;
		Keyboard.dismiss();
		this.setState({ postImages: [{path: linkUri}], gifIncluded: true });
	}

	getModalImagesLayout() {
		/*
		* Existe uma condição para cada quantidade de fotos (0 a 4). O layout muda completamente
		* */
		if (this.state.videoIncluded) {
			return (
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 280, height: 200}}>
							<Video
								resizeMode={'cover'}
								repeat={true}
								source={{uri: this.state.postImages[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		} else if (this.state.gifIncluded) {
			return (
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 280, height: 200}}>
							<Image
								source={{uri: this.state.postImages[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		}else if (this.state.postImages.length === 1) {
			return (
				<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: 280, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
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
						<View style={{width: 140, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[0].path}}
								style={{width: 139, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 140, height: 200}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1].path}}
								style={{width: 139, height: 200,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 1)}>
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
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{flexDirection: 'column'}}>
							<View style={{width: 140, height: 100}}>
								<Image
									source={{uri: 'file://' + this.state.postImages[1].path}}
									style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
								<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 1)}>
									<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
								</TouchableOpacity>
							</View>
							<View style={{width: 140, height: 99}}>
								<Image
									source={{uri: 'file://' + this.state.postImages[2].path}}
									style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
								<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 2)}>
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
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 140, height: 100}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[1].path}}
								style={{width: 139, height: 99, borderBottomLeftRadius: 10, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 1)}>
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
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 2)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
						<View style={{width: 140, height: 100}}>
							<Image
								source={{uri: 'file://' + this.state.postImages[3].path}}
								style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 4, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 3)}>
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
						<ProgressBar size="large" visible={this.state.activity} indeterminate color={theme.primary}/>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.props.close}>
								<View style = {{ width: width * 0.1, height: height * 0.03, marginTop: height * 0.005 }}>
									<Image
										source={require('../../../../../assets/images/times-solid.png')}
										style={{width: 20, height: 20,marginRight:5}}
									/>
								</View>
							</TouchableOpacity>
						</View>
						{/*<UserImgProfile circular height={50} width={50} uri={heimdallr.user_image}/>*/}
						<View style = {{borderColor: '#f2f2f2', borderBottomWidth: 2, marginTop: height * 0.02 }}>
							<TextInput
								style={{width: width * 0.9,
									alignSelf:'center',
									height: this.state.postImages.length > 0 ? height * 0.38 : height * 0.69,
								}}
								onChangeText={text => this.setState({postText: text})}
								onImageChange={this._onImageChange}
								autoCapitalize="sentences"
								multiline
								textAlignVertical="top"
								placeholder="O que você está pensando?"
								ref={input => (this.postTextInput = input)}
							/>
						</View>
						<View style={{alignSelf:'center'}}>
							{this.getModalImagesLayout()}
						</View>
						<View style = {{ ...styles.postIcons, marginTop: this.state.postImages.length > 0 ? 10 : 2 }}>
							<TouchableOpacity
								onPress = {this.getAnonymous.bind(this)}
								style = {{ width: 45, height: 45, marginTop: 3 }}>
								<Image
									source={require('../../../../../assets/images/mask-solid.png')}
									style = {{ width: 50, height: 40, opacity: 1 }}
								/>

							</TouchableOpacity>
							<Text style = {{ ...styles.anonymousText, opacity: !this.state.anonymousUser ? 0.5 : 1, fontWeight: !this.state.anonymousUser ? 'normal':'bold' }}>{this.state.anonymousText}</Text>
							<TouchableOpacity disabled={this.state.postImages.length === 4 || this.state.videoIncluded || this.state.gifIncluded} onPress={this.sendImagePropt.bind(this)}>
								<Image
									source={require('../../../../../assets/images/camera-icon.png')}
									style={{
										width: 35,
										height: 30,
										marginTop:9,
										opacity: this.state.postImages.length === 4 || this.state.videoIncluded || this.state.gifIncluded ? 0.4 : 1
									}}
								/>
							</TouchableOpacity>
						</View>
						<View style={{marginTop:5, width: width * 0.9, alignSelf:'center'}}>
							<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={'Postar'} onTap={this.doPost.bind(this)}/>
						</View>
					</View>
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
		alignItems: 'flex-end',
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
	postIcons: {
		flexDirection:"row",
		height: 45 ,
		width: theme.width * 0.9,
		alignSelf:'center',
		justifyContent: 'space-around'
	},
	anonymousText: {
		marginTop:14,
		width:theme.width *0.59,
	}
});
