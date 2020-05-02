import React from 'react';
import {
	Text,
	StyleSheet,
	Dimensions,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	KeyboardAvoidingView, RefreshControl,
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
import OptionsMenu from "react-native-options-menu";
import CommentaryViewer from "./CommentaryViewer";
import moment from "moment";
import 'moment/locale/pt-br';

import RBSheet from "react-native-raw-bottom-sheet";
import ReportGod from "./Inputs/ReportGod";
import AwesomeAlert from "react-native-awesome-alerts";

const width = Dimensions.get('screen').width;
const  height = Dimensions.get('screen').height;


export default class PostDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			post: null,
			commentText: null,
			showModal: false,
			comments: null,
			endPulling: false,
			pulling: false,
			pulledComments: 10,
			isRefreshing: false,
			showAlert: false,
		};
	}

	componentWillMount () {
		// BackHandler.addEventListener("hardwareBackPress", () => {
		// 	console.warn('nao nao');
		// })
		// let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
		// 	console.warn('apareci');
		// });
	}

	componentDidMount = () => {
		this.setState({ pulling: true });
		let result = heimdallr.querycolletion('post', 'pid', this.props.navigation.getParam('pid'));
		result.then((resolve) => {
			console.log('details', moment(resolve[0].data().date).locale('pt-br').format('LLLL'));
			resolve[0]._data.date = moment(resolve[0].data().date).locale('pt-br').format('LLLL');
			this.setState( { post: resolve[0]._data });
			this.forceUpdate();
			this.setState({ pulling: false });
		});

		let res = heimdallr.getComments(this.props.navigation.getParam('pid'), this.state.pulledComments);
		res.then((resolve) => {
			resolve.forEach((doc) => {
				const time = moment(doc.data().date).fromNow();
				doc._data.elapsed_time = heimdallr.getElapsedTime(time);
			})
			this.setState({ comments: resolve });
		});

	}

	_keyboardDidShow = (e) => {
		console.log('hehue', e);
	}

	goToUserProfile = () => {
		this.props.navigation.push('UserProfile', {
			userId: this.state.post.uid,
		});
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		let result = heimdallr.getCollection('post', 10);
		result.then( (resolve) => {
			this.setState({ posts: resolve });
			this.setState({ isRefreshing: false });
		});
	}

	getModalImagesLayout = () => {
		if (!this.state.post || !this.state.post.images) {
			return ;
		}
		console.log('seu cu', this.state.post);
		if (this.state.post.images) {

			if (this.state.post.images.length === 1) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.80, height: 235}}>
								<Image
									source={{uri: this.state.post.images[0]}}
									style={{width: width * 0.80, height: 235, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.images.length === 2) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start'}}>
						<View style={{ flexDirection: 'row', marginBottom: 5}}>
							<View style={{width: width * 0.40, height: 235}}>
								<Image
									source={{uri: this.state.post.images[0]}}
									style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: width * 0.40, height: 235}}>
								<Image
									source={{uri: this.state.post.images[1]}}
									style={{width: width * 0.39, height: 235,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.images.length === 3) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.40, height: 235}}>
								<Image
									source={{uri: this.state.post.images[0]}}
									style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{flexDirection: 'column'}}>
								<View style={{width: width * 0.40, height: 116}}>
									<Image
										source={{uri: this.state.post.images[1]}}
										style={{width: width * 0.39, height: 116,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</View>
								<View style={{width: width * 0.40, height: 116}}>
									<Image
										source={{uri: this.state.post.images[2]}}
										style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</View>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.images.length === 4) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.40, height: 116}}>
								<Image
									source={{uri: this.state.post.images[1]}}
									style={{width: width * 0.39, height: 116, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: width * 0.40, height: 100}}>
								<Image
									source={{uri: this.state.post.images[1]}}
									style={{width: width * 0.39, height: 116, borderBottomLeftRadius: 10, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
						<View style={{ flexDirection: 'row',  marginBottom: 5}}>
							<View style={{width: width * 0.40, height: 116}}>
								<Image
									source={{uri: this.state.post.images[2]}}
									style={{width: width * 0.39, height: 116,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
							<View style={{width: width * 0.40, height: 116}}>
								<Image
									source={{uri: this.state.post.images[3]}}
									style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
								/>
							</View>
						</View>
					</View>
				)
			}
		} else {
			return ;
		}
	}

	pullMoreCommentaries = (distanceFromEnd) => {
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				this.setState({ pulling: true });
				let n = this.state.pulledComments;
				n = n + 5;
				let result = heimdallr.getComments(this.props.navigation.getParam('pid'), n);
				result.then((resolve) => {
					console.log('buscou: ', resolve);
					resolve.forEach((doc) => {
						const time = moment(doc.data().date).fromNow();
						doc._data.elapsed_time = heimdallr.getElapsedTime(time);
					})
					if (resolve.length === this.state.comments.length) {
						this.setState({ endPulling: true });
					}
					this.setState( { comments: resolve });
					this.setState({ pulledComments: n });
					this.setState({ pulling: false });
				})
			}
		}
	}

	toggleModal () {
		this.setState({showModal: !this.state.showModal});
		console.log('opened');
	}

	renderFooter = () => {
		if (this.state.comments && this.state.comments.length > 0 && !this.state.endPulling) {
			return (
				<View style={{marginBottom: 70}}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return <View></View>;
	}

	triggerNotification = async () => {
		if(heimdallr.user_id != this.state.post.uid){
			const notifications = {};
			notifications.eid = this.state.post.pid;
			notifications.uid = this.state.post.uid;
			notifications.uid_notification = heimdallr.user_id;
			notifications.user_name = heimdallr.user_name;
			notifications.user_image = heimdallr.user_image;
			notifications.content = this.state.commentText;
			notifications.date = await heimdallr.getServerTime();
			notifications.visualized = 0;
			notifications.entity = "commentary";
			heimdallr.incrementNotification(this.state.post.uid);

			heimdallr.getUID().then((uuid) => {
				notifications.nid = uuid;
				let result = heimdallr.saveNotification(notifications);
				result.then((resolve) => {
					console.log("notification received", resolve);
				});
			})
		}
	}

	addCommentary = async () => {
		if (!this.state.commentText || this.state.commentText === '') {
			return ;
		}
		const params = {};
		params.pid = this.state.post.pid;
		params.comment = this.state.commentText;
		params.date = await heimdallr.getServerTime();
		params.user_image = heimdallr.user_image;
		params.user_name = heimdallr.user_name;
		params.id_user = heimdallr.user_id;
		heimdallr.getUID().then((uuid) => {
			params.cid = uuid;
			let result = heimdallr.saveCollection('comment', params);
			result.then((resolve) => {

				const _data = {};
				_data.user_image = heimdallr.user_image;
				_data.user_name = heimdallr.user_name;
				_data.comment = this.state.commentText;
				_data.cid = uuid;
				const _ref = {id: resolve};
				let posts = this.state.comments;
				posts.unshift({_data, _ref});
				this.setState({ comments: posts });
				this.postTextInput.clear();

			});
		})

		this.triggerNotification();

	}

	return = () => {
		this.props.navigation.goBack();
	}

	closeAlert = () => {
		this.RBSheet.close();
		this.setState({ showAlert: true });
	}


	render() {
		return (
			<KeyboardAvoidingView
				style={{zIndex: 0, flex: 1}}
			>
				<TouchableOpacity onPress={this.return.bind(this)}>
					<View style={{flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10}}>
						<Image
							style={{width: 12, height: 12, marginTop:4}}
							source={require('../../../../assets/images/arrow-left.png')}
						/>
						<Text style={{marginLeft: 5}}>
							voltar
						</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.colContainer}>
					<View
						style={{height: height - 160, width: theme.width * 0.98 }}
					>
						<FlatList
							ListHeaderComponent = {() =>
								<View style={styles.rowContainer}>
									<View style={styles.postHeaderUserImage}>
										<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
											<UserImgProfile circular height={45} width={45} uri={this.state.post? this.state.post.user_image : null}/>
										</TouchableOpacity>
									</View>
									<View style={{flexDirection: 'column'}}>
										<View style={styles.postHeader}>
											<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
												<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
													<Text
														style={{marginLeft: 16,marginTop:35, fontWeight: 'bold'}}
													>
														{this.state.post ? this.state.post.user_name: null}
													</Text>
												</TouchableOpacity>
											</View>
											<TouchableOpacity
												onPress={() => this.RBSheet.open()}>
												<View
													style={{width: 80, height: 50, marginTop: 30, padding: 5, paddingBottom: 10, zIndex: 9999, alignItems: 'flex-end', justifyContent: 'center'}}
												>
													<Image
														style={{width: 20, height: 12}}
														source={require('../../../../assets/images/chevron-down-solid.png')}
													/>
												</View>
											</TouchableOpacity>
										</View>
										<View style={styles.body}>
											<View style={styles.post}>
												<Text style={{marginTop:25}}> {this.state.post ? this.state.post.text : null} </Text>
												<View >
													{this.getModalImagesLayout()}
												</View>
											</View>
										</View>
										<Text style={{color: 'gray', fontSize: 8}}> {this.state.post ? this.state.post.date : null} </Text>
									</View>
								</View>
							}
							refreshControl={
								<RefreshControl
									refreshing={this.state.isRefreshing}
									onRefresh={this.onRefresh.bind(this)}
								/>
							}
							data = {this.state.comments}
							renderItem={ ({item}) =>
								< CommentaryViewer userImage={item._data.user_image} text={item._data.comment} user_name={item._data.user_name} user_id = {item._data.id_user} elapsed_time={item._data.elapsed_time} navigation={this.props.navigation} />
							}
							keyExtractor={item => item._ref.id}
							onEndReachedThreshold={0.3}
							onEndReached={ ({ distanceFromEnd }) => {
								this.pullMoreCommentaries(distanceFromEnd);
							}}
							ListFooterComponent={ this.renderFooter.bind(this)}
						/>
					</View>
					{
						heimdallr.email !== 'spotted@utfpr.com' &&
						<View style={styles.commentContainer}>
							<TextInput
								style={styles.textInput}
								capitalize='sentences'
								placeholder='Comentário...'
								multiline
								onChangeText={text => this.setState({commentText: text})}
								ref={input => (this.postTextInput = input)}
							/>
							<TouchableOpacity onPress={this.addCommentary.bind(this)}>
								<Image
									style={{width: 30, height: 30, marginLeft: 20, marginBottom:5}}
									source={require('../../../../assets/images/send.png')}
								/>
							</TouchableOpacity>
						</View>
					}
				</View>
				<RBSheet
					ref={ref => {
						this.RBSheet = ref;
					}}
					height={300}
					animationType={'slide'}
					duration={250}
				>
					<ReportGod  close={this.closeAlert.bind(this)}/>
				</RBSheet>
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
			</KeyboardAvoidingView>
		);
	}
}


const styles = StyleSheet.create({
	colContainer: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		// padding: 10,
		borderTopWidth: 0.2,
		borderColor: 'rgba(59, 56, 50, 0.2)',
		flex: 1,
		
	},
	rowContainer: {
		width: width,
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 10,
		borderBottomWidth: 0.2,
		borderColor: 'rgba(59, 56, 50, 0.2)',
	},
	postHeaderUserImage: {
		justifyContent: "flex-start",
		alignContent: 'flex-start',
		padding: 0,
		alignItems: 'flex-start',
		height: 30
	},
	textInput: {
		height: 40,
		borderBottomWidth: 0,
		width: width * 0.8,
		marginLeft:10,

		
	},
	body: {
		flexDirection: 'column',
		marginBottom:40,
	},
	postHeader: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		height: 15,
		fontWeight: 'bold',
		alignItems: 'center',
		alignContent: 'center',
		width: width * 0.83,
	},
	commentContainer: {
		position: 'absolute',
		alignItems: 'flex-end',
		width: width,
		bottom: 0,
		alignSelf: 'flex-end',
		borderTopWidth: 0.5,
		borderColor: theme.primary,
		height: 50,
		flexDirection: 'row',
		backgroundColor: 'white',
		padding: 5,
		zIndex: 1,
	},
	post: {
		alignSelf: 'flex-start',
		width: width * 0.7,
		padding: 2,
		marginLeft: 12,
		borderRadius: 8,
		color: 'black',
	}
});