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

  getModalImagesLayout = () => {
      console.log('%c calculando...', 'color: green');
    if (this.props.images) {

        if (this.props.images.length === 1) {
          return (
            <View>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: 317, height: 350}}>
                  <Image
                    source={{uri: this.props.images[0]}}
                    style={{width: 317, height: 350}}
                  />
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 2) {
          return (
            <View>
              <View style={{ flexDirection: 'row', marginBottom: 5}}>
                <View style={{width: 160, height: 250, backgroundColor: 'yellow'}}>
                  <Image
                    source={{uri: this.props.images[0]}}
                    style={{width: 160, height: 250}}
                  />
                </View>
                <View style={{width: 160, height: 250, backgroundColor: 'purple'}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 160, height: 250}}
                  />
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 3) {
          return (
            <View>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: 160, height: 100, backgroundColor: 'yellow'}}>
                  <Image
                    source={{uri: this.props.images[0]}}
                    style={{width: 160, height: 100}}
                  />
                </View>
                <View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 160, height: 100}}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row',  marginBottom: 5}}>
                <View style={{width: 320, height: 100, backgroundColor: 'pink'}}>
                  <Image
                    source={{uri: this.props.images[2]}}
                    style={{width: 320, height: 100}}
                  />
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 4) {
          return (
            <View>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: 160, height: 100, backgroundColor: 'yellow'}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 160, height: 100}}
                  />
                </View>
                <View style={{width: 160, height: 100, backgroundColor: 'purple'}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 160, height: 100}}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row',  marginBottom: 5}}>
                <View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
                  <Image
                    source={{uri: this.props.images[2]}}
                    style={{width: 160, height: 100}}
                  />
                </View>
                <View style={{width: 160, height: 100, backgroundColor: 'pink'}}>
                  <Image
                    source={{uri: this.props.images[3]}}
                    style={{width: 160, height: 100}}
                  />
                </View>
              </View>
            </View>
          )
        }
    } else {
        return ;
    }
  }

  getT = () => {
      return (
          <Text>hahah</Text>
      );
  }


  render () {
    return (
      <View style={styles.container}>
          <View style={{marginTop: 5}}>
              <UserImgProfile circular height={55} width={55} uri={'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/teste?alt=media&token=69a7d809-ca9f-4b62-870d-3cae93aa98a4'}/>
          </View>
          <View style={styles.body}>
              <TouchableOpacity
                  style={{alignSelf: 'flex-end', marginRight: 10}}
              >
                  <Image
                      style={{width: 20, height: 20}}
                      source={require('../../assets/images/ellipsis-h-solid.png') }
                  />
              </TouchableOpacity>
              <View style={styles.post}>
                  <Text style={{color: 'white'}}> { this.props.text } </Text>
                  <View>
                      {/*{this.getModalImagesLayout()}*/}
                  </View>
              </View>
              <TouchableOpacity
                  style={{alignSelf: 'flex-end', marginRight: 25, marginTop: 8}}
              >
                  <Image
                      style={{width: 20, height: 20}}
                      source={require('../../assets/images/comment-regular.png') }
                  />
              </TouchableOpacity>
          </View>
      </View>
    );
  }
}

  const styles = StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: 10,
          padding: 10,
      },
      body: {
          flexDirection: 'column',
      },
      post: {
          backgroundColor: 'green',
          alignSelf: 'center',
          width: width * 0.7,
          padding: 10,
          marginLeft: 10,
          borderRadius: 8
      }
  });
