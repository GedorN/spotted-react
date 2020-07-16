import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
    Keyboard,
} from 'react-native';
import {ProgressBar} from "react-native-paper";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import ImagePicker from "react-native-image-picker";
import Carousel from 'react-native-banner-carousel';
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import ImageResizer from "react-native-image-resizer";
import Video from 'react-native-video';
import {Text} from "react-native-paper";
var RNFS = require('react-native-fs');
import {RNPhotoEditor} from "react-native-photo-editor";


export default class BoardItemWriter extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            postText: [],
            titleText: '',
			postImages: [],
			videoIncluded: false,
            gifIncluded: false,
            placeholder: null,
            titlePlaceholder: 'Digite aqui o título de sua postagem',
            activity: false,
		};
    }

    componentDidMount(): void {
        if(this.props.id === 'properties'){
            this.setState({ placeholder: 'Fale sobre o imóvel que deseja postar...'});
        }
        else if(this.props.id === 'courses'){
            this.setState({ placeholder: 'Fale sobre o curso ou aula que deseja postar...'})
        }
        else if(this.props.id === 'meetings'){
            this.setState({ placeholder: 'Fale sobre o encontro que deseja postar...'})
        }
	}

	deletePostImg = (pos) => {
		this.setState({postImages: null});
		console.log('é pra apagar qual: ', pos);
		console.log('antes:', this.state.postImages);
		let images = [];
		images = Object.assign([], this.state.postImages);
		let newImg = [];
		for (let i = 0; i < images.length; i++) {
			if (i != pos) {
				newImg.push(images[i]);
			}
		}
		this.setState({postImages: Object.assign([], newImg), videoIncluded: false, gifIncluded: false});
		console.log('o que vem daqui? ', Object.assign([], newImg));
		console.log('Depois, ', this.state.postImages);
	}

	doPost = () => {
		if (this.state.postText == '' && this.state.postImages.length == 0  && this.state.postImages.length === 0 && this.state.titleText == '') {
			console.log('nothing to do...');
			return ;
		}

        this.setState({activity: true});
		/* caso a postagem possua ao menos uma foto */
		let posImagesLenght = this.state.postImages.length;
		if (this.state.postImages.length > 0) {
			console.log('with image');
			let urlArray = [];
			let self = this;
            let checkedImages = 0;
			/* Save images in storage */
			this.state.postImages.forEach((img) => {
				checkedImages ++;
				if (this.state.gifIncluded) {
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
								self.state.postImages = urlArray;
								/* Save the post*/
								self.savePost(checkedImages / posImagesLenght);
							})

						},
						(reject) => {
						}
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
			this.props.close();
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
		console.log('Semaphore: ', sendedImages);
		/* Essa condição é equivalente ao conceito de barreira (só que com uma implementação muito mais simples)
		 * Espera até que todas as fotos tenham sido enviadas para continuar
		 * */
		if (sendedImages >= 1) {
			heimdallr.sendEvent('post_write');
			let self = this;
			const params = {};
            params.active = 1;
            params.day_counter = 1;
            params.date = await heimdallr.getServerTime();
            params.title = this.state.titleText;
			params.text = this.state.postText;
			params.uid = heimdallr.user_id;
			params.images = this.state.postImages;
			params.user_name = heimdallr.user_name;
			params.user_image = heimdallr.user_image;
			params.gif = this.state.gifIncluded;
            params.comments = 0;
            params.docName = this.props.id,
			params.video = this.state.videoIncluded;
			heimdallr.getUID().then((uuid) => {
				params.pid = uuid;
				let result = heimdallr.saveBoardPost(params);
				result.then((resolve) => {
					console.log('result: ', resolve);
					/*   */
                    self.setState({postImages: [], showModal: false});
                    this.props.refresh();
					this.props.close();
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
					mediaType: 'mixed',
					noData: false, // we use response.data to display gif
					allowsEditing: false // make sure we don't edit the gif
				};

				ImagePicker.showImagePicker(options, response => {
					if (response.didCancel) {
						console.log('User cancelled image picker');
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
									console.log('e agora: ', a);
									let images = this.state.postImages;
									images.push(response);
									this.setState({postImages: images});
									console.log('Imagem: ', response);
								}
							});
						}
					}
				});
			} else {
				console.log('Camera permission denied');
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

	getModalImagesLayout = (image, index) => {

		if (this.state.videoIncluded) {
			return (
				<View style={{alignItems: 'center', alignSelf: 'center', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: theme.width * 0.67, height: 200}}>
							<Video
								resizeMode={'cover'}
								repeat={true}
								source={{uri: this.state.postImages[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: 7, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, 0)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		} else if (this.state.gifIncluded) {
			return (
				<View style={{alignItems: 'center', alignSelf: 'center', marginTop: 10}}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{width: theme.width * 0.67, height: 100}}>
							<Image
								source={{uri: this.state.postImages[0].path}}
								style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
							/>
							<TouchableOpacity style={{position: 'absolute', top: 4, right: -550, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, index)}>
								<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		}else if (this.state.postImages.length > 0) {
            return(
                <View key={index} style = {styles.imageView}>
                    <Image style={styles.carouselImage} source={{ uri: 'file://' + this.state.postImages[index].path }} />
                    <TouchableOpacity style={{ position: 'absolute', top: 4, right: 12, padding: 5, backgroundColor: 'black', borderRadius: 100}} onPress={this.deletePostImg.bind(this, index)}>
						<Image source={require('../../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
					</TouchableOpacity>
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
								<View style = {{ width: theme.width * 0.1, height: theme.height * 0.03, marginTop: theme.height * 0.005 }}>
									<Image
										source={require('../../../../../assets/images/times-solid.png')}
										style={{width: 20, height: 20,marginRight:5}}
									/>
								</View>
							</TouchableOpacity>
						</View>
                        <View style = {{borderColor: '#f2f2f2', borderWidth: 2, borderRadius:15, marginTop: theme.height * 0.02, width: theme.width * 0.9, alignSelf: 'center' }}>
							<TextInput
								style={{width: theme.width * 0.8,
                                        alignSelf:'center',
                                        height: theme.height * 0.08,
                                        marginTop: theme.height * 0.03
								}}
								onChangeText={text => this.setState({titleText: text})}
								onImageChange={this._onImageChange}
								autoCapitalize="sentences"
								multiline
								textAlignVertical="top"
								placeholder={this.state.titlePlaceholder}
								ref={input => (this.postTextInput = input)}
							/>
						</View>
						<View style = {{ width: theme.width * 0.9,  alignSelf: 'center' }}>
							<TextInput
								style={{width: theme.width * 0.8,
                                        alignSelf:'center',
                                        height: this.state.postImages.length > 0 ? theme.height * 0.2 : theme.height * 0.58,
                                        marginTop: theme.height * 0.02
								}}
								onChangeText={text => this.setState({postText: text})}
								onImageChange={this._onImageChange}
								autoCapitalize="sentences"
								multiline
								textAlignVertical="top"
								placeholder={this.state.placeholder}
								ref={input => (this.postTextInput = input)}
							/>
						</View>

                        {
                            this.state.postImages.length > 0 &&
                            <View style = {styles.carouselView}>
                                <Carousel
                                    activePageIndicatorStyle = {{ backgroundColor: theme.primary}}
                                    ref={carousel => { this.carousel = carousel; }}
                                    index={ 0 }
                                    pageSize={ theme.width * 0.8 }
                                >
                                    { this.state.postImages.length > 0 ? this.state.postImages.map((image, index) => this.getModalImagesLayout(image, index)) : null }
                                </Carousel>
                            </View>
                        }
						<View style = {{ ...styles.postIcons, marginTop: this.state.postImages.length > 0 ? 10 : 2 }}>
							<View style = {{ height: theme.height * 0.03, alignSelf: 'flex-end', flexDirection: 'column', justifyContent: 'center'}}>
                                <Text style={{fontSize:11, color:'#8f8f8f' }}>Sua postagem ficará no mural por 90 dias</Text>
                            </View>
							<Text style = {{ ...styles.anonymousText, opacity: !this.state.anonymousUser ? 0.5 : 1, fontWeight: !this.state.anonymousUser ? 'normal':'bold' }}>{this.state.anonymousText}</Text>
							<TouchableOpacity disabled={ this.state.videoIncluded || this.state.gifIncluded} onPress={this.sendImagePropt.bind(this) }>
								<Image
									source={require('../../../../../assets/images/camera-icon.png')}
									style={{
										width: 35,
										height: 30,
										marginTop:9,
										opacity: this.state.videoIncluded || this.state.gifIncluded ? 0.4 : 1
									}}
								/>
							</TouchableOpacity>
						</View>
						<View style={{marginTop:5, width: theme.width * 0.9, alignSelf:'center'}}>
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
		height: theme.height,
		alignItems: 'center',
		alignContent: 'center',
		position: 'absolute',
		backgroundColor: 'white',
		zIndex: 99999
	},
	header: {
		width: theme.width,
		height: 20,
		alignItems: 'flex-end',
		padding: 4,
		marginTop: 10,
	},
	imageButtonSelect: {
		height: theme.height * 0.1,
		width: theme.width + 10,
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
		width: theme.width * 0.68,
		alignSelf:'center',
		justifyContent: 'space-around'
	},
	anonymousText: {
		marginTop:14,
		width:theme.width *0.59,
	},
	imageView: {
		height: theme.height * 0.27,
		width:theme.width * 0.8,
		alignSelf:'center',
		marginBottom: theme.height * 0.03
	},
	carouselView:{
		alignContent:'center',
		alignItems:'center',
		width:theme.width,
		height:theme.height * 0.3
	},
	carouselImage: {
		width: theme.width * 0.75,
		height: theme.height * 0.27,
		alignSelf:'center'
	}
});
