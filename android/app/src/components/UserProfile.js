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
	Modal,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-picker';
import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import UUIDGenerator from 'react-native-uuid-generator';
import theme from "../../../../components/General/Theme";
import ImageViewer from "react-native-image-zoom-viewer";
const width = Dimensions.get('screen').width;

export default class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId:'',
			userName:'',
			posts: null,
			pulledPosts: 10,
			loading: false,
			pulling: false,
			endPulling: false,
			isRefreshing: false,
			showImage: false,
			userImage: '',
			userImageUrl: [],
			scrolling: false,
		};
	}

	componentDidMount = () => {
		heimdallr.getSimilarUser();
		console.log('token: ', this.props.user);

		let user_id = this.props.navigation.getParam('userId');
		console.warn("user_id",user_id);
		let userInfo = heimdallr.getUserInfo(user_id? user_id:heimdallr.user_id);
		userInfo.then((resolve) => {
			console.warn("user collection",resolve.uid);
			this.setState({userId: resolve.uid, userImage: resolve.user_image, userName: resolve.name, userImageUrl: [{url: resolve.user_image}]});
			
		});
		let result = heimdallr.getUserColletion('post', this.state.pulledPosts,user_id? user_id:heimdallr.user_id);
		result.then( (resolve) => {
			if(resolve.length === 0){
				this.setState({ endPulling: true });
			}
			console.log('peguei esses caras aqui', resolve);
			this.setState({ posts: resolve });
			this.setState({userId:this.props.navigation.getParam('userId')});
			console.warn("userId state", this.state.userId);
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
				let result = heimdallr.getUserColletion('post', n, heimdallr.user_id);
				result.then((resolve) => {
					if (resolve.length === this.state.posts.length) {
						this.setState({ endPulling: true });
					}
					console.log(`resolve do carai? `, resolve);
					this.setState({posts: resolve});
					this.setState({pulledPosts: n});
					this.setState({ pulling: false });
				});
			}
		}
	}

	renderNoPosts = () => {
		<View>
			<Text>Sem postagens</Text>
		</View>
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

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		let result = heimdallr.getCollection('post', 10);
		result.then( (resolve) => {
			this.setState({ posts: resolve });
			this.setState({ isRefreshing: false });
		});
	}


	render() {
		return (
			<View style={{}}>
				<Modal visible={this.state.showImage} transparent={true}>
					<ImageViewer
						imageUrls={this.state.userImageUrl? this.state.userImageUrl: null}
						swipeDownThreshold={0.5}
						enableSwipeDown={true}
						onSwipeDown={() => {this.setState({ showImage: false })}}
					/>
				</Modal>
				<FlatList
					data = {this.state.posts}
					onScrollEndDrag={() => this.setState({ scrolling: false })}
					onScrollBeginDrag={() => this.setState({ scrolling: true })}
					renderItem={ ({item}) =>
							<PostViewer text={item._data.text} pid={item._data.pid} uid={item._data.uid} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image} navigation={this.props.navigation} scrolling={this.state.scrolling} />
					}
					ListHeaderComponent={() =>
						<View style={styles.profileHeader}>
							<TouchableOpacity onPress={() => {this.setState({ showImage: true })}}>
								<UserImgProfile circular height={70} width={70} borderWidth={2} borderColor={theme.primary} uri={this.state.userImage}/>
							</TouchableOpacity>
							<View style={styles.headerText}>
								<Text>{this.state.userName}</Text>
							</View>
						</View>
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
	profileHeader: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: theme.primary,
		height: 100,
		padding: 10,
	},
	headerText: {
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		marginLeft: 20,
	},
});
