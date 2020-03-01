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
import OptionsMenu from 'react-native-options-menu';
import heimdallr from "../Heimdallr/Heimdallr";
import ReportModal from "./ReportModal";
import Modal from "react-native-modal";
import theme from "./Theme";
export default class PostViewer extends React.Component {
  constructor () {
    super ();
    this.state = {
        showModal: false,
    };
  }

  componentDidMount =() =>  {
      console.log('haha: ', this.props);
  }

    toggleModal () {
        this.setState({showModal: !this.state.showModal});
        console.log('opened');
    }

    disableModal () {
        this.setState({showModal: false});
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

  report = (prop) => {
      console.log('Ah eu vou denunciar');
      console.log(prop);
  }

  goToUserProfile = () => {
  	// console.warn(this.props.uid);
	  console.warn('passing: ', this.props.uid);
  	this.props.navigation.navigate('PresentationProfile', {
  		userId: this.props.uid,
    });
  }

  goToComments = () => {
  	this.props.navigation.navigate('PostDetails', {
  		pid: this.props.pid,
    });
  }


  render () {
    return (
      <View style={styles.container}>
          <Modal isVisible={this.state.showModal}
                 onBackButtonPress={this.disableModal.bind(this)}
                 onBackdropPress={this.disableModal.bind(this)}
                 hideModalContentWhileAnimating={true}
          >
              <ReportModal emitClose={this.disableModal}/>
          </Modal>
          <View style={styles.postHeaderUserImage}>
              <TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
                  <UserImgProfile circular height={45} width={45} borderWidth={2} borderColor={theme.primary} uri={this.props.userImage}/>
              </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'column'}}>
              <View style={styles.postHeader}>
                  {/*<View style={styles.postHeaderUserImage}>*/}
                  {/*    <TouchableOpacity onPress={this.goToUserProfile.bind(this)}>*/}
                  {/*        <UserImgProfile circular height={45} width={45} borderWidth={2} borderColor={theme.primary} uri={this.props.userImage}/>*/}
                  {/*    </TouchableOpacity>*/}
                  {/*</View>*/}
                  <TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
                      <Text
                          style={{marginLeft: 16, fontWeight: 'bold'}}
                      >
                          {heimdallr.user_name}
                      </Text>
                  </TouchableOpacity>
                  <View style={{left: width * 0.55}}>
                      <TouchableOpacity
                      >
                          <OptionsMenu
                              button={require('../../assets/images/ellipsis-h-solid.png') }
                              buttonStyle={{ width: 20, height: 20}}
                              options={['Denunciar']}
                              actions={[this.toggleModal.bind(this)]}
                          />
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.body}>
                  <View style={styles.post}>
                      <Text> { this.props.text } </Text>
                      <View>
                          {this.getModalImagesLayout()}
                      </View>
                  </View>
              </View>
              <View style={styles.postFooter}>
                  <View style={{ left: width * 0.7}}>
                      <TouchableOpacity
                          onPress={this.goToComments.bind(this)}
                      >
                          <Image
                              style={{width: 20, height: 20}}
                              source={require('../../assets/images/comment-regular.png') }
                          />
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </View>
    );
  }
}

  const styles = StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 10,
          borderTopWidth: 0.2,
          borderColor: theme.primary,
      },
      body: {
          flexDirection: 'column',
      },
      postHeader: {
          flexDirection: 'row',
          height: 15,
          fontWeight: 'bold',
          alignItems: 'center',
          alignContent: 'center',
          width: width * 0.95,
      },
      postFooter: {
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          width: width * 0.95,
          height: 30,
      },
      postHeaderUserImage: {
          justifyContent: "flex-start",
          alignContent: 'flex-start',
          padding: 0,
          alignItems: 'flex-start',
          height: 30
      },
      post: {
          alignSelf: 'flex-start',
          width: width * 0.7,
          padding: 2,
          marginLeft: 10,
          borderRadius: 8,
          color: 'black',
      }
  });
