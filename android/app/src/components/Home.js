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
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import Modal from "react-native-modal";
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
	        this.setState({posts: resolve});
	        this.setState({pulledPosts: n});
		    this.setState({ pulling: false });
		    console.log()
	    });
    }
  }

  renderFooter = () =>  {
  	return (
  		<View>
		    <ActivityIndicator />
  		</View>
    );
  };




  render() {
    return (
      <View style={{}}>
          <FlatList
              data = {this.state.posts}
              renderItem={ ({item}) =>
                  <PostViewer text={item._data.text} pid={item._data.pid} uid={item._data.uid} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image} navigation={this.props.navigation}/>
              }
              keyExtractor={item => item._ref.id}
              onEndReachedThreshold={0.3}
              onEndReached={({ distanceFromEnd }) => {
                  this.pullMorePosts(distanceFromEnd);
              }}
              ListFooterComponent={ ({item}) =>
	              <View style={{marginBottom: 70}}>
                      <ActivityIndicator size="large" color="#0000ff" />
                  </View>
              }

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
