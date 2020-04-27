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
 // comentary 
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
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";

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
	    showAlert: false,
    };
  }

  componentDidMount = () => {
  	let result = heimdallr.getCollection('post', this.state.pulledPosts);
  	result.then( (resolve) => {
  		console.log('peguei esses caras aqui', resolve);
  		if (resolve.length === 0 ) {
  			console.warn('veio nada');
  			this.setState({ endPulling: true })
	    }
  		resolve.forEach((doc) => {
		    const time = moment(doc.data().date).fromNow();
		    if (time ===  'a few seconds ago') {
		    	doc._data.elapsed_time = '1 min';
		    } else if (time.split(' ')[1] === 'minute') {
			    doc._data.elapsed_time = `1min`;
		    } else if (time.split(' ')[1] === 'minutes') {
			    doc._data.elapsed_time = `${time.split(' ')[0]}min`;
		    } else if (time.split(' ')[1] === 'hour') {
			    doc._data.elapsed_time = `1h`;
		    } else if (time.split(' ')[1] === 'hours') {
			    doc._data.elapsed_time = `${time.split(' ')[0]}h`;
		    } else if (time.split(' ')[1] === 'day' || time.split(' ')[1] === 'days') {
			    doc._data.elapsed_time = `${time.split(' ')[0]}d`;
		    } else if (time.split(' ')[1] === 'month') {
			    doc._data.elapsed_time = `1mo`;
		    } else if (time.split(' ')[1] === 'months') {
			    doc._data.elapsed_time = `${time.split(' ')[0]}mo`;
		    } else if (time.split(' ')[1] === 'year') {
			    doc._data.elapsed_time = `1y`;
		    } else if (time.split(' ')[1] === 'years') {
			    doc._data.elapsed_time = `${time.split(' ')[0]}y`;
		    }
	    })

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
			    resolve.forEach((doc) => {
			    	if (!doc.elapsed_time) {
					    const time = moment(doc.data().date).fromNow();
					    if (time ===  'a few seconds ago') {
						    doc._data.elapsed_time = '1 min';
					    } else if (time.split(' ')[1] === 'minute') {
						    doc._data.elapsed_time = `1min`;
					    } else if (time.split(' ')[1] === 'minutes') {
						    doc._data.elapsed_time = `${time.split(' ')[0]}min`;
					    } else if (time.split(' ')[1] === 'hour') {
						    doc._data.elapsed_time = `1h`;
					    } else if (time.split(' ')[1] === 'hours') {
						    doc._data.elapsed_time = `${time.split(' ')[0]}h`;
					    } else if (time.split(' ')[1] === 'day' || time.split(' ')[1] === 'days') {
						    doc._data.elapsed_time = `${time.split(' ')[0]}d`;
					    } else if (time.split(' ')[1] === 'month') {
						    doc._data.elapsed_time = `1mo`;
					    } else if (time.split(' ')[1] === 'months') {
						    doc._data.elapsed_time = `${time.split(' ')[0]}mo`;
					    } else if (time.split(' ')[1] === 'year') {
						    doc._data.elapsed_time = `1y`;
					    } else if (time.split(' ')[1] === 'years') {
						    doc._data.elapsed_time = `${time.split(' ')[0]}y`;
					    }
				    }
			    });
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
	  	<View style={{
	  		flex: 1,
		    height: 50,
		    flexDirection: 'row',
		    backgroundColor: '#aab512',
		    padding: 10,
		    shadowColor: "#000",
		    shadowOffset: {
			    width: 0,
			    height: 2,
		    },
		    shadowOpacity: 0.23,
		    shadowRadius: 2.62,
		    elevation: 4,
		    alignItems: 'center',
		    justifyContent: 'center'
	  	}}>
		    <Image source={require('../../../../assets/images/warning.png') } style={{height: 20, width: 25}}/>
		    <Text style={{marginLeft: 5}}>Não há mais postagens para serem vistas</Text>
	    </View>
	  )
  };



	confirmReport = () => {
		this.setState({ showAlert: true });
	}



  render() {
    return (
      <View style={{}}>
          <FlatList
              data = {this.state.posts}
              onScrollEndDrag={() => this.setState({ scrolling: false })}
              onScrollBeginDrag={() => this.setState({ scrolling: true })}
              renderItem={ ({item}) =>
                  <PostViewer text={item._data.text} pid={item._data.pid} uid={item._data.uid} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image} elapsed_time={item._data.elapsed_time} navigation={this.props.navigation} scrolling={this.state.scrolling} closeAlert={this.confirmReport.bind(this)} />
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
	      <AwesomeAlert
		      show={this.state.showAlert}
		      showProgress={false}
		      title="Denúncia realizada"
		      message="Nossos criadores irão analisar a postagem denunciada"
		      closeOnTouchOutside={true}
		      closeOnHardwareBackPress={false}
		      showConfirmButton={true}
		      confirmText="OK"
		      confirmButtonColor={'green'}
		      onConfirmPressed={() => {
			      this.setState({ showAlert: false })
		      }}
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
