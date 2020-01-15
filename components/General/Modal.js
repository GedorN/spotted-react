/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React  from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';

export default class Example extends React.Component {
  state = {
    modal: false
  }

  toggle () {
    this.setState({modal: !this.state.modal});
    console.log('opened');
  }

  disableModal () {
    this.setState({modal: false});
  }

  renderModalContent () {
    return (
      <View style={{backgroundColor: 'red'}}>
          <Text style={styles.contentTitle}>Hi 👋!</Text>
        <Button
          onPress={() => this.setState({ visibleModal: null })}
          title="Close"
        />
      </View>
      )
}
  render () {
    return (
      <View>
        <TouchableOpacity >
          <Button title={'clcik'} onPress={this.toggle.bind(this)}/>
        </TouchableOpacity>
        <Modal isVisible={this.state.modal}
               onBackButtonPress={this.disableModal.bind(this)}
               onBackdropPress={this.disableModal.bind(this)}
        >
          <View style={{backgroundColor: 'white', height: 500 }}>
            <Text>I am the modal content!</Text>
            <TouchableOpacity >
              <Button title={'clcik'} onPress={this.toggle.bind(this)}/>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  scrollableModal: {
    height: 300,
  },
  scrollableModalContent1: {
    height: 200,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText1: {
    fontSize: 20,
    color: 'white',
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: '#A9DCD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText2: {
    fontSize: 20,
    color: 'white',
  },
  customBackdrop: {
    flex: 1,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
  },
  customBackdropText: {
    marginTop: 10,
    fontSize: 17,
  },
});
