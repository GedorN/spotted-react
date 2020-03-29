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
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: 280, height: 200}}>
                  <Image
                    source={{uri: this.props.images[0]}}
                    style={{width: 280, height: 200, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 2) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row', marginBottom: 5}}>
                <View style={{width: 140, height: 200}}>
                  <Image
                    source={{uri: this.props.images[0]}}
                    style={{width: 139, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
                <View style={{width: 140, height: 200}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 139, height: 200,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 3) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: 140, height: 200}}>
                  <Image
                    source={{uri: this.props.images[0]}}
                    style={{width: 140, height: 200, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
                <View style={{flexDirection: 'column'}}>
	                <View style={{width: 140, height: 100}}>
	                  <Image
	                    source={{uri: this.props.images[1]}}
	                    style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
	                  />
	                </View>
	                <View style={{width: 140, height: 99}}>
	                  <Image
	                    source={{uri: this.props.images[2]}}
	                    style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
	                  />
	                </View>
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 4) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: 140, height: 100}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 139, height: 99, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
                <View style={{width: 140, height: 100}}>
                  <Image
                    source={{uri: this.props.images[1]}}
                    style={{width: 139, height: 99, borderBottomLeftRadius: 10, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row',  marginBottom: 5}}>
                <View style={{width: 140, height: 100}}>
                  <Image
                    source={{uri: this.props.images[2]}}
                    style={{width: 139, height: 99,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
                  />
                </View>
                <View style={{width: 140, height: 100}}>
                  <Image
                    source={{uri: this.props.images[3]}}
                    style={{width: 139, height: 99, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
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
	    userImage: this.props.userImage,
    });
  }


  render () {
    return (
	    <TouchableOpacity onPress={this.goToComments.bind(this)}>
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
	    </TouchableOpacity>
    );
  }
}

  const styles = StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 10,
          borderTopWidth: 0.2,
          borderColor: 'rgba(59, 56, 50, 0.2)',
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
