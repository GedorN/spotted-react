import React from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Button,
	StatusBar,
	KeyboardAvoidingView,
	Modal,
} from 'react-native';


import {
	BottomNavigation,
} from 'react-native-paper'

import Home from './Home';
import Login from "./Login";
import UserProfile from "./UserProfile";
import PostWrite from "./Inputs/PostWrite";
import UsersSearch from "./UsersSearch";
import MenuDrawer from "react-native-side-drawer";
import Drawer from "react-native-drawer";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import SideDrawer from "../../../../components/General/SideDrawer";
import theme from "../../../../components/General/Theme";
import Settings from "./Settings";
// import heimdallr from "../../../../components/Heimdallr/Heimdallr";
// import SideDrawer from "../../../../components/General/SideDrawer";
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default class MainScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			postText: '',
			postImages: [],
			open: false,
			isLogged: false,
			index: 0,
			showModal: false,
			showSettingsModal: false,
			routes: [
				{ key: 'home', icon: require('../../../../assets/images/home-solid.png') },
				{ key: 'search', icon: require('../../../../assets/images/search-solid.png') },
				{ key: 'post', icon: require('../../../../assets/images/plus-square.png')},
				{ key: 'user', icon: require('../../../../assets/images/user-solid.png') },
			],
		};
	}
	getHome = () => {return<Home ref={homeScreen => {this.homeScreen = homeScreen}} navigation={this.props.navigation}/>};
	getUserProfile = () => {return<UserProfile navigation={this.props.navigation} user={heimdallr.user_id}/>}
	getUsersSearch = () => { return <UsersSearch navigation={this.props.navigation}/>}
	_handleIndexChange = (index) => {
		if (index === 2) {
			this.setState({ showModal: true });
			this.setState({ index: 0 });
		} else {
			this.setState({ index })
		}
	};

	// renderScene = ({ route, jumpTo }) => {
	// 	switch (route.key) {
	// 		case 'home':
	// 			return <Home navigation={this.props.navigation}/>;
	// 		case 'post':
	// 			return <PostWrite />;
	// 		default:
	// 			return <Home navigation={this.props.navigation}/>;
	// 	}
	// }
	renderScene = BottomNavigation.SceneMap({
		home: this.getHome,
		post: PostWrite,
		user: this.getUserProfile,
		search: this.getUsersSearch,
	});

	postCall = () => {
		this.homeScreen.onRefresh();
	}

	_hideModal = () => {
		this.setState({ showModal: false })
	};

	_hideSettingsModal = () => this.setState({ showSettingsModal: false });

	componentDidMount(): void {
		const anonymousRoutes =  [
			{ key: 'home', icon: require('../../../../assets/images/home-solid.png') },
			{ key: 'search', icon: require('../../../../assets/images/search-solid.png') },
		];
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content', true);
		let login = heimdallr.checkUser();
		login.then((resolve) => {
			if (heimdallr.user_id) {
				this.setState({isLogged: true});
				if (heimdallr.email === 'spotted@utfpr.com') {
					this.setState({ routes: anonymousRoutes });
				}
			}
		})
	}

	toggleOpen = () => {
		this.setState({open: !this.state.open});
	};

	signUp = async (data) => {
		if (!data.user || data.user === '' || !data.password || data.password === '') {
			return false;
		}
		let loggedState = false;
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
		// heimdallr.signOut();
		// this.forceUpdate();
		this._drawer.open();
	}

	closeModal = () => {
		this.setState({open: false});
	}

	setAction = (action) => {
		switch (action) {
			case 'settings':
				this.setState({ showSettingsModal: true });
				this._drawer.close();
				break;
			case 'signIn':
				heimdallr.signOut();
				this.props.navigation.navigate('SignUp', {navigation: this.props.navigation});				break;
		}
	}

	drawerContent = () => {
		return (
			<SideDrawer actionPressed={this.setAction}/>
		);
		//TODO tirar margem do topo
	};

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
					<Drawer
						content={this.drawerContent()}
						ref={(ref) => this._drawer = ref}
						openDrawerOffset={100}
						type='overlay'
						captureGestures={true}
						tweenDuration={250}
						openDrawerOffset={0.2} // 20% gap on the right side of drawer
						// panCloseMask={0.9}
						closedDrawerOffset={-3}
						tapToClose={true}
						tweenHandler={(ratio) => ({
							main: { opacity: !ratio ? 1 : 0.2, backgroundColor: !ratio ? null : 'black' }
						})}
						acceptPan={true}
						negotiatePan={true}
						panThreshold={0.1}
						panOpenMask={0.5}
					>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.openModal.bind(this)}>
								<Image source={require('../../../../assets/images/bars-solid.png')}
									   style={{width: 25, height: 25, tintColor: theme.primary, marginTop:7,
											marginLeft:10}}/>
							</TouchableOpacity>
							{/*<Text style={{color: 'white', fontSize: 24, marginLeft: 100}}>*/}
							{/*	Spotted*/}
							{/*</Text>*/}
							<Image
								style={styles.headerImage}
								source={require('../../../../assets/images/name.png')}
							/>
						</View>
						{/*<View>*/}
						{/*	<Home navigation={this.props.navigation}/>*/}
						{/*</View>*/}
						<BottomNavigation
							navigationState={this.state}
							onIndexChange={this._handleIndexChange}
							renderScene={this.renderScene}
							barStyle={styles.bottomBar}
							activeColor={theme.primary}
							// inactiveColor={'black'}
							sceneAnimationEnabled={false}
							shifting={false}
							labeled={false}
						/>
						<Modal
							statusBarTranslucent={true}
							hardwareAccelerated={true}
							animationType='fade'
							visible={this.state.showModal}
							onDismiss={this._hideModal}
							contentContainerStyle={{backgroundColor: 'white', width: width + 10, height: height, position: 'absolute'}}
						>
							<PostWrite close={this._hideModal.bind(this)} call={this.postCall.bind(this)} />
						</Modal>
						<Modal
							visible={this.state.showSettingsModal}
							onDismiss={this._hideSettingsModal}
							contentContainerStyle={{backgroundColor: 'white', width: width + 10, height: height, position: 'absolute'}}
						>
							<Settings close={this._hideSettingsModal}/>
						</Modal>
					</Drawer>
					{/*<MenuDrawer*/}
					{/*    open={this.state.open}*/}
					{/*    drawerContent={this.drawerContent()}*/}
					{/*    drawerPercentage={60}*/}
					{/*    animationTime={100}*/}
					{/*    overlay={true}*/}
					{/*    opacity={0.4}*/}
					{/*    style={{margin: 0, padding: 0, width: 0, height: 0, display: 'none'}}*/}
					{/*>*/}
					{/*</MenuDrawer>*/}

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
		// backgroundColor:'blue'
	},
	header: {
		backgroundColor: 'white',
		width: width + 10,
		height: 55,
		borderBottomWidth: 0.01,
		// justifyContent: 'center',
		// alignItems: 'center',
		flexDirection: 'row',
		// padding: 5,
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
		borderTopWidth: 1,
		borderColor: theme.primary,
	},
	headerImage: {
		width: 120,
		height: 40,
		alignSelf: 'center',
		marginLeft: 90
	},
});
