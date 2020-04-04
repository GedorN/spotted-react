import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    PermissionsAndroid,
    FlatList,
    ActivityIndicator,
	RefreshControl,
} from 'react-native';

const images = [{
	// Simplest usage.
	url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

	// width: number
	// height: number
	// Optional, if you know the image size, you can set the optimization performance

	// You can pass props to <Image />.
	props: {
		// headers: ...
	}
}]

import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import UUIDGenerator from 'react-native-uuid-generator';
const width = Dimensions.get('screen').width;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        posts: null,
        pulledPosts: 10,
        loading: false,
	    pulling: false,
	    endPulling: false,
	    isRefreshing: false,
	    scrolling: false,
    };
  }

  componentDidMount = () => {
  	let result = heimdallr.getCollection('post', this.state.pulledPosts);
  	result.then( (resolve) => {
  		console.log('peguei esses caras aqui', resolve);
  		this.setState({ posts: resolve });
  	});
  }

  pullMorePosts = (distanceFromEnd) => {
  	if (!this.state.endPulling) {
	    console.log('interval?', distanceFromEnd);
	    console.log('state before: ', this.state);
	    if (!this.state.pulling) {
	        console.log('int pullling');
	        this.setState({ pulling: true });
		    console.log('chegou');
		    let n = this.state.pulledPosts;
		    n = 5 + n;
		    console.log('puxando: ', n);
		    let result = heimdallr.getCollection('post', n);
		    result.then((resolve) => {
			    if (resolve.length === this.state.posts.length) {
				    this.setState({ endPulling: true });
			    }
		        this.setState({posts: resolve});
		        this.setState({pulledPosts: n});
			    this.setState({ pulling: false });
			    console.log()
		    });
	    }
    }
  }


  onRefresh = () => {
	  this.setState({ isRefreshing: true });
	  let result = heimdallr.getCollection('post', 10);
	  result.then( (resolve) => {
		  this.setState({ posts: resolve });
		  this.setState({ isRefreshing: false });
	  });
  }

  renderFooter = () =>  {
	  if (!this.state.endPulling) {
		  return (
			  <View style={{marginBottom: 70}}>
				  <ActivityIndicator size="large" color="#0000ff" />
			  </View>
		  );
	  }
	  return (
		  <Text>Fim da linha</Text>
	  )
  };







  render() {
    return (
      <View style={{}}>
          <FlatList
              data = {this.state.posts}
              onScrollEndDrag={() => this.setState({ scrolling: false })}
              onScrollBeginDrag={() => this.setState({ scrolling: true })}
              renderItem={ ({item}) =>
                  <PostViewer text={item._data.text} pid={item._data.pid} uid={item._data.uid} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image} navigation={this.props.navigation} scrolling={this.state.scrolling} />
              }
              refreshControl={
	              <RefreshControl
		              refreshing={this.state.isRefreshing}
		              onRefresh={this.onRefresh.bind(this)}
	              />
              }
              keyExtractor={item => item._ref.id}
              onEndReachedThreshold={0.3}
              onEndReached={({ distanceFromEnd }) => {
                  this.pullMorePosts(distanceFromEnd);
              }}
              ListFooterComponent={ this.renderFooter.bind(this)}

          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
});
