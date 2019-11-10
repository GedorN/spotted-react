import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";

export default class App extends React.Component {
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

  render () {
    return (
      <View>
        <Text>heeeey</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({

  });
}
