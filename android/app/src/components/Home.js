import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import Modal from "react-native-modal";
const width = Dimensions.get('screen').width;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        postText: '',
        postImages: [],
        showModal: false,
        posts: null,
        pulledPosts: 10,
        loading: false,
    };
  }

  componentDidMount = () => {
  	let result = heimdallr.getCollection(this.state.pulledPosts);
  	result.then( (resolve) => {
  		this.setState({ posts: resolve });
  	});
  }

  pullMorePosts = () => {
  	console.log('pullMorePosts');
  	console.log('state before: ', this.state);
  	let self = this;
  	console.log('chegou');
  	if (true) {
  		let n = this.state.pulledPosts;
  		n = 5 + n;
  		console.log('puxando: ', n);
  		let result = heimdallr.getCollection(n);
  		result.then(function(resolve) {
  			self.setState({posts: resolve});
  			self.setState({pulledPosts: n});
  		});
  	}
  }


  toggleModal () {
  	this.setState({showModal: !this.state.showModal});
  }

  disableModal () {
  	this.setState({showModal: false});
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

  doPost() {
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
      let result = heimdallr.saveCollection('post', params);
      result.then(function(resolve) {
        console.log('result: ', resolve);
        self.postTextInput.clear();
        self.setState({postImages: []});
        self.setState({showModal: false});
      });
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
                      <View style={{width: 317, height: 350}}>
                          <Image
                              source={{uri: 'file://' + this.state.postImages[0]}}
                              style={{width: 317, height: 350}}
                          />
                          <TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 0)}>
                            <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
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
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
                          </TouchableOpacity>
                      </View>
                      <View style={{width: 160, height: 250, backgroundColor: 'purple'}}>
                          <Image
                              source={{uri: 'file://' + this.state.postImages[1]}}
                              style={{width: 160, height: 250}}
                          />
                          <TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
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
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
                          </TouchableOpacity>
                      </View>
                      <View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
                          <Image
                              source={{uri: 'file://' + this.state.postImages[1]}}
                              style={{width: 160, height: 100}}
                          />
                          <TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
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
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
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
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
                          </TouchableOpacity>
                      </View>
                      <View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
                          <Image
                              source={{uri: 'file://' + this.state.postImages[1]}}
                              style={{width: 160, height: 100}}
                          />
                          <TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 1)}>
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
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
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
                          </TouchableOpacity>
                      </View>
                      <View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
                          <Image
                              source={{uri: 'file://' + this.state.postImages[3]}}
                              style={{width: 160, height: 100}}
                          />
                          <TouchableOpacity style={{position: 'absolute', top: 0, right: 0, padding: 5}} onPress={this.deletePostImg.bind(this, 3)}>
                              <Image source={require('../../../../assets/images/times-solid.png')} style={styles.deleteImgIcon}/>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
          )
      } else {
        return ;
      }
  }

  renderFooter = () =>  {
  	return (
  		<View>
		    <ActivityIndicator />
  		</View>
    );
  };




  render() {
    return (
      <View style={{}}>
          <TouchableOpacity
              style={styles.fabButtom}
              onPress={this.toggleModal.bind(this)}

          >
              <Text> + </Text>
          </TouchableOpacity>
          <Modal isVisible={this.state.showModal}
                 onBackButtonPress={this.disableModal.bind(this)}
                 onBackdropPress={this.disableModal.bind(this)}
                 hideModalContentWhileAnimating={true}
          >
              <View style={styles.modalContainer}>
                  <View>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 5}}>
                          <UserImgProfile circular height={50} width={50} uri={heimdallr.user_image}/>
                          <TextInput
                              style={{height: 75, width: 240,  borderColor: 'gray', borderWidth: 1, marginLeft: 12, borderRadius: 12}}
                              onChangeText={text => this.setState({postText: text})}
                              autoCapitalize="sentences"
                              multiline
                              textAlignVertical="top"
                              placeholder="O que você está pensando?"
                              ref={input => (this.postTextInput = input)}
                          />
                      </View>
                      <View style={{flexDirection: 'row-reverse', marginTop: 2}}>
                          <TouchableOpacity onPress={this.doPost.bind(this)}
                                            style={{marginRight: 20}}
                          >
                              <Image
                                  style={{width: 30, height: 30}}
                                  source={require('../../../../assets/images/send.png')}
                              />
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={this.sendImagePropt.bind(this)}
                              style={{marginRight: 20}}
                          >
                              <Image
                                  style={{width: 30, height: 30}}
                                  source={require('../../../../assets/images/camera-icon.png')}
                              />
                          </TouchableOpacity>
                      </View>
                  </View>
                  {this.getModalImagesLayout()}
              </View>
          </Modal>
          <FlatList
              style={{ marginTop: 30 }}
              data = {this.state.posts}
              renderItem={ ({item}) =>
                  <PostViewer text={item._data.text} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image}/>
              }
              keyExtractor={item => item._ref.id}
              onEndReachedThreshold={10}
              onEndReached={({ distanceFromEnd }) => {
                  this.pullMorePosts();
              }}
              ListFooterComponent={ ({item}) =>
	              <View style={{marginBottom: 70}}>
                      <ActivityIndicator size="large" color="#0000ff" />
                  </View>
              }

          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
	modalContainer: {
    	backgroundColor: 'white',
		height: 500,
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: 3
	},
    deleteImgIcon: {
        width: 20,
        height: 20,
        borderColor: 'black',
        tintColor: 'white',
    },
    fabButtom: {
        width: 60,
        height: 60,
        borderRadius: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#03b1fc',
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 1
    }

});
