import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	ActivityIndicator,
	RefreshControl, StatusBar,
} from 'react-native';


import Ripple from "react-native-material-ripple";
import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        posts: null,
        pulledPosts: 40,
        loading: false,
	    pulling: false,
	    endPulling: false,
	    isRefreshing: false,
	    scrolling: false,
		showAlert: false,
		deletePost: '',
		showDeleteAlert: false,
    };
  }

  componentDidMount = () => {
  	heimdallr.refreshKey = new Date();
  	this.props.navigation.addListener('willFocus', () => {
  		StatusBar.setBackgroundColor('white');
  		StatusBar.setBarStyle('dark-content');
  	});
  	let result = heimdallr.getCollection('post', this.state.pulledPosts);
  	result.then( (resolve) => {
  		if (resolve.length === 0 ) {
  			this.setState({ endPulling: true })
	    }
  		resolve.forEach((doc) => {
		    const time = moment(doc.data().date).fromNow();
		    doc._data.elapsed_time = heimdallr.getElapsedTime(time);
	    })

  		this.setState({ posts: resolve });
  	});
  }

  scrollToTop = () => {
	  this.flatList.scrollToIndex({index: 0, animated: true});
  }

  setRefreshing = () => {
	  this.setState({ isRefreshing: true });
  }

  pullMorePosts = (distanceFromEnd) => {
  	if (!this.state.endPulling) {
	    console.log('interval?', distanceFromEnd);
	    console.log('state before: ', this.state);
	    if (!this.state.pulling) {
	    	heimdallr.sendEvent('pulling_more_posts');
	        console.log('int pullling');
	        this.setState({ pulling: true });
		    console.log('chegou');
		    let n = this.state.pulledPosts;
		    n = 30 + n;
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

  addItem = (post) => {
  	let posts = this.state.posts;
  	posts.unshift({_data: post, _ref: {id: post.pid}});
  	this.setState({ posts: posts });
  }


  onRefresh = () => {
	  this.setState({ isRefreshing: true });
	  let result = heimdallr.getCollection('post', 10);
	  result.then( (resolve) => {
	  	resolve.forEach((doc) => {
		    const time = moment(doc.data().date).fromNow();
		   doc._data.elapsed_time = heimdallr.getElapsedTime(time);
	    });
	  	this.setState({ posts: [] });
	  	this.setState({ posts: resolve, isRefreshing: false });
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

  confirmPostRm =(pid) => {
	  this.setState({ showDeleteAlert: true, deletePost: pid });
  }


	confirmReport = () => {
			this.setState({ showAlert: true});
	}

	deletePost = () => {
		this.setState({ isRefreshing: true });
		heimdallr.deletePost(this.state.deletePost).then(
			() => {
				this.onRefresh();
			},
			() => {
				this.setState({ isRefreshing: false });
			}
		);
		this.setState({ showDeleteAlert: false});
		// heimdallr.deletePostComments('comment',this.state.deletePost);
		// heimdallr.deletePostNotifications('notification',heimdallr.user_id,this.state.deletePost);
	}


  render() {
    return (
      <View style={{}}>
	      <FlatList
              data = {this.state.posts}
              ref={flatList => {this.flatList = flatList}}
              onScrollEndDrag={() => this.setState({ scrolling: false })}
              onScrollBeginDrag={() => this.setState({ scrolling: true })}
              renderItem={ ({item}) =>
							<PostViewer
									text={item._data.text}
									anonymous = {item._data.anonymous?item._data.anonymous:'0'}
									pid={item._data.pid} uid={item._data.uid}
									images={item._data.images}
									user={item._data.anonymous ?(item._data.anonymous == '0'?item._data.user_name:'Anônimo'):item._data.user_name}
									userImage={item._data.anonymous?(item._data.anonymous == '0'?item._data.user_image:null):item._data.user_image}
									elapsed_time={item._data.elapsed_time}
									navigation={this.props.navigation}
									scrolling={this.state.scrolling}
									video={item._data.video ? true : false}
						            gif={item._data.gif ? true : false}
								    closeAlert={this.confirmReport.bind(this)}
						            confirmPostRm={this.confirmPostRm.bind(this)}
									likes={item._data.likes}
									liked_by={item._data.liked_by}
									comments={item._data.comments}
									new_post={item._data.newPost}
							/>
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
				show={this.state.showDeleteAlert}
				showProgress={false}
				title= {"Tem certeza que deseja excluir ? "}
				titleStyle = {{fontSize: 15, justifyContent: 'center'}}
				message= {"Após confirmada essa ação não poderá ser desfeita."}
				messageStyle = {{fontSize: 13}}
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				showCancelButton = {true}
				cancelText = {"Não"}
				showConfirmButton={true}
				confirmText= {"Sim"}
				confirmButtonColor={'green'}
				onConfirmPressed={() => {
						this.deletePost();
				}}
				onCancelPressed={() => {
					this.setState({ showDeleteAlert: false })
				}}

			/>
	      <AwesomeAlert
				show={this.state.showAlert}
				showProgress={false}
				title= {"Denúncia realizada"}
				message= {"Nossos criadores irão analisar a postagem denunciada"}
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				showConfirmButton={true}
				confirmText= {"OK"}
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
