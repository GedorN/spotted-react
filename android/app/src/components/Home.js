import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  FlatList,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';

import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
const width = Dimensions.get('screen').width;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postText: '',
      postImages: [],
    };
  }

  // async componentDidMount() {
  // TODO: You: Do firebase things
  // const { user } = await firebase.auth().signInAnonymously();
  // console.warn('User -> ', user.toJSON());

  // await firebase.analytics().logEvent('foo', { bar: '123'});
  // }

  collection() {
    console.log('hey');
    heimdallr.getCollection();
  }

  doPost() {
    console.log('aqui');
    // console.log(this.state.postText);
    /* if have unless one photo in post */
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
      console.log('without image');
      this.savePost(1);
    }
  }

  savePost(sendedImages) {
    console.log('Semaphore: ', sendedImages);
    if (sendedImages >= 1) {
      let self = this;
      const params = {};
      params.active = 1;
      params.date = new Date();
      params.text = this.state.postText;
      params.id_user = heimdallr.user_id;
      params.images = this.state.postImages;
      let result = heimdallr.saveCollection('post', params);
      result.then(function(resolve) {
        console.log('result: ', resolve);
        self.postTextInput.clear();
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
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        // More info on all the options is below in the API Reference... just some common use cases shown here
        const options = {
          title: 'Enviar imagem',
          takePhotoButtonTitle: 'Tirar foto',
          chooseFromLibraryButtonTitle: 'Pegar do celular',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            console.log('caiu aqui');
            // this.state.postImages.push(response.path);
            // const source = { uri: response.uri };

            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            // this.state.postImages.push('file://' + response.path);
            let images = this.state.postImages;
            images.push('file://' + response.path);
            this.setState({postImages: images});
            console.log('daqui não: ', this.state.postImages);
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getImages() {
    // console.log('data: ', this.state.postImages);
    // console.log('só não tá indo mesmo');
    // return (
    //   this.state.postImages.forEach((img) => {
    //     console.log('img: ', img);
    //     <Image source={{uri: (img)}} style={{width: 100, height: 100}} />
    //   })
    // )
    return (
      <View>
        <Image
          source={{
            uri:
              'file:///storage/emulated/0/Screenshots/Screenshot_20190919-174930.jpg',
          }}
          style={{width: 40, height: 40}}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <Button
          title="Get collections..."
          color="red"
          onPress={() => this.collection()}
        />
        <View style={{flex: 1, flexDirection: 'column',  marginTop: 20, padding: 5}}>
          <View style={{flexDirection: 'row'}}>
            <UserImgProfile circular/>
            <TextInput
              style={{height: 80, borderColor: 'gray', borderWidth: 1, marginLeft: 10}}
              onChangeText={text => this.setState({postText: text})}
              placeholder="O que você está pensando?"
              ref={input => (this.postTextInput = input)}
            />
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <TouchableOpacity onPress={this.doPost.bind(this)}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../../../assets/images/send.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 60, marginRight: 20}}
                onPress={this.sendImagePropt.bind(this)}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../../../assets/images/camera-icon.png')}
                />
              </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={this.state.postImages}
          keyExtractor={item => item.toString()}
          extraData={this.state}
          renderItem={({item}) => (
            <Image
              source={{uri: 'file://' + item}}
              style={{width: 100, height: 100}}
            />
          )}
        />
        {/*{this.getImages.bind(this)}*/}
        {/*<Image*/}
        {/*  source={{*/}
        {/*    uri:*/}
        {/*      'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/img1568170440313?alt=media&token=af1f89dd-3553-400d-883a-7caaf23970ac',*/}
        {/*  }}*/}
        {/*  style={{width: 40, height: 40}}*/}
        {/*/>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
