import React from 'react';

import {
	Dimensions,
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	StatusBar,
	Modal,
	BackHandler,
	Text
} from 'react-native';

import {
	BottomNavigation,
} from 'react-native-paper'


import Home from './Home';
import Login from "./Login";
import UserProfile from "./UserProfile";
import PostWrite from "./Inputs/PostWrite";
import UsersSearch from "./UsersSearch";
import Drawer from "react-native-drawer";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import SideDrawer from "../../../../components/General/SideDrawer";
import theme from "../../../../components/General/Theme";
import Settings from "./Settings";
import NotificationScreen from "./NotificationScreen";
import Tickets from "./Tickets";
import {NavigationActions, ScrollView, StackActions} from "react-navigation";
import FatBottomedButton from "./buttons/FatBottomedButton";

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default class MainScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			postText: '',
			numberBadge: null,
			postImages: [],
			open: false,
			isLogged: false,
			index: 0,
			showModal: false,
			showSettingsModal: false,
			showTickets: false,
			showStore: true,
			store: 'cac',
			routes: [
				{ key: 'home', icon: require('../../../../assets/images/home-solid.png') },
				{ key: 'search', icon: require('../../../../assets/images/search-solid.png') },
				{ key: 'post', icon: require('../../../../assets/images/plus-circle.png')},
				{ key: 'notifications', icon: require('../../../../assets/images/bell.png')},
				{ key: 'user', icon: require('../../../../assets/images/user-solid.png') },
			],
			showMessageModal: false,
			message: {},
		};
	}
	getHome = () => {return<Home ref={homeScreen => {this.homeScreen = homeScreen}} navigation={this.props.navigation}/>};
	getUserProfile = () => {return<UserProfile navigation={this.props.navigation} user={heimdallr.user_id}/>}
	getUsersSearch = () => { return <UsersSearch navigation={this.props.navigation}/>}
	getNotification = () => { return <NotificationScreen ref={notifications => {this.notifications = notifications}}  navigation={this.props.navigation}/> }
	_handleIndexChange = (index) => {
		if (index === 2) {
			this.setState({ showModal: true });
			this.setState({ index: 0 });
		} else if (index == 3 && this.notifications) {
			this.notifications.getData(this);
			this.setState({ index });
		} else {
			this.setState({ index })
		}
	};

	renderScene = BottomNavigation.SceneMap({
		home: this.getHome,
		post: PostWrite,
		user: this.getUserProfile,
		search: this.getUsersSearch,
		notifications: this.getNotification,
	});

	postCall = (item) => {
		this.setState({ showModal: false });
		this.homeScreen.addItem(item);
	}

	_hideModal = () => {
		this.setState({ showModal: false });
	};

	_hideModalAndRefresh = () => {
		this.setState({ showModal: false });
		this.homeScreen.setRefreshing();
	};

	_hideSettingsModal = () => {
		this.setState({ showSettingsModal: false });
	}

	componentWillUnmount = () => {
		BackHandler.removeEventListener('hardwareBackPress');
	}

	componentDidMount = async () => {
		// Tratamento para click de voltar quando se está na raiz no pp
		BackHandler.addEventListener('hardwareBackPress', () => {
			if (this.props.navigation.isFocused()) {
				if (this.state.open) {
					this._drawer.close();
					return true;
				} else if (this.state.index !== 0){
					this.setState({ index: 0 });
					return true;
				}
			}
		})

		// Tratamento para quando foi feito logOut mas o front não atualizou
		if (this.props.navigation.getParam('logOut')) {
			this.logOut();
			return ;
		}


		heimdallr.sendEvent('app_open');
		const anonymousRoutes =  [
			{ key: 'home', icon: require('../../../../assets/images/home-solid.png') },
			{ key: 'search', icon: require('../../../../assets/images/search-solid.png') },
		];

		// Estilo da barra superior do S.O.
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content', true);

		let login = heimdallr.checkUser();
		login.then(() => {
			if (heimdallr.user_id) {
				this.setState({isLogged: true});
				if (heimdallr.email === 'spotted@utfpr.com') {
					this.setState({ routes: anonymousRoutes });
				}
			}
		})


		heimdallr.getNotificationsNumber(this);
		heimdallr.testLink(this.props.navigation);
		heimdallr.getDeviceToken();
		heimdallr.testNotification(this.props.navigation);
		heimdallr.setLastSeen();
		// Método para mostar notificações ao usuário
		// let messages= await AsyncStorage.getItem('user_messages');
		// 	messages = JSON.parse(messages)
		// 	for (let i = 0; i < messages.length ; i++) {
		// 		console.log('passa');
		// 		if (!messages[i].viewed) {
		// 			console.log('entrou');
		// 			messages[i].viewed = true;
		// 			await AsyncStorage.setItem('user_messages', JSON.stringify(messages));
		// 			console.log('vou chamar');
		// 			heimdallr.updateUserMessages(i);
		// 			this.setState({ message:  messages[i], showMessageModal: true});
		// 			break;
		// 		}
		// 	}

	}

	_checkRoute = (route) => {
		if (route.route.key === 'home' && this.state.index === 0) {
			this.homeScreen.onRefresh();
			this.homeScreen.scrollToTop();
		}
	}

	getBadge = (prop) => {
		if (prop.route.key === 'notifications') {
			if(this.state.numberBadge > 0){
				return this.state.numberBadge;
			}
			else{
				return null;
			}
		}
		return null;
	}

	signUp = async (data) => {
		if (!data.user || data.user === '' || !data.password || data.password === '') {
			return false;
		}
		let user = heimdallr.signIn(data);
		await user.then((resolve) => {
			if (resolve.user) {
				this.setState({isLogged: true});
				return true;
			} else {
				return false;
			}
		});

	}

	openModal = () => {
		this._drawer.open();
	}

	logOut = () => {
		this.state.isLogged = false
	}

	setAction = (action) => {
		switch (action) {
			case 'settings':
				this.setState({ showSettingsModal: true });
				this._drawer.close();
				break;
			case 'signIn':
				heimdallr.signOut().then(() => {
					const resetAction = StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: 'SignUp' })],
					});
					this.props.navigation.dispatch(resetAction);
				});
				break;
			case 'signOut':
				this.logOut();
				break;
			case 'closeHome':
				this.setState({isLogged: false});
				break;
			case 'cac':
				this.setState({ showStore: true, store: 'cac' });
				break;
		}
	}

	drawerContent = () => {
		return (
			<SideDrawer navigation={this.props.navigation} actionPressed={this.setAction}/>
		);
	};

	disableMessageModal = () => {
		this.setState({ showMessageModal: false });
	}

	cancelButtonMessage = () => {
		this.setState({ showMessageModal: false });
	}

	confirmButtonMessage = () => {
		this.setState({ showMessageModal: false });
	}


	returnContent = () => {
		if (!this.state.isLogged) {
			return (
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<Login login={this.signUp} navigation={this.props.navigation}/>
				</View>
			)
		} else {
			return (
				<View style={styles.container}>
					<Modal
						hardwareAccelerated={true}
						animationType='fade'
						transparent={true}
						visible={this.state.showMessageModal}
						onRequestClose={() => { this.disableMessageModal() }}
						style = {{ height: 50, width: theme.width * 0.5 }}
					>
						<View style = {styles.centeredView}>
							<View  style = { styles.modalContainer }>
								<View style = {styles.modalHeader }>
									<TouchableOpacity
										onPress={() => {this.disableMessageModal()}}>
										<View style = {{ width: theme.width * 0.15, height: theme.height*0.05, alignSelf: 'flex-end' }}>
											<Image
												style = {{ width: 15, height: 15, alignSelf: 'flex-end', tintColor: 'white' }}
												source = {require('../../../../assets/images/times-solid.png')}
											/>
										</View>
									</TouchableOpacity>
									<Text style = {{ marginTop: -(theme.height *  0.025), fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5, alignSelf: 'center', color: 'white'}}>{this.state.message.title}</Text>
								</View>
								<ScrollView style={ styles.modalBody}>
										{
											this.state.message.image &&
											<View style={{width: theme.width * 0.85, height: theme.height * 0.4}}>
												<Image
													source={{uri: this.state.message.image}}
													style={{resizeMode: 'contain', flex: 1}}
												/>
											</View>
										}
									<View style={{flex: 1, width: theme.width * 0.9, flexDirection: 'row'}}>
										<Text style={{flex: 1, flexWrap:'wrap'}}>{this.state.message.text}</Text>
									</View>
									<View style={{marginTop: 10, flexDirection: 'row', marginBottom: 5}}>
										{
											this.state.message.cancelButton &&
											<View style={{width: theme.width * 0.4}}>
												<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={this.state.message.cancelButton} onTap={this.cancelButtonMessage.bind(this)} />
											</View>
										}
										<View style={{width: this.state.message.cancelButton ? theme.width * 0.4 : theme.width * 0.8, marginLeft: this.state.message.cancelButton ? theme.width * 0.05 : 0}}>
											<FatBottomedButton backgroundColor = {theme.primary} color={'white'} text={this.state.message.confirmButton} onTap={this.confirmButtonMessage.bind(this)} />
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					</Modal>
					<Drawer
						content={this.drawerContent()}
						ref={(ref) => this._drawer = ref}
						openDrawerOffset={100}
						type='overlay'
						captureGestures={true}
						tweenDuration={250}
						openDrawerOffset={0.1} // 20% gap on the right side of drawer
						closedDrawerOffset={0}
						tapToClose={true}
						tweenHandler={(ratio) => ({
							main: { backgroundColor: !ratio ? null : 'black' }
						})}
						acceptPan={true}
						negotiatePan={true}
						panThreshold={0.1}
						panOpenMask={0.1}
						onOpen={() => this.state.open = true}
						onClose={() => this.state.open = false}
					>
						<View style={styles.header}>
							<TouchableOpacity
								activeOpacity={1}
	                            onPress={this.openModal.bind(this)}
							>
							<View style = {{width:theme.width * 0.2, height:theme.height * 0.07}}>
								<Image source={require('../../../../assets/images/bars-solid.png')}
									   style={{width: 25, height: 25, tintColor: theme.primary, marginTop:10,
											marginLeft:10}}/>
							</View>
							</TouchableOpacity>
							<Image
								style={styles.headerImage}
								source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/app-icons%2Fname.png?alt=media&token=48124908-21cf-4f9d-9832-2245297842c7' }}
							/>
						</View>
						<BottomNavigation
							navigationState={this.state}
							onIndexChange={this._handleIndexChange}
							renderScene={this.renderScene}
							barStyle={styles.bottomBar}
							activeColor={theme.primary}
							getBadge={this.getBadge.bind(this)}
							sceneAnimationEnabled={false}
							shifting={false}
							labeled={false}
							onTabPress={this._checkRoute}
						/>
						<Modal
							statusBarTranslucent={false}
							transparent={true}
							hardwareAccelerated={true}
							animationType='slide'
							visible={this.state.showModal}
							onDismiss={this._hideModal}
							onRequestClose={this._hideModal.bind(this)}
							contentContainerStyle={{backgroundColor: 'white', width: width + 10, height: height, position: 'absolute'}}
						>
							<PostWrite closeAndRefresh={this._hideModalAndRefresh.bind(this)} close={this._hideModal.bind(this)} call={this.postCall.bind(this)} />
						</Modal>
						<Modal
							transparent={true}
							visible={this.state.showSettingsModal}
							onDismiss={this._hideSettingsModal}
							onRequestClose={() => {
								this.setState({ showSettingsModal: false });
							}}
							contentContainerStyle={{backgroundColor: 'white', width: theme.width + 10, height: theme.height, position: 'absolute'}}
						>
							<Settings close={this._hideSettingsModal} action={this.setAction}/>
						</Modal>
						<Modal
							transparent={true}
							visible={this.state.showTickets}
							onDismiss={this._hideSettingsModal}
							onRequestClose={() => {
								this.setState({ showTickets: false });
							}}
							contentContainerStyle={{backgroundColor: 'white', width: theme.width + 10, height: theme.height, position: 'absolute'}}
						>
							<Tickets />
						</Modal>

					</Drawer>
				</View>

			);
		}
	}

	render() {
		return (
			<View style={{flex: 1}}>
				{this.returnContent()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 0,
		padding: 0,
		margin: 0,
		flex: 1,
		zIndex: 0,
	},
	header: {
		backgroundColor: 'white',
		width: width + 10,
		height: 55,
		borderBottomWidth: 0.01,
		flexDirection: 'row',
		margin: 0,
		paddingHorizontal: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 10.32,
		elevation: 12,
	},
	modalHeader: {
		flexDirection: 'column',
		width: theme.width * 0.9,
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		padding: 20,
		height: theme.height * 0.15,
		backgroundColor: theme.primary
	},
	animatedBox: {
		flex: 1,
		backgroundColor: "#38C8EC",
	},
	body: {
		flex: 1,
		margin: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F04812'
	},
	bottomBar: {
		backgroundColor: 'white',
	},
	headerImage: {
		width: 120,
		height: 40,
		alignSelf: 'center',
		marginLeft: theme.width * 0.15
	},
	modalBody: {
		paddingLeft: 5,
		paddingRight: 5,
		marginBottom: 5,
		height: theme.height * 1,
		width: theme.width * 0.9,
	},
	modalContainer: {
		width: theme.width * 0.9,
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 0,
		height: theme.height * 0.8,
		flexDirection: 'column',
		padding: 0,

	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: -(theme.height * 0.1),
		paddingTop:theme.height * 0.1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
});
