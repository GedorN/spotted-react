import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Home from './android/app/src/components/Home';


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
        <Home/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
