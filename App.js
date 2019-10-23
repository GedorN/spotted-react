import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import Home from './android/app/src/components/Home';
const width = Dimensions.get('screen').width;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      postText: '',
      postImages: [],
    };
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity>
              <Image source={require('./assets/images/bars-solid.png')} style={{width: 30, height: 30, tintColor: 'white'}}/>
          </TouchableOpacity>
          <Text style={{color: 'white', fontSize: 24, marginLeft: 100}}>
            Spotted
          </Text>
        </View>
        <Home/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    width: width,
    height: 40,
    backgroundColor: 'red',
    color: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
    paddingHorizontal: 10
  }
});
