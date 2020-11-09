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
	Animated,
	Easing,
} from 'react-native';

import PostViewer from "../../../../components/General/PostViewer";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import theme from "../../../../components/General/Theme";
import ImageViewer from "react-native-image-zoom-viewer";
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";
import RBSheet from "react-native-raw-bottom-sheet";
import PostOptions from "./Inputs/PostOptions";
import FatBottomedButton from "./buttons/FatBottomedButton"
const PULL_QUANTITY = 100;

const spinValue = new Animated.Value(0);

export default class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId:'',
			userName: null,
			userEmail: null,
			deviceToken: null,
			posts: null,
			pulledPosts: PULL_QUANTITY,
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
			previousPhoneRequest: null,
			showProgress: false,
			phoneRequestMade: false,
			showModal: false,
			showUserDontAcceptPhoneRequestAlert: false,
			acceptingPhoneRequests: true,
			spin: spinValue.interpolate({
				inputRange: [0, 1],
				outputRange: ['0deg', '-180deg']
			})
		};
	}


	componentDidMount = () => {
		const user_id = this.props.navigation.getParam('userId');
		if (user_id) {
			heimdallr.checkRequestPhone(user_id).then(
				() => {
					this.setState({phoneRequestMade: true});
				}
			);
			heimdallr.getUserInfo(user_id? user_id:heimdallr.user_id).then(
				(resolve) => {
					if(resolve != null){
						this.setState({userId: resolve.uid, userImage: resolve.user_image, userName: resolve.name, userEmail: resolve.email, deviceToken: resolve.deviceToken, userImageUrl: [{url: resolve.user_image}], acceptingPhoneRequests: resolve.accepting_phone_requests});
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
				() => {
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
				this.setState({ pulling: true });
				let n = this.state.pulledPosts;
				n = PULL_QUANTITY + n;
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
					this.setState({ posts: resolve, pulledPosts: n, pulling: false });
				});
			}
		}
	}

	askForPhone = async () => {
		if(this.state.phoneRequestMade) {
			this.setState({showModal: false});
		}
		else {
			this.setState({showProgress: true, phoneRequestMade: true});
			const requestPhone = {};
			requestPhone.sender_name = heimdallr.user_name;
			requestPhone.sender_image = heimdallr.user_image;
			requestPhone.sender_email = heimdallr.email;
			requestPhone.sender_id = heimdallr.user_id;
			requestPhone.sender_device_token = heimdallr.deviceToken;
			requestPhone.receiver_id = this.state.userId;
			requestPhone.receiver_name = this.state.userName;
			requestPhone.receiver_email = this.state.userEmail;
			requestPhone.receiver_image = this.state.userImageUrl[0].url;
			requestPhone.receiver_device_token = this.state.deviceToken;
			requestPhone.reading_status = false;
			requestPhone.allowed = false;
			requestPhone.date = await heimdallr.getServerTime();
			requestPhone.request_id = requestPhone.date;

			heimdallr.savePhoneRequest(requestPhone).then(
				(result) => {
					if(result) {
						this.setState({showProgress: false, previousPhoneRequest: true});
					}
				}
			);
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

	confirmReport = () => {
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

	openUserOptions = () => {
		Animated.timing(
			spinValue,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear, // Easing is an additional import from react-native
				useNativeDriver: true  // To make use of native driver for performance
			}
		).start();
		this.RBSheet.open();
		this.setState({ showUserOptions: true });
	}

	closeUserOptions = () => {
		Animated.timing(
			spinValue,
			{
				toValue: 0,
				duration: 200,
				easing: Easing.linear, // Easing is an additional import from react-native
				useNativeDriver: true  // To make use of native driver for performance
			}
		).start();
	}

	goToMyPhoneSolicitations = () => {
		this.RBSheet.close();
		this.closeUserOptions();
		this.props.navigation.push('MyPhoneRequests');
	}

	goToReceivedPhoneSolicitations = () => {
		this.RBSheet.close();
		this.closeUserOptions();
		this.props.navigation.push('ReceivedRequests');
	}

	newPhoneRequest = () => {
		this.setState({showModal: true});
		this.RBSheet.close();
		this.closeUserOptions();
	}

	disableModal = () => {
		this.setState({ showModal: false });
	}


	render() {
		return (

			<View style={{}}>
				{ this.state.findUser ?
					<View>
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
										this.props.navigation.getParam('userId') ?
										<View style={{flexDirection: 'row', padding: 0, margin: 0, width: theme.width, justifyContent: 'space-between' }}>

											<View style = {{alignSelf:'flex-start'}}>
												<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
													<View style={{flexDirection: 'row', marginTop: 2,  paddingLeft: 15, width:theme.width * 0.2,height:theme.height * 0.04}}>
														<Image
															style={{ width: 30, height: 30, marginTop:4, opacity: 0.6}}
															source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
														/>
													</View>
												</TouchableOpacity>
											</View>
											<View style = {{alignSelf:'flex-end', alignItems: 'flex-end', positionRight: 5 }}>
												<TouchableOpacity  onPress={this.openUserOptions.bind(this)}>
													<View style={{width:20 , height:30 , marginTop: 6, marginRight: 15, alignItems: 'flex-end' }}>
														<Animated.Image
															style={{ width: 20, height: 30, transform: [{rotate: this.state.spin}] }}
															source={require('../../../../assets/images/sort-down-solid.png')}
														/>
													</View>
												</TouchableOpacity>
											</View>
										</View> :
										<View style = {{alignSelf:'flex-end' }}>
											<TouchableOpacity  onPress={this.openUserOptions.bind(this)}>
												<View style={{width:20 , height:30 , marginTop: 6, marginRight: 4, alignItems: 'flex-end' }}>
													<Animated.Image
														style={{ width: 20, height: 30, transform: [{rotate: this.state.spin}] }}
														source={require('../../../../assets/images/sort-down-solid.png')}
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
										<Text style={{marginTop: 5, marginBottom: 4}}>{this.state.userName}</Text>
									</View>

								</View>
							}
							refreshControl={
								<RefreshControl
									refreshing={this.state.isRefreshing}
									onRefresh={this.onRefresh.bind(this)}
									colors={[theme.primary, '#000000']}
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
					cancelText = {"Não"}
					onConfirmPressed={() => {
						this.setState({ showAlert: false })
					}}
				/>

				<RBSheet
					ref={ref => {
						this.RBSheet = ref;
					}}
					onClose={this.closeUserOptions.bind(this)}
					height={this.state.userId === heimdallr.user_id ? 130: 80}
					animationType={'slide'}
					duration={250}
				>
					{
						this.state.userId === heimdallr.user_id &&
						<View style={{ padding: 10, paddingBottom: 0, flexDirection: `column`, flex: 1, alignContent :'space-between' }}>
							<TouchableOpacity
								onPressIn={this.goToMyPhoneSolicitations.bind(this)}
							>
								<View style = {{flexDirection: 'row', margin: 0 }}>
									<View style = {{width:theme.width * 0.15, height: theme.height * 0.08, alignSelf: 'flex-start', justifyContent: 'center'}}>
											<Image
												style = {{width: 25, height: 20, alignSelf: 'center'}}
												source = {require('../../../../assets/images/sender_phone.png')}
											/>
									</View>
									<View style={{alignItems: 'flex-start', justifyContent: 'center', fontSize: 18, height: theme.height * 0.08, width :theme.width * 0.7 }}>
										<Text> Minhas solicitações </Text>
									</View>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPressIn={this.goToReceivedPhoneSolicitations.bind(this)}
							>
								<View style = {{flexDirection: 'row', margin: 0 }}>
									<View style = {{width:theme.width * 0.15, height: theme.height * 0.08, alignSelf: 'flex-start', justifyContent: 'center'}}>
											<Image
												style = {{width: 25, height: 20, alignSelf: 'center'}}
												source = {require('../../../../assets/images/receiver_phone.png')}
											/>
									</View>
									<View style={{alignItems: 'flex-start', justifyContent: 'center', fontSize: 18, height: theme.height * 0.08, width :theme.width * 0.7 }}>
										<Text> Solicitações recebidas </Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					}
					{
						this.state.userId !== heimdallr.user_id &&
						<View style={{ padding: 10, paddingBottom: 0, flexDirection: `column`, flex: 1, alignContent :'space-between', justifyContent: 'space-between'  }}>
							<TouchableOpacity
								onPressIn={this.newPhoneRequest.bind(this)}
								disabled={!this.state.acceptingPhoneRequests}
							>
								<View style = {{flexDirection: 'row'}}>
									<View style = {{width:theme.width * 0.15, height: theme.height * 0.08, opacity:  this.state.acceptingPhoneRequests ? 1 : 0.3, alignSelf: 'flex-start', justifyContent: 'center'}}>
										<Image
											style = {{width: 25, height: 35, alignSelf: 'center'}}
											source = {require('../../../../assets/images/phone_heart.png')}
										/>
									</View>
									<View style={{alignItems: 'flex-start', justifyContent: 'center', opacity:  this.state.acceptingPhoneRequests ? 1 : 0.3, fontSize: 18, height: theme.height * 0.08, width :theme.width * 0.7}}>
										<Text> Pedir número de telefone </Text>
									</View>
									{
										!this.state.acceptingPhoneRequests &&
											<TouchableOpacity
												onPress={() => { this.RBSheet.close(); this.setState({ showUserDontAcceptPhoneRequestAlert: true }) }}
											>
												<View>
													<Image
														style = {{width: 25, height: 25, alignSelf: 'center', tintColor: '#0000ff'}}
														source={ require('../../../../assets/images/info-circle-solid.png')}
													/>
												</View>
											</TouchableOpacity>
									}
								</View>
							</TouchableOpacity>
						</View>
					}
				</RBSheet>
				<AwesomeAlert
					show={this.state.showUserDontAcceptPhoneRequestAlert}
					showProgress={false}
					title= {"Requisição bloqueada"}
					message= {"Esse usuário optou por não receber requisições de telefone"}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showConfirmButton={true}
					confirmText= {"OK"}
					confirmButtonColor={'green'}
					onConfirmPressed={() => {
						this.setState({ showUserDontAcceptPhoneRequestAlert: false })
					}}
				/>
				<Modal
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showModal}
		            onRequestClose={() => {
			            this.disableModal();
		            }}
		            style={{ height: 50, width: theme.width * 0.5 }}
	            >
		            <View style={styles.centeredView}>
			            <View style={styles.modalContainer}>
							<View style = { styles.modalHeader }>
								<TouchableOpacity onPress={() => {this.disableModal()}}>
								<View style = {{width:theme.width * 0.15,height:theme.height*0.05,alignSelf:'flex-end'}}>
									<Image
										style = {{width: 15, height: 15,opacity:0.4, alignSelf: 'flex-end', tintColor: theme.primary}}
										source = {require('../../../../assets/images/times-solid.png')}
									/>
								</View>
								</TouchableOpacity>
							</View>
							<View style = {{ height: theme.height * 0.40, flexDirection: 'column', alignContent :'space-between', justifyContent: 'space-between' }}>
								<View style = {{ marginTop: theme.height * 0.05, flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-between' }}>
									<View>
										<UserImgProfile circular height={70} width={70}  uri={heimdallr.user_image}/>
									</View>
									<View style = {{ marginTop: 20}}>
										<Image
											style = {{width: 40, height: 40, opacity:0.4, tintColor: theme.primary}}
											source = {require('../../../../assets/images/heart-solid.png')}
										/>
									</View>
									<View>
										<UserImgProfile circular height={70} width={70}  uri={this.state.userImage}/>
									</View>
								</View>
								{
									this.state.phoneRequestMade?
									<View style = {{ width: theme.width * 0.8, alignSelf: 'center' }}>
										<Text style = {{ fontSize: 17, color: theme.primary, alignSelf: 'center', fontWeight: 'bold', opacity: 0.4 }}>{'Solicitação enviada'}</Text>
									</View>
									:
									<View style = {{ width: theme.width * 0.8, alignSelf: 'center' }}>
										<Text style = {{ fontSize: 15, color: theme.primary, alignSelf: 'center' }}>{'Deseja pedir o telefone de ' + this.state.userName + ' ?'}</Text>
									</View>
								}
								<View style={{marginTop:5, width: this.state.phoneRequestMade ? theme.width * 0.5 : theme.width * 0.7, alignSelf:'center'}}>
									<FatBottomedButton backgroundColor = {theme.primary} color={theme.secondary} text={this.state.phoneRequestMade? ' OK ' : 'Pedir telefone'} onTap={this.askForPhone.bind(this)}/>
								</View>

							</View>
			            </View>
		            </View>
	            </Modal>

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
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingTop: theme.height * 0.1,
		marginTop: -(theme.height * 0.1)
	},
	modalContainer: {
		width: theme.width * 0.9,
		height: theme.height * 0.50,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		paddingBottom:20,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex:0,
	},
	modalHeader : {
		flexDirection: 'column',
		width: theme.width * 0.9,
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		padding: 20,
		paddingBottom: 0,
		position:'absolute',
		marginLeft:0.001,
	},

});
