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
	KeyboardAvoidingView,
	RefreshControl,
	Modal,
} from 'react-native';

import { FAB } from 'react-native-paper';

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
import ImageViewer from "react-native-image-zoom-viewer";
import CommentaryWriter from "./Inputs/CommentaryWriter";


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
			anonymousProfile:'0',
			anonymousUser: false,
			anonymousText: "Comentário...",
			showImages: false,
			galleryObj: [],
			indexImage: 0,
			creatingComment: false,
			postId: '',
			showCommentaryModal: false,
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
		this.state.postId =  this.props.navigation.getParam('pid');
		let result = heimdallr.querycolletion('post', 'pid', this.props.navigation.getParam('pid'));
		result.then((resolve) => {
			console.log('details', moment(resolve[0].data().date).locale('pt-br').format('LLLL'));
			resolve[0]._data.date = moment(resolve[0].data().date).locale('pt-br').format('LLLL');
			this.setState( { post: resolve[0] });
			if (resolve[0].data().images) {
				(resolve[0].data().images).forEach((img) => {
					let images = this.state.galleryObj;
					images.push({url: img});
					this.setState({ galleryObj: images });
				});
			}
			console.log('que post é esse? ', this.state.post);
			this.forceUpdate();
			this.setState({ pulling: false });
			this.setState({ anonymousProfile: this.state.post.data().anonymous });
		});

		let res = heimdallr.getComments(this.props.navigation.getParam('pid'), this.state.pulledComments);
		res.then((resolve) => {
			resolve.forEach((doc) => {
				const time = moment(doc.date).fromNow();
				doc.elapsed_time = heimdallr.getElapsedTime(time);
			})
			this.setState({ comments: resolve });
		});



	}


	disableModal () {
		this.setState({ showImages: false });
	}

	_keyboardDidShow = (e) => {
		console.log('hehue', e);
	}

	goToUserProfile = () => {
		this.props.navigation.push('UserProfile', {
			userId: this.state.post.data().uid,
		});
	}

	_hideModal = () => {
		this.setState({ showCommentaryModal: false });
	};

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		let result = heimdallr.getComments(this.state.post.data().pid, 10);
		result.then( (resolve) => {
			resolve.forEach((doc) => {
				const time = moment(doc.date).fromNow();
				doc.elapsed_time = heimdallr.getElapsedTime(time);
			})
			this.setState({ comments: resolve });
			this.setState({ isRefreshing: false });
			this.setState({ pulledComments: 10 });
			this.setState({ endPulling: false });
			this.setState({anonymousProfile:this.props.navigation.getParam('anonymous')?this.props.navigation.getParam('anonymous'):'0'});

		});
	}

	getModalImagesLayout = () => {
		if (!this.state.post) {
			return ;
		}
		if (this.state.post && this.state.post.data().images) {

			if (this.state.post.data().images.length === 1) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.80, height: 235}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
									<Image
										source={{uri: this.state.post.data().images[0]}}
										style={{width: width * 0.80, height: 235, borderRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.data().images.length === 2) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start',zIndex: 2}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.40, height: 235}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
									<Image
										source={{uri: this.state.post.data().images[0]}}
										style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
							<View style={{width: width * 0.40, height: 235}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
									<Image
										source={{uri: this.state.post.data().images[1]}}
										style={{width: width * 0.39, height: 235,  borderTopRightRadius: 10, borderBottomRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.data().images.length === 3) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.40, height: 235}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
									<Image
										source={{uri: this.state.post.data().images[0]}}
										style={{width: width * 0.39, height: 235, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
							<View style={{flexDirection: 'column'}}>
								<View style={{width: width * 0.40, height: 116}}>
									<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
										<Image
											source={{uri: this.state.post.data().images[1]}}
											style={{width: width * 0.39, height: 116,  borderTopRightRadius: 10, marginLeft: 2, borderWidth: 0.1, borderColor: 'black'}}
										/>
									</TouchableOpacity>
								</View>
								<View style={{width: width * 0.40, height: 116}}>
									<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
										<Image
											source={{uri: this.state.post.data().images[2]}}
											style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, marginLeft: 2, marginTop: 2, borderWidth: 0.1, borderColor: 'black'}}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				)
			} else if (this.state.post.data().images.length === 4) {
				return (
					<View style={{alignItems: 'flex-start', alignSelf: 'flex-start', marginTop: 10}}>
						<View style={{ flexDirection: 'row'}}>
							<View style={{width: width * 0.40, height: 116}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 0 })}}>
									<Image
										source={{uri: this.state.post.data().images[0]}}
										style={{width: width * 0.39, height: 116, borderTopLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
							<View style={{width: width * 0.40, height: 116}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 1 })}}>
									<Image
										source={{uri: this.state.post.data().images[1]}}
										style={{width: width * 0.39, height: 116, borderTopRightRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{ flexDirection: 'row',  marginTop: 5}}>
							<View style={{width: width * 0.40, height: 116}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 2 })}}>
									<Image
										source={{uri: this.state.post.data().images[2]}}
										style={{width: width * 0.39, height: 116,  borderBottomLeftRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
							<View style={{width: width * 0.40, height: 100}}>
								<TouchableOpacity  onPress={() => {this.setState({ showImages: true, indexImage: 3 })}}>
									<Image
										source={{uri: this.state.post.data().images[3]}}
										style={{width: width * 0.39, height: 116, borderBottomRightRadius: 10, borderWidth: 0.1, borderColor: 'black'}}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)
			}
		} else {
			return ;
		}
	}

	getAnonymous = () => {
		const isAnon = !this.state.anonymousUser;
		this.setState({ anonymousUser: isAnon });

		if(isAnon && !this.state.commentText){
           this.setState({anonymousText: "Comentário anônimo..."});
		}
		else{
			this.setState({anonymousText: "Comentário..."})
		}
	}

	pullMoreCommentaries = (distanceFromEnd) => {
		console.log('fui chamado');
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				this.setState({ pulling: true });
				let n = this.state.pulledComments;
				n = n + 5;
				let result = heimdallr.getComments(this.props.navigation.getParam('pid'), n);
				result.then((resolve) => {
					resolve.forEach((doc) => {
						const time = moment(doc.date).fromNow();
						doc.elapsed_time = heimdallr.getElapsedTime(time);
					})

					if (resolve.length === 0) {
						this.setState({ endPulling: true });
						this.setState({ comments: this.state.comments.concat(resolve)  })
					} else if (resolve.length === this.state.comments.length) {
						this.setState({ endPulling: true });
					} else {
						this.setState( { comments: resolve });
					}
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

	triggerNotification = async (comment) => {
		if(heimdallr.user_id != this.state.post.data().uid){
			const notifications = {};
			notifications.eid = this.state.post.data().pid;
			notifications.uid = this.state.post.data().uid;
			notifications.uid_notification = heimdallr.user_id;
			notifications.user_name = heimdallr.user_name;
			notifications.user_image = heimdallr.user_image;
			notifications.anonymous =  this.state.anonymousUser;
			notifications.content = comment;
			notifications.date = await heimdallr.getServerTime();
			notifications.visualized = 0;
			notifications.entity = "commentary";
			heimdallr.incrementNotification(this.state.post.data().uid);

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
		if (!this.state.creatingComment) {
			this.setState({ creatingComment: true });


			const params = {};
			const comment = this.state.commentText;
			this.setState({ commentText: null });
			params.pid = this.state.post.data().pid;
			params.comment = comment;
			params.date = await heimdallr.getServerTime();
			params.user_image = heimdallr.user_image;
			params.user_name = heimdallr.user_name;
			params.anonymous =  this.state.anonymousUser;
			params.id_user = heimdallr.user_id;
			heimdallr.getUID().then((uuid) => {
				params.cid = uuid;

				heimdallr.saveComment(params);
				const data = {};
				data.user_image = !this.state.anonymousUser? heimdallr.user_image : null;
				data.user_name = !this.state.anonymousUser? heimdallr.user_name : 'Anônimo';
				data.comment = comment;
				data.anonymous =  this.state.anonymousUser;
				data.cid = uuid;
				let posts = this.state.comments;
				posts.push(data);
				this.setState({ comments: posts });
				this.setState({ creatingComment: false });
			})

			this.triggerNotification(comment);
		}

	}

	return = () => {
		this.props.navigation.goBack();
	}

	closeAlert = () => {
		this.RBSheet.close();
		this.setState({ showAlert: true });
	}

	comentaryCallback = (alertState) => {
		this.setState({showAlert : true});
	}

	_openCommentaryWriter = () => {
		this.setState({ showCommentaryModal: true });
	}



	render() {
		return (
			<KeyboardAvoidingView
				style={{zIndex: 0, flex: 1}}
			>
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
						style={{height: height - 110, width: theme.width * 0.98 }}
					>
						<FlatList
							ListHeaderComponent = {() =>
								<View style={styles.rowContainer}>
									<View style={styles.postHeaderUserImage}>
										<TouchableOpacity  onPress={this.state.post?(this.state.anonymousProfile == '0'? this.goToUserProfile.bind(this):null):null}>
											<UserImgProfile circular height={45} width={45} uri={this.state.post?(this.state.anonymousProfile == '0'? this.state.post.data().user_image : null) : null}/>
										</TouchableOpacity>
									</View>
									<View style={{flexDirection: 'column'}}>
										<View style={{flexDirection:'row'}}>
											<View style={styles.postHeader}>
												<View style={{flexDirection: 'row', alignItems: 'center'}}>
													<TouchableOpacity  onPress={this.state.post?(this.state.anonymousProfile == '0'? this.goToUserProfile.bind(this):null):null}>
														<Text
															style={{marginLeft: 16,marginTop:35, fontWeight: 'bold'}}
														>
															{this.state.post ?(this.state.anonymousProfile == '0'?this.state.post.data().user_name:'Anônimo'): null}
														</Text>
													</TouchableOpacity>
												</View>
											</View>
											<TouchableOpacity
													style = {{width:theme.width * 0.14,height:theme.height * 0.048,flexDirection:'column',justifyContent:'flex-end'}}
													onPress={() => this.RBSheet.open()}>
													<View
														style={{width: 40, height: 20, zIndex: 9999, alignItems: 'flex-end', justifyContent: 'flex-end'}}
													>
														<Image
															style={{width: 20, height: 12}}
															source={require('../../../../assets/images/ellipsis-h-solid.png')}
														/>
													</View>
											</TouchableOpacity>
										</View>
										<View style={styles.body}>
											<View style={styles.post}>
												<View style = {{width:theme.width * 0.77,flexWrap:'wrap',alignItems:'flex-start',alignSelf:'center'}}>
													<Text style={{marginTop:theme.height*0.01,marginBottom:theme.height*0.02,paddingRight:theme.width*0.01,paddingLeft:theme.width * 0.01}}> {this.state.post ? this.state.post.data().text : null} </Text>
												</View>
												<View style = {{marginLeft:theme.width * 0.01}}>
													{this.getModalImagesLayout()}
												</View>
											</View>
										</View>
										<Text style={{color: 'gray', fontSize: 8,marginLeft:theme.width * 0.02}}> {this.state.post ? this.state.post.data().date : null} </Text>
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
								< CommentaryViewer commentaryCallback = {this.comentaryCallback} cid = {item.cid} pid = {this.state.postId} userImage={item.anonymous ? null : item.user_image}  anonymous={item.anonymous} text={item.comment} user_name={item.anonymous ? 'Anônimo' : item.user_name} user_id = {item.id_user} elapsed_time={item.elapsed_time} navigation={this.props.navigation} />
							}
							keyExtractor={item => item.cid}
							onEndReachedThreshold={0.3}
							onEndReached={ ({ distanceFromEnd }) => {
								this.pullMoreCommentaries(distanceFromEnd);
							}}
							ListFooterComponent={ this.renderFooter.bind(this)}
						/>
					</View>
					{

						heimdallr.email !== 'spotted@utfpr.com' &&

						<FAB
						style={styles.fab}
						small
						icon={require('../../../../assets/images/comment-regular.png')}
						onPress={this._openCommentaryWriter.bind(this)}
					  />

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
					<ReportGod  close={this.closeAlert.bind(this)} idEntity={this.state.postId} typeEntity = {'post'}/>
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
				<Modal
					statusBarTranslucent={false}
					transparent={true}
					hardwareAccelerated={true}
					animationType='slide'
					visible={this.state.showCommentaryModal}
					onDismiss={this._hideModal}
					onRequestClose={this._hideModal.bind(this)}
					contentContainerStyle={{backgroundColor: 'white', width: width + 10, height: height, position: 'absolute'}}
				>
					<CommentaryWriter close={this._hideModal.bind(this)} context={this}/>
				</Modal>
			</KeyboardAvoidingView>
		);
	}
}


const styles = StyleSheet.create({
	colContainer: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		borderTopWidth: 0.2,
		borderColor: 'rgba(59, 56, 50, 0.2)',
		flex: 1,
		width:theme.width*0.99,

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
	body: {
		flexDirection: 'column',
		marginBottom:theme.height * 0.02,
		width:theme.width * 0.81,
	},
	postHeader: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		height: 15,
		fontWeight: 'bold',
		alignItems: 'center',
		alignContent: 'center',
		width: width * 0.70,
	},
	post: {
		width: width * 0.8,
		padding: 2,
		borderRadius: 8,
		color: 'black',
		alignSelf:'flex-end',
	},
	fab: {
		position: 'absolute',
		backgroundColor: theme.primary,
		marginTop: theme.height * 0.75,
		marginLeft: theme.width * 0.80,
		padding: 5,

	}
});
