import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Dimensions,
	Image,
	Modal,
	Animated,
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
import RBSheet from "react-native-raw-bottom-sheet";
import PostOptions from "./Inputs/PostOptions";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';



const width = Dimensions.get('screen').width;

export default class CommentaryViewer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			reportAlert: true,
			showAlert: false,
			showImages: false,
			galleryObj: [],
			indexImage: 0,
			opacityValue: 0.7,
			opacityValueScrolling: 1,
			opacity: new Animated.Value(0),
			liked: false,
			likes: 0,
		};
	}



	componentDidMount = () => {
		if(this.props.user_id === heimdallr.user_id){
			this.setState({reportAlert: false})
		}

		this.state.likes = this.props.likes;
		const liked = this.props.liked_by && this.props.liked_by.indexOf(heimdallr.user_id) !== - 1 ? true : false;
		this.setState({ liked: liked });

		if (this.props.images) {
			this.props.images.forEach((img) => {
			  let images = this.state.galleryObj;
				if (this.props.newComment) {
					images.push({url: 'file://' + img });
				} else {
					images.push({url: img});
				}
				this.setState({ galleryObj: images });
		  })
		}
	}

	goToUserProfile = () => {
		 this.props.navigation.push('UserProfile', {
			userId: this.props.user_id,
		});

	}

	return = () => {
		this.props.navigation.goBack();
	}

	deletePost = (cid) => {
		this.RBSheet.close();
		this.props.deleteCommentary(cid);
	}

	closeAlert = () => {
		this.RBSheet.close();
		this.props.commentaryCallback();
	}

	getImageThumb (img) {
		let splited = img.split('?');
		return (splited[0] + '_100x100?' + splited[1]);
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
	  	if (this.props.newComment) {
		    if (this.props.video) {
			    return (
				    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					    <View style={{ flexDirection: 'row', width: width * 0.75, height: 230}}>
						    <Video
							    resizeMode={'cover'}
							    repeat={true}
							    source={{uri: this.props.images[0]}}
							    style={{width: width * 0.75, height: 230, borderRadius: 10}}
						    />
					    </View>
				    </View>
			    )
		    } else if (this.props.gif) {
			    return (
				    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
					    <View style={{ flexDirection: 'row'}}>
						    <View style={{width: width * 0.75, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    source={{uri: this.props.images[0]}}
									    resizeMode={'cover'}
									    style={{width: width * 0.75, height: 230, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)', overlayColor: 'white'}}
								    />
							    </TouchableOpacity>
						    </View>
					    </View>
				    </View>
			    )
		    } else if (this.props.images.length === 1) {
			    return (
				    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
					    <View style={{ flexDirection: 'row'}}>
						    <View style={{width: width * 0.75, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    source={{uri: 'file://' + this.props.images[0]}}
									    style={{width: width * 0.75, height: 230, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    blurRadius={1}
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
						    <View style={{width: width * 0.37, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    style={{width: width * 0.37, height: 230, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[0]}}
									    blurRadius={1}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{width: width * 0.37, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
								    <Image
									    style={{width: width * 0.37, height: 230,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 1, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[1]}}
									    blurRadius={1}
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
						    <View style={{width: width * 0.37, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    style={{width: width * 0.37, height: 230, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[0]}}
									    blurRadius={1}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{flexDirection: 'column'}}>
							    <View style={{width: width * 0.37, height: 115}}>
								    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
									    <Image
										    style={{width: width * 0.37, height: 115,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
										    source={{uri: 'file://' + this.props.images[1]}}
										    blurRadius={1}
									    />
								    </TouchableOpacity>
							    </View>
							    <View style={{width: width * 0.37, height: 115}}>
								    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
									    <Image
										    style={{width: width * 0.37, height: 115, borderBottomRightRadius: 10, marginLeft: 1, marginTop: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
										    source={{uri: 'file://' + this.props.images[2]}}
										    blurRadius={1}
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
						    <View style={{width: width * 0.37, height: 115}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[0]}}
									    blurRadius={1}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{width: width * 0.37, height: 115}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115, borderTopRightRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[1]}}
									    blurRadius={1}
								    />
							    </TouchableOpacity>
						    </View>
					    </View>
					    <View style={{ flexDirection: 'row'}}>
						    <View style={{width: width * 0.37, height: 115}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115,  borderBottomLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[2]}}
									    blurRadius={1}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{width: width * 0.37, height: 100}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 3 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115, borderBottomRightRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: 'file://' + this.props.images[3]}}
									    blurRadius={1}
								    />
							    </TouchableOpacity>
						    </View>
					    </View>
				    </View>
			    )
		    }
	    } else {
		    if (this.props.video) {
			    return (
				    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
					    <View style={{ flexDirection: 'row', width: width * 0.75, height: 230}}>
						    <Video
							    resizeMode={'cover'}
							    repeat={true}
							    source={{uri: this.props.images[0]}}
							    style={{width: width * 0.75, height: 230, borderRadius: 10}}
						    />
					    </View>
				    </View>
			    )
		    } else if (this.props.gif) {
			    return (
				    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
					    <View style={{ flexDirection: 'row'}}>
						    <View style={{width: width * 0.75, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    source={{uri: this.props.images[0]}}
									    resizeMode={'cover'}
									    style={{width: width * 0.75, height: 230, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)', overlayColor: 'white'}}
								    />
							    </TouchableOpacity>
						    </View>
					    </View>
				    </View>
			    )
		    } else if (this.props.images.length === 1) {
			    return (
				    <View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
					    <View style={{ flexDirection: 'row'}}>
						    <View style={{width: width * 0.75, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    source={{uri: this.getImageThumb(this.props.images[0])}}
									    style={{width: width * 0.75, height: 230, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[0]}}
									    style={{width: width * 0.75, height: 230, borderRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
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
						    <View style={{width: width * 0.37, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    style={{width: width * 0.37, height: 230, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[0])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[0]}}
									    style={{width: width * 0.37, height: 230, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{width: width * 0.37, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
								    <Image
									    style={{width: width * 0.37, height: 230,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 1, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[1])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[1]}}
									    style={{width: width * 0.37, height: 230,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
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
						    <View style={{width: width * 0.37, height: 230}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    style={{width: width * 0.37, height: 230, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[0])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[0]}}
									    style={{width: width * 0.37, height: 230, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{flexDirection: 'column'}}>
							    <View style={{width: width * 0.37, height: 115}}>
								    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
									    <Image
										    style={{width: width * 0.37, height: 115,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
										    source={{uri: this.getImageThumb(this.props.images[1])}}
										    blurRadius={1}
									    />
									    <Animated.Image
										    onLoad={this.onLoadImage}
										    source={{uri: this.props.images[1]}}
										    style={{width: width * 0.37, height: 115,  borderTopRightRadius: 10, marginLeft: 1, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
									    />
								    </TouchableOpacity>
							    </View>
							    <View style={{width: width * 0.37, height: 115}}>
								    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
									    <Image
										    style={{width: width * 0.37, height: 115, borderBottomRightRadius: 10, marginLeft: 1, marginTop: 2, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
										    source={{uri: this.getImageThumb(this.props.images[2])}}
										    blurRadius={1}
									    />
									    <Animated.Image
										    onLoad={this.onLoadImage}
										    source={{uri: this.props.images[2]}}
										    style={{width: width * 0.37, height: 115, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
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
						    <View style={{width: width * 0.37, height: 115}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[0])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[0]}}
									    style={{width: width * 0.37, height: 115, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{width: width * 0.37, height: 115}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115, borderTopRightRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[1])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[1]}}
									    style={{width: width * 0.37, height: 115, borderTopRightRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
								    />
							    </TouchableOpacity>
						    </View>
					    </View>
					    <View style={{ flexDirection: 'row'}}>
						    <View style={{width: width * 0.37, height: 115}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115,  borderBottomLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[2])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[2]}}
									    style={{width: width * 0.37, height: 115,  borderBottomLeftRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
								    />
							    </TouchableOpacity>
						    </View>
						    <View style={{width: width * 0.37, height: 100}}>
							    <TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue} onPress={() => {this.setState({ showImages: true, indexImage: 3 })}}>
								    <Image
									    style={{width: width * 0.37, height: 115, borderBottomRightRadius: 10, borderWidth: 0.1, borderColor: 'black', backgroundColor: 'rgba(217, 217, 217, 0.5)'}}
									    source={{uri: this.getImageThumb(this.props.images[3])}}
									    blurRadius={1}
								    />
								    <Animated.Image
									    onLoad={this.onLoadImage}
									    source={{uri: this.props.images[3]}}
									    style={{width: width * 0.37, height: 115, borderBottomRightRadius: 10, borderWidth: 0.1, borderColor: 'black', opacity: this.state.opacity, position: 'absolute'}}
								    />
							    </TouchableOpacity>
						    </View>
					    </View>
				    </View>
			    )
		    }
	    }
	  } else {
		  return ;
	  }
	}

	disableModal () {
		this.setState({ showImages: false });
	}

	reportPost = () => {
		this.RBSheet.close();
		this.props.navigation.navigate('ReportScreen', {
			pid: this.props.pid,
			cid: this.props.cid,
			entity: 'commentary',
		});
	}

	likeIt = () => {
		if (this.state.liked) {
			heimdallr.dislikeCommentary(this.props.cid);
			this.setState({ liked: false, likes: this.state.likes -1 });
		} else {
			heimdallr.likeCommentary(this.props.cid);
			this.setState({ liked: true, likes: this.state.likes ? this.state.likes + 1 : 1});
		}
	}

  redirectToTaggedUser (user) {
    this.props.navigation.navigate('UserProfile', {
      userId: user.uid,
    });
  }

  renderPostText (text) {
    try {
      if (this.props.taggedUsers) {
        let words = text.split(' ');
        let p_index= 0;
        let element = <Text style = {{marginBottom:this.props.images.length === 1? 15 : 0}} > {words.map((w) => {
          if (w !== '@%') {
            return  <Text style = {{marginBottom:this.props.images.length === 1? 15 : 0}}>{w} </Text>
          } else {
            if (this.props.taggedUsers[p_index]) {
              const user = this.props.taggedUsers[p_index]
              return (
                <Text
                  style = {{marginBottom:this.props.images.length === 1? 15 : 0, color: theme.primary, fontWeight: "bold", zIndex: 10}}
                  onPress={() => this.redirectToTaggedUser(user)}
                >
                  @{this.props.taggedUsers[p_index++].name}
                </Text>
              )
            } else {
              return  <Text style = {{marginBottom:this.props.images.length === 1? 15 : 0}}>{w} </Text>
            }
          }
        })} </Text>
        return (
          element
        )
      }
      return (
        <Text style = {{marginBottom:this.props.images.length === 1? 15 : 0}}>
          {text}
        </Text>
      );
    } catch (e) {
      console.log(e);
      return (
        <Text style = {{marginBottom:this.props.images.length === 1? 15 : 0}}>
          {text}
        </Text>
      )
    }

  }


	render = () => {
		return (
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
				<View style={styles.body}>
					<View style = {{flexDirection:'row'}}>
						<TouchableOpacity  onPress={this.props.anonymous? null : this.goToUserProfile.bind(this)}>
							<UserImgProfile circular marginBottom={5} height={45} width={45} uri={this.props.userImage ? this.props.userImage : null}/>
						</TouchableOpacity>
						<View style={{ width: theme.width * 0.8, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
							<View style = {{flexDirection:'row',alignItems: 'center'}}>
								<Text style={styles.userNameText}>
									{this.props.user_name}
								</Text>
								{this.props.elapsed_time &&
								<Image
									style={{width: 4, height: 4, marginLeft: 4, marginRight: 4,opacity:0.7}}
									source={require('../../../../assets/images/circle-solid.png') }
								/>
								}
								<Text style= {{flexWrap: 'wrap'}}>
									{ this.props.elapsed_time }
								</Text>
							</View>
							<TouchableOpacity style = {{justifyContent:'center', width:theme.width * 0.1,height:theme.height * 0.07}} onPress={() => this.RBSheet.open()}>
										<View style={{width: 40, height: 20, zIndex: 9999,alignItems: 'flex-end',marginRight:theme.width*0.010,alignSelf:'flex-end'}}>
											<Image
												style={{width: 20, height: 12,marginTop:5}}
												source={require('../../../../assets/images/ellipsis-h-solid.png')}
											/>
										</View>
							</TouchableOpacity>
						</View>

					</View>
					{
						this.props.text != '' &&
						<View style={{width: theme.width * 0.75,flexWrap:'wrap',alignItems:'flex-start',alignSelf:'flex-end'}}>
              { this.renderPostText(this.props.text) }
						</View>

					}
					{
						this.props.images && this.props.images.length > 0 &&
						<View style = {{ height: this.getModalImagesLayout()? 230:0, marginBottom: 5, width: theme.width * 0.75, alignSelf: 'flex-end', paddingBottom: 10, paddingTop: 10 }}>
			                  {this.getModalImagesLayout()}
			        	</View>

					}
				<View style={{width: theme.width * 0.75, flexWrap:'wrap', alignItems:'flex-start', alignSelf:'flex-end', flexDirection: 'row', marginTop: 10}}>
					{
						heimdallr.email !== 'spotted@utfpr.com' &&
						<TouchableOpacity
							style={{flexDirection: 'row'}}
							onPress={this.likeIt.bind(this)}
						>
							<Image
								style={{width: 17, height: 17, marginTop:10, alignSelf: 'flex-start', marginLeft: 4}}
								source={this.state.liked ? require('../../../../assets/images/s2-checked.png') : require('../../../../assets/images/s2.png') }
							/>
							{
								this.state.likes > 0 &&
								<Text style={{alignSelf: 'flex-end'}}> {this.state.likes} </Text>
							}
						</TouchableOpacity>
					}
					</View>
				</View>
				<RBSheet
					ref={ref => {
						this.RBSheet = ref;
					}}
					height={150}
					animationType={'slide'}
					duration={250}
				>
					{/*<ReportGod  close={this.closeAlert.bind(this)} idEntity = {this.props.cid} typeEntity = {'comentario'} pid = {this.props.pid} userId = {this.props.user_id}/>*/}
					<PostOptions  deletePost={this.deletePost.bind(this)} close={this.closeAlert.bind(this)} idEntity = {this.props.cid} typeEntity = {'comentario'} pid = {this.props.pid} userId = {this.props.user_id} report={this.reportPost.bind(this)}/>
				</RBSheet>
			</View>
		);
	}
}

const styles  = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 20,
		borderColor: 'rgba(59, 56, 50, 0.2)',
		borderBottomWidth: 0.18,
		backgroundColor: 'white'
	},
	body: {
		flexDirection: 'column',
		marginBottom:theme.height * 0.02,
	},
	userNameText: {
		fontWeight: 'bold',
		marginLeft: 16,

	},
});
