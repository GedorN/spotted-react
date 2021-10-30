import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';

import {
  Dialog,
  Portal,
  Paragraph,
  Provider
} from 'react-native-paper';
import theme from "../../../../../components/General/Theme";

export default class ImageCatcherPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  hideDialog () {
    console.log("vou fechar")
    this.props.close();
  }
  getUserCamera () {
    this.hideDialog();
    this.props.getUserImage('camera');
  }
  getUserLibrary () {
    this.hideDialog();
    this.props.getUserImage('library');
  }



  render() {
    return (
      <Provider >
        <View>
          <Portal theme={this.props.overlay === false ?  {colors: {backdrop: 'transparent'}} : {}}>
            <Dialog visible={this.props.visible} onDismiss={this.hideDialog.bind(this)}>
              <Dialog.Title>Escolha como pegar a sua imagem</Dialog.Title>
              <Dialog.Content>
                <TouchableOpacity onPress={this.getUserCamera.bind(this)}>
                  <View style={styles.option}>
                    <Text style={styles.optionText} >Câmera</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.getUserLibrary.bind(this)}>
                  <View style={styles.option}>
                    <Text style={styles.optionText} >Biblioteca</Text>
                  </View>
                </TouchableOpacity>
              </Dialog.Content>
              <Dialog.Actions>
                <Button color={theme.primary} onPress={this.hideDialog.bind(this)} title={'Fechar'} />
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  option: {
    padding: 15
  },
  optionText: {
    fontWeight: "200"
  }
})
