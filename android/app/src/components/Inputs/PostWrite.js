import React  from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Image,
	PermissionsAndroid,
	StatusBar,
	Keyboard,
  ScrollView,
  Animated
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
import AsyncStorage from "@react-native-community/async-storage";
import UserImgProfile from "../../../../../components/General/UserImgProfile";

export default class PostWrite extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postText: '',
      postTextAux: '',
			postImages: [],
			anonymousUser: false,
			anonymousText: "Postar como anônimo?",
			videoIncluded: false,
			gifIncluded: false,
			params: null,
			activity: false,
      allUsers: null,
      filteredUsers: null,
      searchingForUser: false,
      formattedText: '',
      taggedUsers: [],
      taggedUserNames: [],
      currentUserSearch: null,
      cursor: 0,
      startEditingIndex: null,
      endEditingIndex: null,

      textInputHeight: new Animated.Value(theme.height * 0.69),
      userTagInputHeight: new Animated.Value(0)
		};
	}

	componentDidMount(): void {
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content', true);
    this.state.allUsers = heimdallr.getCollection('user');
	}

	deletePostImg (pos) {
		let images = this.state.postImages;
		let newImg = [];
		for (let i = 0; i < images.length; i++) {
			if (i != pos) {
				newImg.push(images[i]);
			}
		}
    const length = this.state.postImages.length - 1;
    if (length === 0) {
      Animated.timing(
        this.state.textInputHeight,
        {
          toValue: (theme.height * 0.69),
          duration: 200,
          useNativeDriver: false
        }
      ).start();
    }
		this.setState({postImages: newImg, videoIncluded: false, gifIncluded: false});
	}

	doPost = async () => {
		if (this.state.postText == '' && this.state.postImages.length == 0  && this.state.postImages.length === 0 || this.state.activity) {
			return ;
		}

    for (let i = 0; i < this.state.taggedUserNames.length; i++) {
      if (this.state.postText.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
        this.state.postText = this.state.postText.replace('@' + this.state.taggedUserNames[i], '@%');
      } else {
        this.state.taggedUserNames.splice(i, 1);
        i--;
      }
    }
    const params = {};


    this.setState({activity: true});
    if (this.state.taggedUsers.length > 0) {
      const taggedUsers = []
      for (let i = 0; i < this.state.taggedUsers.length; i++) {
        let taggedUser = {}
        taggedUser.name = this.state.taggedUsers[i].data().name;
        taggedUser.uid = this.state.taggedUsers[i].data().uid;

        taggedUsers.push(taggedUser);
      }

      params.taggedUsers = taggedUsers;

    } else {
      params.taggedUsers = false;
    }

		/* caso a postagem possua ao menos uma foto */
		let posImagesLenght = this.state.postImages.length;
		if (this.state.postImages.length > 0) {
			params.active = 1;
			params.date = await heimdallr.getServerTime();
			params.sort_value = params.date;
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
			AsyncStorage.setItem('new_post', JSON.stringify({...params, newPost: true}));
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
						self.state.params.images = urlArray;
						/* Save the post*/
						self.savePost(checkedImages / posImagesLenght);
					})
				}
			})
		} else {
			// caso a postagem não contenha imagem
			params.active = 1;
			params.date = await heimdallr.getServerTime();
			params.sort_value = params.date;
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
			AsyncStorage.setItem('new_post', JSON.stringify({...params, newPost: true}));
			this.props.call({...params, newPost: true});
			this.savePost(1);
		}
	}

	getAnonymous = () => {
		const isAnon = !this.state.anonymousUser;
		this.setState({ anonymousUser: isAnon, searchingForUser: false,  taggedUsers: [], taggedUserNames: [], currentUserSearch: null });
		if(isAnon){
           this.setState({anonymousText: "Será postado como anônimo."});
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
			let result = heimdallr.saveCollection('post', this.state.params);
			result.then((resolve) => {
        console.log("Sim foi devolvido")
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
              if (this.state.postImages.length === 0) {
                Animated.timing(
                  this.state.textInputHeight,
                  {
                    toValue: (theme.height * 0.38),
                    duration: 200,
                    useNativeDriver: false
                  }
                ).start();
              }
							this.setState({postImages: [response], videoIncluded: true});
						} else {
							const name = Date.now().toString() + '.jpg';
							RNFS.mkdir(RNFS.PicturesDirectoryPath + '/Spotted');
							RNFS.copyFile(response.path, RNFS.PicturesDirectoryPath + '/Spotted/' + name);
							response.path = RNFS.PicturesDirectoryPath + '/Spotted/' + name;
							RNPhotoEditor.Edit({
								path: response.path,
								onDone: () => {
									let images = this.state.postImages;
									images.push(response);
                  if (this.state.postImages.length === 0) {
                    Animated.timing(
                      this.state.textInputHeight,
                      {
                        toValue: (theme.height * 0.38),
                        duration: 200,
                        useNativeDriver: false
                      }
                    ).start();
                  }
									this.setState({postImages: images});
								}
							});
						}
					}
				});
			}
		} catch (err) {
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

  closeTagUser () {
    Animated.timing(
      this.state.textInputHeight,
      {
        toValue: this.state.postImages.length > 0 ? (theme.height * 0.38) : (theme.height * 0.69),
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      this.state.userTagInputHeight,
      {
        toValue: (0),
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    this.state.searchingForUser = false;
    this.setState({ searchingForUser: false, currentUserSearch: null, filteredUsers: null})
  }

  async openTagUser() {
    this.state.searchingForUser = true;
    this.state.startEditingIndex = this.state.cursor;
    this.state.endEditingIndex = this.state.cursor;
    await this.searchToTagUser(null);
    Animated.timing(
      this.state.textInputHeight,
      {
        toValue: this.state.postImages.length > 0 ? (theme.height * 0.26) : (theme.height * 0.57),
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      this.state.userTagInputHeight,
      {
        toValue: (theme.height * 0.12),
        duration: 200,
        useNativeDriver: false
      }
    ).start();
  }

  _onTextChange(text) {
    // try {
    //   console.log("Char:  ", event.nativeEvent.key)
    //
    // } catch (e) {
    //   console.log("deu merda")
    // }
    try {
      let postText = this.state.postText;
      let key = null;
      let deletedKey = null;
      for (let i = 0; i < this.state.taggedUserNames.length; i++) {
        console.log("Pessoa: ", this.state.taggedUserNames[i], )
        if (text.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
          console.log("Substituindo");
          text = text.replace('@' + this.state.taggedUserNames[i], '@%');
        }

        if (postText.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
          postText = postText.replace('@' + this.state.taggedUserNames[i], '@%');
        }
      }



      console.log(">>>> ", text, `<>`,  postText)
      if (text.length > postText.length) {
        key = text.replace(postText, '');
      } else {
        key = "Backspace";
        deletedKey = postText.replace(text, '');
      }
      console.log("KEY: ", key);
      this.state.postText = text;
      if (this.state.searchingForUser && key !== '@' && key !== 'Enter' && deletedKey !== '@') {
        if (key === ' ' && (this.state.cursor - 1) === this.state.startEditingIndex) {
          this.closeTagUser();
        }
        this.state.endEditingIndex = this.state.cursor;

        this.searchToTagUser(text.substring(this.state.startEditingIndex + 1, this.state.endEditingIndex + 1));


        } else if (key === '@') {
         this.openTagUser();
        } else {
          this.closeTagUser();

        }

    } catch (e) {
      console.log("Erro: ", e)
    }

    // const key = event.nativeEvent.key;


    // if (key === 'Backspace') {
    //   // this.setState({ }, () => {
    //   //   for (let i = 0; i < this.state.taggedUserNames.length; i++) {
    //   //     console.log("COMO EU VEHO AQUI? ", this.state.postText)
    //   //     if (this.state.postText.indexOf(`@${this.state.taggedUserNames[i]}`) === -1) {
    //   //       // this.state.postText = '';
    //   //       // this.
    //   //     }
    //   //   }
    //   //   this.renderText();
    //   //   console.log('BEM TE VI')
    //   //
    //   // })
    // }

    // if (this.state.searchingForUser && key !== '@' && key !== 'Enter') {
    //   if (key === 'Backspace') {
    //    if (this.state.currentUserSearch) {
    //       this.state.currentUserSearch = this.state.currentUserSearch.substring(0,  this.state.currentUserSearch.length - 1)
    //    }
    //   } else {
    //     if (!this.state.currentUserSearch) {
    //       this.state.currentUserSearch = key
    //     } else {
    //       this.state.currentUserSearch += key
    //     }
    //   }
    //   this.searchToTagUser(this.state.currentUserSearch);
    //
    // } else if (event.nativeEvent.key === '@') {
    //   console.log("Entra aqui diabo: ", this.state.cursor - 1)
    //   Animated.timing(
    //     this.state.textInputHeight,
    //     {
    //       toValue: this.state.postImages.length > 0 ? (theme.height * 0.26) : (theme.height * 0.57),
    //       duration: 200,
    //       useNativeDriver: false
    //     }
    //   ).start();
    //   Animated.timing(
    //     this.state.userTagInputHeight,
    //     {
    //       toValue: (theme.height * 0.12),
    //       duration: 200,
    //       useNativeDriver: false
    //     }
    //   ).start();
    //
    //   this.state.searchingForUser = true;
    //   this.state.startEditingIndex = this.state.cursor - 1;
    //   this.searchToTagUser(null);
    // } else {
    //   Animated.timing(
    //     this.state.textInputHeight,
    //     {
    //       toValue: this.state.postImages.length > 0 ? (theme.height * 0.38) : (theme.height * 0.69),
    //       duration: 200,
    //       useNativeDriver: false
    //     }
    //   ).start();
    //   Animated.timing(
    //     this.state.userTagInputHeight,
    //     {
    //       toValue: (0),
    //       duration: 200,
    //       useNativeDriver: false
    //     }
    //   ).start();
    //   this.state.searchingForUser = false;
    //   this.setState({ searchingForUser: false, currentUserSearch: null, filteredUsers: null})
    //
    //
    //
    //   if (this.state.postText.length !== this.state.cursor) {
    //     let search = [key]
    //
    //     for (let i = this.state.cursor - 1; i >= 0; i--) {
    //       let txt = this.state.postText.split('')
    //       if (txt[i] === '@') {
    //         Animated.timing(
    //           this.state.textInputHeight,
    //           {
    //             toValue: this.state.postImages.length > 0 ? (theme.height * 0.26) : (theme.height * 0.57),
    //             duration: 200,
    //             useNativeDriver: false
    //           }
    //         ).start();
    //         Animated.timing(
    //           this.state.userTagInputHeight,
    //           {
    //             toValue: (theme.height * 0.12),
    //             duration: 200,
    //             useNativeDriver: false
    //           }
    //         ).start();
    //
    //         this.state.searchingForUser = true;
    //         this.state.currentUserSearch = search.join('');
    //         this.state.startEditingIndex = i;
    //         this.searchToTagUser(search.join(''));
    //         break;
    //       } else if (txt[i] === ' ') {
    //         break;
    //       } else {
    //         search.unshift(txt[i]);
    //       }
    //     }
    //
    //   }
    //
    // }
    // if (this.state.postText[this.state.cursor - 1] === '@') {
    //   console.log("quem tá é esse <_")
    //   this.state.filteredUsers = null;
    //   Animated.timing(
    //     this.state.textInputHeight,
    //     {
    //       toValue: this.state.postImages.length > 0 ? (theme.height * 0.38) : (theme.height * 0.69),
    //       duration: 200,
    //       useNativeDriver: false
    //     }
    //   ).start();
    //   Animated.timing(
    //     this.state.userTagInputHeight,
    //     {
    //       toValue: (0),
    //       duration: 200,
    //       useNativeDriver: false
    //     }
    //   ).start();
    //   this.setState({ searchingForUser: false, currentUserSearch: null, filteredUsers: null})
    //
    // }




  }


  async searchToTagUser (text) {
    const filteredUsers = await this.state.allUsers;
    if (!text) {
      this.setState({ filteredUsers: filteredUsers.slice(0, 5) })
        this.state.cursor--;
        this.renderText(this.state.cursor - 1);
    } else {
      this.setState({ filteredUsers: filteredUsers.filter((u) => u.data().name.toLowerCase().includes(text.toLowerCase())).slice(0, 5), searchingForUser: true }, () => {
        this.renderText();
      })
    }


    // this.setState({})
  }

  tagUser(user) {
    console.log(user)
    this.state.taggedUsers.push(user);
    this.state.taggedUserNames.push(user.data().name)
    this.closeTagUser();
    for (let i = this.state.cursor; i >= 0; i--) {
      this.state.postText = [this.state.postText.slice(0, i), this.state.postText.slice(i + 1)].join('');
      if(this.state.postText[i - 1] === '@') {
        this.setState({ postText: [this.state.postText.slice(0, i - 1), '@% ', this.state.postText.slice(i)].join('')})
        break;
      }
    }
  }

  renderText () {
    // console.log("Aqui no render: <", this.state.cursor, this.state.searchingForUser)
    if (this.state.postText.indexOf('@%') === -1) {
      for (let i = 0; i < this.state.taggedUserNames.length; i++) {
        if (this.state.postText.indexOf('@' + this.state.taggedUserNames[i]) >= 0) {
          this.state.postText = this.state.postText.replace('@' + this.state.taggedUserNames[i], '@%');
        } else {
          this.state.taggedUserNames.splice(i, 1);
        }
      }

    }
    if (this.state.searchingForUser) {
      let c_index = 0;
      const letters = this.state.postText.split('');
      let element =  <Text>{letters.map((letter, index) => {
        if (letter === '%' && this.state.postText[index - 1] && this.state.postText[index - 1] === '@') {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{this.state.taggedUserNames[c_index++]}</Text>
        } else if (( letter === '@' && (this.state.postText[index - 1] || index === 0) && this.state.postText[index + 1] === '%' ) ) {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>@</Text>
        } else if (index >= this.state.startEditingIndex && index <= this.state.cursor) {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{letter}</Text>
        } else {
          return letter
        }
      })
      }</Text>



      return (
        element
      )
    } else {
      let c_index = 0;
      const letters = this.state.postText.split('');
      let element =  <Text>{letters.map((letter, index) => {
        if (letter === '%' && this.state.postText[index - 1] && this.state.postText[index - 1] === '@') {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{this.state.taggedUserNames[c_index++]}</Text>
        } else if (( letter === '@' && (this.state.postText[index - 1] || index === 0) && this.state.postText[index + 1] === '%' ) ) {
          return <Text style={{ color: theme.primary, fontWeight: 'bold' }}>@</Text>
        } else {
          return letter
        }
      })
      }</Text>


      return (
        element
      )
    }

  }

  _handleCursor(event) {
    event.preventDefault();
    const cursor = event.nativeEvent.selection;
    console.log("cursor: ", cursor)
    if (cursor.end != cursor.start) {
      Animated.timing(
        this.state.textInputHeight,
        {
          toValue: (theme.height * 0.69),
          duration: 200,
          useNativeDriver: false
        }
      ).start();
      Animated.timing(
        this.state.userTagInputHeight,
        {
          toValue: (0),
          duration: 200,
          useNativeDriver: false
        }
      ).start();
      this.setState({ searchingForUser: false, currentUserSearch: null, filteredUsers: null})
    } else {
      console.log()

      this.state.cursor = cursor.end;

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
						<View style = {{borderColor: '#f2f2f2', borderBottomWidth: 2, marginTop: theme.height * 0.02 }}>
              <Animated.ScrollView style={{ height: this.state.userTagInputHeight}} keyboardShouldPersistTaps={'always'}>
              {
                  this.state.filteredUsers &&
                  this.state.filteredUsers.map((user) =>
                    <TouchableOpacity onPress={() => {this.tagUser(user)}} >
                      <View style={styles.userViewContainer}>
                        <UserImgProfile circular height={25} width={25} uri={user.data().user_image} />
                        <View style={styles.info}>
                          <Text>
                            {user.data().name}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
              }
              </Animated.ScrollView>
              {
                <Animated.View
                  style={{
                    width: theme.width * 0.9,
                    alignSelf:'center',
                    height: this.state.textInputHeight,
                  }}
                >
                  <TextInput
                    onChangeText={text => {this._onTextChange(text)}}
                    autoCapitalize="sentences"
                    multiline
                    autoFocus={true}
                    textAlignVertical="top"
                    placeholder="O que você está pensando?"
                    onImageChange={this._onImageChange}
                    ref={postTextInput => {this.postTextInput = postTextInput}}
                    onSelectionChange={(cursorEvent) => this._handleCursor(cursorEvent)}
                  >
                    {this.renderText()}
                  </TextInput>
                </Animated.View>
              }
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
						<View style={{marginTop:5, width: theme.width * 0.9, alignSelf:'center'}}>
							<FatBottomedButton backgroundColor = {theme.primary} color={theme.secondary} text={'Postar'} onTap={this.doPost.bind(this)}/>
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
	},
  userViewContainer: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 0.2,
    borderColor: 'rgba(59, 56, 50, 0.2)',
  },
  info: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  textFieldContainer: {
    borderWidth: 1,
  }

});
