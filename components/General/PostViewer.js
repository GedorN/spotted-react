import React from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Dimensions,
	Modal,
	Animated,
} from "react-native";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

import UserImgProfile from "./UserImgProfile";
import OptionsMenu from 'react-native-options-menu';
import heimdallr from "../Heimdallr/Heimdallr";
import ReportModal from "./ReportModal";
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import RBSheet from "react-native-raw-bottom-sheet";
import ReportGod from "../../android/app/src/components/Inputs/ReportGod";
import PostOptions from "../../android/app/src/components/Inputs/PostOptions";

import theme from "./Theme";
import AwesomeAlert from "react-native-awesome-alerts";
import PostDetails from "../../android/app/src/components/PostDetails";
export default class PostViewer extends React.Component {
  constructor () {
    super ();
    this.state = {
        showAlert: false,
	    showImages: false,
	    galleryObj: [],
	    indexImage: 0,
	    opacityValue: 0.7,
	    opacityValueScrolling: 1,
		opacity: new Animated.Value(0),
		reportAlert: true,
    };
  }

  componentDidMount =() =>  {
	  // console.log('haha: ', this.props);
	  if(this.props.uid === heimdallr.user_id){
		  this.setState({reportAlert: false});
	  }

	  if (this.props.images) {
	  	this.props.images.forEach((img) => {
            let images = this.state.galleryObj;
	  		images.push({url: img});
	  		this.setState({ galleryObj: images });
	    })
	  }
  }


  getImageThumb (img) {
  	let splited = img.split('?');
  	return (splited[0] + '_100x100?' + splited[1]);
  }


    disableModal () {
	    this.setState({ showImages: false });
    }


    onLoadImage = event => {
	    Animated.timing(this.state.opacity, {
		    toValue: 1,
		    duration: 300,
	    }).start();
    }

    getModalImagesLayout = () => {
      // console.log('%c calculando...', 'color: green');
    if (this.props.images) {
        console.log('oal', this.props);
    	if (this.props.video) {
		    return (
			    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
				    <View style={{ flexDirection: 'row'}}>
					    <Video
						    resizeMode={'cover'}
						    repeat={true}
						    source={{uri: this.props.images[0]}}
						    style={{width: 280, height: 200, borderRadius: 10}}
					    />
				    </View>
			    </View>
		    )
	    } else if (this.props.images.length === 1) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
              <View style={{ flexDirection: 'row'}}>
	              <View style={{width: width * 0.80, height: 235}}>
		              <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
		              <Image
			              source={{uri: this.getImageThumb(this.props.images[0])}}
			              style={{width: width * 0.80, height: 235, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
			              blurRadius={1}
		              />
		              <Animated.Image
		                  onLoad={this.onLoadImage}
		                  source={{uri: this.props.images[0]}}
		                  style={{width: width * 0.80, height: 235, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
	                  />
	                </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 2) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: width * 0.40, height: 235}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
		                <Image
	                        style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
	                        source={{uri: this.getImageThumb(this.props.images[0])}}
	                        blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[0]}}
			                style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
                </View>
                <View style={{width: width * 0.40, height: 235}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
		                <Image
	                        style={{width: width * 0.39, height: 235,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
	                        source={{uri: this.getImageThumb(this.props.images[1])}}
	                        blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[1]}}
			                style={{width: width * 0.39, height: 235,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 3) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: width * 0.40, height: 235}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
		                <Image
		                    style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
		                    source={{uri: this.getImageThumb(this.props.images[0])}}
		                    blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[0]}}
			                style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'column'}}>
	                <View style={{width: width * 0.40, height: 116}}>
		                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
			                <Image
		                        style={{width: width * 0.39, height: 116,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
		                        source={{uri: this.getImageThumb(this.props.images[1])}}
		                        blurRadius={1}
			                />
			                <Animated.Image
				                onLoad={this.onLoadImage}
				                source={{uri: this.props.images[1]}}
				                style={{width: width * 0.39, height: 116,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
			                />
		                </TouchableOpacity>
	                </View>
	                <View style={{width: width * 0.40, height: 116}}>
		                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
			                <Image
		                        style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
		                        source={{uri: this.getImageThumb(this.props.images[2])}}
		                        blurRadius={1}
			                />
			                <Animated.Image
				                onLoad={this.onLoadImage}
				                source={{uri: this.props.images[2]}}
				                style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
			                />
		                </TouchableOpacity>
	                </View>
                </View>
              </View>
            </View>
          )
        } else if (this.props.images.length === 4) {
          return (
            <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
              <View style={{ flexDirection: 'row'}}>
                <View style={{width: width * 0.40, height: 116}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
		                <Image
	                        style={{width: width * 0.39, height: 116, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
	                        source={{uri: this.getImageThumb(this.props.images[0])}}
	                        blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[0]}}
			                style={{width: width * 0.39, height: 116, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
                </View>
                <View style={{width: width * 0.40, height: 116}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
		                <Image
	                        style={{width: width * 0.39, height: 116, borderTopRightRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
	                        source={{uri: this.getImageThumb(this.props.images[1])}}
	                        blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[1]}}
			                style={{width: width * 0.39, height: 116, borderTopRightRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row',  marginTop: 5}}>
                <View style={{width: width * 0.40, height: 116}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
		                <Image
	                        style={{width: width * 0.39, height: 116,  borderBottomLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
	                        source={{uri: this.getImageThumb(this.props.images[2])}}
	                        blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[2]}}
			                style={{width: width * 0.39, height: 116,  borderBottomLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
                </View>
                <View style={{width: width * 0.40, height: 100}}>
	                <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 3 })}}>
		                <Image
	                        style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
	                        source={{uri: this.getImageThumb(this.props.images[3])}}
	                        blurRadius={1}
		                />
		                <Animated.Image
			                onLoad={this.onLoadImage}
			                source={{uri: this.props.images[3]}}
			                style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
		                />
	                </TouchableOpacity>
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
      console.log(prop);
  }

  goToUserProfile = () => {
  	this.props.navigation.push('UserProfile', {
  		userId: this.props.uid,
    });
  }

  goToComments = () => {
	this.props.navigation.push('PostDetails', {
	pid: this.props.pid,
	userImage: this.props.userImage,
	anonymous: this.props.anonymous?this.props.anonymous:'0',
	userId: this.props.uid,
    });
  }

	closeAlert = () => {
		this.RBSheet.close();
		this.props.closeAlert();
	}

	deletePost = () => {
		this.RBSheet.close();
		this.props.confirmPostRm(this.props.pid);
	}

  render () {
    return (
	    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={this.goToComments.bind(this)}>
			<View style={styles.container}>
				  <Modal
					  visible={this.state.showImages}
					  transparent={true}
					  onRequestClose={() => {
						  this.disableModal();
					  }}
				  >
					  <ImageViewer
						  imageUrls={this.state.galleryObj}
						  index={this.state.indexImage}
						  swipeDownThreshold={0.5}
						  enableSwipeDown={true}
						  onSwipeDown={() => {this.setState({ showImages: false })}}
					  />
				  </Modal>
			  <View style={styles.postHeaderUserImage}>
			      <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={this.props.anonymous?(this.props.anonymous == '0'?this.goToUserProfile.bind(this):null):this.goToUserProfile.bind(this)}>
			          <UserImgProfile circular height={45} width={45} uri={this.props.userImage}/>
			      </TouchableOpacity>
			  </View>
				<View style={{flexDirection: 'column'}}>
					<View style = {{flexDirection: 'row'}}>
						<View style={styles.postHeader}>
							<View style={{ flexDirection: 'row', alignItems: 'center'}}>
								<TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={this.props.anonymous?(this.props.anonymous == '0'?this.goToUserProfile.bind(this):null):this.goToUserProfile.bind(this)}>
										<Text
												style={{marginLeft: 16,marginTop:35, fontWeight: 'bold'}}
										>
												{this.props.user}
										</Text>
								</TouchableOpacity>
								{
									this.props.elapsed_time &&
									<Image
										style={{width: 4, height: 4, marginLeft: 4, marginRight: 4, marginTop:35, opacity:0.7}}
										source={require('../../assets/images/circle-solid.png') }
									/>
								}
									<Text style= {{marginTop:35}}>
										{ this.props.elapsed_time }
									</Text>
							</View>
						</View>
						<TouchableOpacity
								style = {{width:theme.width * 0.14, alignSelf:'flex-end',height:theme.width * 0.08,flexDirection:'column',justifyContent:'flex-end'}}
								onPress={() => this.RBSheet.open()}>
								<View
									style={{width: 40, height: theme.height * 0.1, zIndex: 9999, alignItems: 'flex-end', justifyContent: 'flex-end'}}
								>
									<Image
										style={{width: 20, height: 12}}
										source={require('../../assets/images/ellipsis-h-solid.png')}
									/>
								</View>
						</TouchableOpacity>
					</View>
			      <View style={styles.body}>
			          <View style={styles.post}>
			              <Text style = {{marginBottom:this.props.images.length === 1? 15 : 0}}>{this.props.text}</Text>
			              <View style = {{ height: this.getModalImagesLayout()? 230:0}}>
			                  {this.getModalImagesLayout()}
			              </View>
			          </View>
			      </View>
			      <View style={styles.postFooter}>
			          <View style={{ left: 20, opacity: 0.7}}>
			              <TouchableOpacity
			                  onPress={this.goToComments.bind(this)}
			              >
			                  <Image
			                      style={{width: 17, height: 17, marginTop:10}}
			                      source={require('../../assets/images/comment-regular.png') }
			                  />
			              </TouchableOpacity>
			          </View>
			      </View>
			    </View>
			</View>
		    <RBSheet
			    ref={ref => {
				    this.RBSheet = ref;
			    }}
			    height={this.state.reportAlert ? 300 : 150}
			    animationType={'slide'}
			    duration={250}
		    >
			    {/*<ReportGod  close={this.closeAlert.bind(this)}  idEntity = {this.props.pid} typeEntity = {'post'} userId = {this.props.uid}/>*/}
			    <PostOptions deletePost={this.deletePost.bind(this)} close={this.closeAlert.bind(this)} typeEntity={'post'} userId={this.props.uid}/>
		    </RBSheet>
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
					marginTop:10,
      },
      postHeader: {
        justifyContent: 'space-between',
        flexDirection: 'row',
				height: 15,
				fontWeight: 'bold',
				alignItems: 'center',
				alignContent: 'center',
				width: width * 0.70,
      },
      postFooter: {
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          width: width * 0.95,
	      height: 40,
	      zIndex: 99,

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
      },
	  reportModal: {
      	width: width,
	    height: height / 4,
	  }
  });
