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
  PermissionsAndroid
} from 'react-native';

import CameraRoll from "@react-native-community/cameraroll";
import ImagePicker from 'react-native-image-picker';


import heimdallr from "./components/Heimdallr/Heimdallr";

const width = Dimensions.get('screen').width;
import firebase from 'react-native-firebase';
import Post from "./android/app/src/components/Post";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      comment: ''
    };
  }

  // async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
  // }

  collection () {
    console.log('hey');
    heimdallr.getCollection();
  }

  doPost () {
    // console.log(this.state.comment);
    this.savePost();
  }

  savePost () {
    let self = this;
    const params = {};
    params.active = 1;
    params.date = new Date();
    params.text = this.state.comment;
    params.id_user = heimdallr.user_id;
    let result = heimdallr.saveCollection('post', params);
    result.then(function (resolve) {
      console.log('result: ', resolve);
      self.commentInput.clear();
    });
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
          title: 'Select Avatar',
          customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };

            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            this.setState({
              avatarSource: source,
            });
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    return (
      <View>
        <Button
        title="Get collections..."
        color="red"
        onPress={() => this.collection()}
        />
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={text => this.setState({comment: text})}
          placeholder='O que você está pensando?'
          ref={input => this.commentInput = input}
        />
        <TouchableOpacity onPress={this.doPost.bind(this)}>
          <Image
            style={{width: 30, height: 30}}
            source={require('./assets/images/send.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 60, marginRight: 20}} onPress={this.sendImagePropt.bind(this)}>
          <Image
            style={{width: 30, height: 30}}
            source={require('./assets/images/camera-icon.png')}/>
        </TouchableOpacity>
      </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
});
