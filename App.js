import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Button
} from 'react-native';

import Home from './android/app/src/components/Home';
import MenuDrawer from "react-native-side-drawer";
import heimdallr from "./components/Heimdallr/Heimdallr";
const width = Dimensions.get('screen').width;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      postText: '',
      postImages: [],
      open: false,
    };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  openModal = () => {
    this.setState({open: true});
  }

  closeModal = () => {
    this.setState({open: false});
  }

  drawerContent = () => {
    return (
      <TouchableOpacity onPress={this.closeModal.bind(this)} style={styles.animatedBox}>
        <Text>Close</Text>
      </TouchableOpacity>
    );
          //TODO tirar margem do topo
  };


  render() {
    return (
        <View style={styles.container}>
          <MenuDrawer
            open={this.state.open}
            drawerContent={this.drawerContent()}
            drawerPercentage={60}
            animationTime={250}
            overlay={true}
            opacity={0.4}
            style={{margin: 0, padding: 0, width: 0, height: 0, display: 'none'}}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={this.openModal.bind(this)}>
                  <Image source={require('./assets/images/bars-solid.png')} style={{width: 30, height: 30, tintColor: 'white'}}/>
              </TouchableOpacity>
              <Text style={{color: 'white', fontSize: 24, marginLeft: 100}}>
                Spotted
              </Text>
            </View>
            <View>
              <Home/>
            </View>
          </MenuDrawer>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 0,
    margin: 0,
    flex: 1,
    zIndex: 0,
    // backgroundColor:'blue'
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
    margin: 0,
    paddingHorizontal: 10,
  },
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
  },
  body: {
    flex: 1,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812'
  }
});
