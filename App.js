import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text
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
          <Text style={{color: 'white', fontSize: 24}}>
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
    justifyContent: 'center',
    alignItems: 'center'
  }
});
