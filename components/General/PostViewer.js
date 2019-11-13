import React from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Dimensions
} from "react-native";

const width = Dimensions.get('screen').width;
import UserImgProfile from "./UserImgProfile";
export default class PostViewer extends React.Component {
  constructor () {
    super ();
    this.state = {

    };
  }

  getModalImagesLayout() {
    if (this.state.postImages.length === 1) {
      return (
        <View>
          <View style={{ flexDirection: 'row'}}>
            <View style={{width: 317, height: 350}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[0]}}
                style={{width: 317, height: 350}}
              />
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
            </View>
            <View style={{width: 160, height: 250, backgroundColor: 'purple'}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[1]}}
                style={{width: 160, height: 250}}
              />
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
            </View>
            <View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[1]}}
                style={{width: 160, height: 100}}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row',  marginBottom: 5}}>
            <View style={{width: 320, height: 100, backgroundColor: 'pink'}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[2]}}
                style={{width: 320, height: 100}}
              />
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
            </View>
            <View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[1]}}
                style={{width: 160, height: 100}}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row',  marginBottom: 5}}>
            <View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[2]}}
                style={{width: 160, height: 100}}
              />
            </View>
            <View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
              <Image
                source={{uri: 'file://' + this.state.postImages[3]}}
                style={{width: 160, height: 100}}
              />
            </View>
          </View>
        </View>
      )
    } else {
      return ;
    }
  }


  render () {
    return (
      <View >
          <View style={styles.container}>
              <UserImgProfile circular height={40} width={40} uri={'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4'}/>
              <View style={styles.post}>
                  <Text style={{color: 'white'}}> { this.props.text } </Text>
              </View>
          </View>
      </View>
    );
  }
}

  const styles = StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          padding: 10,
      },
      post: {
          backgroundColor: 'green',
          width: width * 0.7,
          padding: 10,
          marginLeft: 10,
          borderRadius: 8
      }
  });
