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
import MainScreen from "./MainScreen";
import moment from "moment";
const width = Dimensions.get('screen').width;

export default class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId:'',
			userName: null,
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
		const user_id = this.props.navigation.getParam('userId');
		if (user_id) {
			console.log('navigation: ', this.props);
			heimdallr.getUserInfo(user_id? user_id:heimdallr.user_id).then(
				(resolve) => {
					this.setState({userId: resolve.uid, userImage: resolve.user_image, userName: resolve.name, userImageUrl: [{url: resolve.user_image}]});
					heimdallr.getUserColletion('post', this.state.pulledPosts, this.state.userId).then(
						(resolve) => {
							if(resolve.length === 0){
								this.setState({ endPulling: true });
							}
							resolve.forEach((doc) => {
								if (!doc.elapsed_time) {
									const time = moment(doc.data().date).fromNow();
									if (time ===  'a few seconds ago') {
										doc._data.elapsed_time = '1 min';
										console.log('convertendo');
									} else if (time.split(' ')[1] === 'minute') {
										doc._data.elapsed_time = `1min`;
									} else if (time.split(' ')[1] === 'minutes') {
										doc._data.elapsed_time = `${time.split(' ')[0]}min`;
										console.log('sub: ', time.split(' ')[1]);
									} else if (time.split(' ')[1] === 'hour') {
										doc._data.elapsed_time = `1h`;
									} else if (time.split(' ')[1] === 'hours') {
										doc._data.elapsed_time = `${time.split(' ')[0]}h`;
										console.log('sub: ', time.split(' ')[1]);
									} else if (time.split(' ')[1] === 'day' || time.split(' ')[1] === 'days') {
										doc._data.elapsed_time = `${time.split(' ')[0]}d`;
										console.log('sub: ', time.split(' ')[1]);
									} else if (time.split(' ')[1] === 'month') {
										doc._data.elapsed_time = `1mo`;
										console.log('sub: ', time.split(' ')[1]);
									} else if (time.split(' ')[1] === 'months') {
										doc._data.elapsed_time = `${time.split(' ')[0]}mo`;
										console.log('sub: ', time.split(' ')[1]);
									} else if (time.split(' ')[1] === 'year') {
										doc._data.elapsed_time = `1y`;
										console.log('sub: ', time.split(' ')[1]);
									} else if (time.split(' ')[1] === 'years') {
										doc._data.elapsed_time = `${time.split(' ')[0]}y`;
										console.log('sub: ', time.split(' ')[1]);
									}
								}
							});
							console.log('peguei esses caras aqui', resolve);
							this.setState({ posts: resolve });
							this.setState({userId:this.props.navigation.getParam('userId')});
						}
					);
				},
				(reject) => {
					console.log('Deu ruim: ', reject);
				});
		} else {
			// const hue = heimdallr.test(heimdallr.user_id, 100);
			var before = Date.now();
			console.log('navigation: ', this.props);
			this.state.userId = heimdallr.user_id;
			this.state.userImage = heimdallr.user_image;
			this.state.userName = heimdallr.user_name;
			this.state.userImageUrl = [{url: heimdallr.user_image}];
			console.log('Profile: ', this.state.userId);
			heimdallr.getUserColletion('post', 100, this.state.userId).then(
				(resolve) => {
					if(resolve.length === 0){
						this.setState({ endPulling: true });
					}
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
					console.log('peguei esses caras aqui', resolve);
					var after = Date.now() - before;
					console.log(`o mais foda levou: ${after}`);
					this.setState({ posts: resolve });
				}
			);
		}
	}

	pullMorePosts = (distanceFromEnd) => {
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				console.log('int pullling');
				this.setState({ pulling: true });
				let n = this.state.pulledPosts;
				n = 5 + n;
				let result = heimdallr.getUserColletion('post', n, this.state.userId);
				result.then((resolve) => {
					if (resolve.length === this.state.posts.length) {
						this.setState({ endPulling: true });
					}
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
		heimdallr.getUserColletion('post', 10, this.state.userId).then(
			(resolve) => {
				if(resolve.length === 0){
					this.setState({ endPulling: true });
				}
				resolve.forEach((doc) => {
					if (!doc.elapsed_time) {
						const time = moment(doc.data().date).fromNow();
						if (time ===  'a few seconds ago') {
							doc._data.elapsed_time = '1 min';
							console.log('convertendo');
						} else if (time.split(' ')[1] === 'minute') {
							doc._data.elapsed_time = `1min`;
						} else if (time.split(' ')[1] === 'minutes') {
							doc._data.elapsed_time = `${time.split(' ')[0]}min`;
							console.log('sub: ', time.split(' ')[1]);
						} else if (time.split(' ')[1] === 'hour') {
							doc._data.elapsed_time = `1h`;
						} else if (time.split(' ')[1] === 'hours') {
							doc._data.elapsed_time = `${time.split(' ')[0]}h`;
							console.log('sub: ', time.split(' ')[1]);
						} else if (time.split(' ')[1] === 'day' || time.split(' ')[1] === 'days') {
							doc._data.elapsed_time = `${time.split(' ')[0]}d`;
							console.log('sub: ', time.split(' ')[1]);
						} else if (time.split(' ')[1] === 'month') {
							doc._data.elapsed_time = `1mo`;
							console.log('sub: ', time.split(' ')[1]);
						} else if (time.split(' ')[1] === 'months') {
							doc._data.elapsed_time = `${time.split(' ')[0]}mo`;
							console.log('sub: ', time.split(' ')[1]);
						} else if (time.split(' ')[1] === 'year') {
							doc._data.elapsed_time = `1y`;
							console.log('sub: ', time.split(' ')[1]);
						} else if (time.split(' ')[1] === 'years') {
							doc._data.elapsed_time = `${time.split(' ')[0]}y`;
							console.log('sub: ', time.split(' ')[1]);
						}
					}
				});
				console.log('peguei esses caras aqui', resolve);
				this.setState({ posts: resolve });
				this.setState({userId:this.props.navigation.getParam('userId')});
			}
		);
	}


	render() {
		return (
			<View style={{}}>
				<Modal
					visible={this.state.showImage}
					transparent={true}
					onRequestClose={() => {
						this.setState({ showImage: false });
					}}
				>
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
							<PostViewer text={item._data.text} pid={item._data.pid} elapsed_time={item._data.elapsed_time} uid={item._data.uid} images={item._data.images} user={item._data.user_name} userImage={item._data.user_image} navigation={this.props.navigation} scrolling={this.state.scrolling} />
					}
					ListHeaderComponent={() =>
						<View style={styles.profileHeader}>
							<Image
								style={{width: theme.width, height: 120, padding: 0, position: 'absolute', zIndex: -1, opacity: 0.2}}
								source={require('../../../../assets/images/simbol.png')}
							/>
							<TouchableOpacity disabled={!this.state.userImage} onPress={() => {this.setState({ showImage: true })}}>
								<UserImgProfile circular height={70} width={70}  uri={this.state.userImage}/>
							</TouchableOpacity>
							<View>
								<Text style={{marginTop: 5}}>{this.state.userName}</Text>
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
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderColor: theme.primary,
		height: 120,
		padding: 10,
	},
	headerText: {
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		marginLeft: 20,
	},
});

// user profile 