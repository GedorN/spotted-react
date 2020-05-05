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
import axios from 'react-native-axios'

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
  	// axios({
	//     method: 'post',
	//     url: 'https://appws.picpay.com/ecommerce/public/payments',
	//     headers: {'x-picpay-token': '3782eb80-9b55-4611-a81a-111555fc39ec'},
	//     data: {
	// 	    "referenceId": "10260dfvcb30",
	//   "callbackUrl": "http://www.spottedutfpr.com.br/callback",
	// 	    "returnUrl": "http://www.sualoja.com.br/cliente/pedido/102030",
	// 	    "value": 20,
	// 	    "expiresAt": "2022-05-01T16:00:00-03:00",
	// 	    "buyer": {
	// 		    "firstName": "João",
	// 		    "lastName": "Da Silva",
	// 		    "document": "123.456.789-10",
	// 		    "email": "teste@picpay.com",
	// 		    "phone": "+55 27 12345-6789"
	// 	    }
	//     }
    // }).then(
    // 	(resolve) => {
    // 		console.log('deu biooaooaoaoa guri: ', resolve);
	//     },
	//     (reject) => {
    // 		console.log('tava esperando: ', reject);
	//     }
    // );
  	let result = heimdallr.getCollection('post', this.state.pulledPosts);
  	result.then( (resolve) => {
  		console.log('peguei esses caras aqui', resolve);
  		if (resolve.length === 0 ) {
  			console.warn('veio nada');
  			this.setState({ endPulling: true })
	    }
  		resolve.forEach((doc) => {
		    const time = moment(doc.data().date).fromNow();
		    doc._data.elapsed_time = heimdallr.getElapsedTime(time);
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
					    doc._data.elapsed_time = heimdallr.getElapsedTime(time);
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
		  resolve.forEach((doc) => {
			  if (!doc.elapsed_time) {
				  const time = moment(doc.data().date).fromNow();
				  doc._data.elapsed_time = heimdallr.getElapsedTime(time);
			  }
		  });
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
							<PostViewer text={item._data.text} anonymous = {item._data.anonymous?item._data.anonymous:'0'} pid={item._data.pid} uid={item._data.uid} images={item._data.images} 
									user={item._data.anonymous?(item._data.anonymous == '0'?item._data.user_name:'Anônimo'):item._data.user_name} 
									userImage={item._data.anonymous?(item._data.anonymous == '0'?item._data.user_image:null):item._data.user_image} 
									elapsed_time={item._data.elapsed_time} navigation={this.props.navigation} scrolling={this.state.scrolling} 
									closeAlert={this.confirmReport.bind(this)} />  }
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
