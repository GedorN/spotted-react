import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Modal,

} from 'react-native';

import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import theme from "../../../../components/General/Theme";
import ImageViewer from "react-native-image-zoom-viewer";
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";


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
			findUser : true,
			showAlert: false,
			deletePost: '',
			showDeleteAlert: false,
		};
	}

	componentDidMount = () => {
		console.log('image: ', heimdallr.user_image);
		const user_id = this.props.navigation.getParam('userId');
		if (user_id) {

			console.log('navigation: ', this.props);
			heimdallr.getUserInfo(user_id? user_id:heimdallr.user_id).then(
				(resolve) => {
					if(resolve != null){
						this.setState({userId: resolve.uid, userImage: resolve.user_image, userName: resolve.name, userImageUrl: [{url: resolve.user_image}]});
						heimdallr.getUserColletion(10, this.state.userId).then(
						(resolve) => {
							if(!resolve || resolve.length === 0){
								this.setState({ endPulling: true });
							}
							resolve.forEach((doc) => {
								if (!doc.elapsed_time) {
									const time = moment(doc.date).fromNow();
									doc.elapsed_time = heimdallr.getElapsedTime(time);
								}
							});
							this.setState({ posts: resolve });
							this.setState({userId:this.props.navigation.getParam('userId')});
						}
					);
					}
					else{
						this.setState({findUser :false});
					}
				},
				(reject) => {
					console.warn('Deu ruim: ', reject);
				});
		} else {
			this.state.userId = heimdallr.user_id;
			this.state.userImage = heimdallr.user_image;
			this.state.userName = heimdallr.user_name;
			this.state.userImageUrl = [{url: heimdallr.user_image}];
			heimdallr.getUserColletion(100, this.state.userId).then(
				(resolve) => {
					if(!resolve || resolve.length === 0){
						this.setState({ endPulling: true });
					} else
					resolve.forEach((doc) => {
						if (!doc.elapsed_time) {
							const time = moment(doc.date).fromNow();
							doc.elapsed_time = heimdallr.getElapsedTime(time);

						}
					});
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
				let result = heimdallr.getUserColletion(n, this.state.userId);
				result.then((resolve) => {
					if (resolve.length === this.state.posts.length) {
						this.setState({ endPulling: true });
					}
					resolve.forEach((doc) => {
						if (!doc.elapsed_time) {
							const time = moment(doc.date).fromNow();
							doc.elapsed_time = heimdallr.getElapsedTime(time);

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
				backgroundColor: theme.primary,
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
				<Image source={require('../../../../assets/images/warning.png') } style={{height: 20, width: 25, tintColor: '#FFFFFF'}}/>
				<Text style={{marginLeft: 5, color: '#FFFFFF'}}>Não há mais postagens para serem vistas</Text>
			</View>
		)
	};

	onRefresh = () => {
		heimdallr.getUserColletion(10, this.state.userId).then(
			(resolve) => {
				if(!resolve || resolve.length === 0){
					this.setState({ endPulling: true });
				}
				resolve.forEach((doc) => {
					if (!doc.elapsed_time) {
						const time = moment(doc.date).fromNow();
						doc.elapsed_time = heimdallr.getElapsedTime(time);
					}
				});
				this.setState({ posts: resolve, isRefreshing: false });

			}
		);
	}

	deletePostConfirm = (pid) => {
		this.setState({ showDeleteAlert: true, deletePost: pid });

	}

	confirmReport = (deleteAction, pid) => {
		this.setState({ showAlert: true });
	}

	deletePost = () => {
		this.setState({ showDeleteAlert: false, isRefreshing: true });
		heimdallr.deletePost(this.state.deletePost).then(
			() => {
				this.onRefresh();
			}
		);
	}


	render() {
		return (

			<View style={{}}>

				{ this.state.findUser ?
					<View>
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
								item.anonymous !== true &&
								<PostViewer
									confirmPostRm={this.deletePostConfirm.bind(this)}
									closeAlert={this.confirmReport.bind(this)}
									video={item.video ? true : false}
									text={item.text}
									pid={item.pid}
									elapsed_time={item.elapsed_time}
									uid={item.uid}
									images={item.images}
									user={item.user_name}
									userImage={item.user_image}
									navigation={this.props.navigation}
									scrolling={this.state.scrolling}
									likes={item.likes}
									liked_by={item.liked_by}
									comments={item.comments}
								/>
						}
						ListHeaderComponent={() =>
							<View style={styles.profileHeader}>
								{
									this.props.navigation.getParam('userId') &&
									<View style = {{alignSelf:'flex-start'}}>
										<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
											<View style={{flexDirection: 'row', marginTop: 2,  paddingLeft: 5,width:theme.width * 0.2,height:theme.height * 0.04}}>
												<Image
													style={{ width: 30, height: 30, marginTop:4, opacity: 0.6}}
													source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
												/>
											</View>
										</TouchableOpacity>
									</View>
								}
								<Image
									style={{width: theme.width, height: 120, padding: 0, position: 'absolute', zIndex: -1, opacity: 0.2}}
									source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fsimbol.png?alt=media&token=59f607da-634a-4eae-b6fe-c3ef845c1a67' }}
								/>
								<View style = {{ marginTop: -(this.props.navigation.getParam('userId') ? theme.height * 0.03 : theme.height * 0.01 ) }}>
									<TouchableOpacity disabled={!this.state.userImage} onPress={() => {this.setState({ showImage: true })}}>
										<UserImgProfile circular height={70} width={70}  uri={this.state.userImage}/>
									</TouchableOpacity>
								</View>
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
						keyExtractor={item => item.pid}
						onEndReachedThreshold={0.3}
						onEndReached={({ distanceFromEnd }) => {
							this.pullMorePosts(distanceFromEnd);
						}}
						ListFooterComponent={ this.renderFooter.bind(this)}

					/>
					</View>
					 :
					 <View>
						<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
							<View style={{flexDirection: 'row', marginTop: theme.height * 0.01,  paddingLeft: theme.width * 0.02,width:theme.width * 0.2,height:theme.height * 0.04}}>
								<Image
									style={{ width: 30, height: 30, marginTop:4, opacity: 0.6 }}
									source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
								/>
							</View>
						</TouchableOpacity>

						<View style = {{alignSelf:'center'/* , borderColor:'black',borderWidth:1 */ ,marginTop:theme.height * 0.04,alignItems:'center'}}>
							<Image
											style={{width: theme.width * 0.7, height: theme.height * 0.25, marginTop:4 ,opacity:0.5,marginBottom:theme.height * 0.04}}
											source={require('../../../../assets/images/mask-solid.png')}
										/>

							<Text style = {{fontSize:20,fontWeight:'bold',marginTop:theme.height * 0.01,opacity:0.5}}>Ih, o usuário vazou,</Text>
							<Text style = {{fontSize:20,fontWeight:'bold',marginTop:theme.height * 0.01,opacity:0.5}}>ou mudou de nome.</Text>
							<Text style = {{fontSize:20,fontWeight:'bold',marginTop:theme.height * 0.01}}t>Mas o usuário sempre volta </Text>
						</View>
					 </View>
				}
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
