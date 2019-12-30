import React from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Button,

} from 'react-native';


import Home from './Home';
import Login from "./Login";
import MenuDrawer from "react-native-side-drawer";
import Drawer from "react-native-drawer";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import SideDrawer from "../../../../components/General/SideDrawer";
// import heimdallr from "../../../../components/Heimdallr/Heimdallr";
// import SideDrawer from "../../../../components/General/SideDrawer";
const width = Dimensions.get('screen').width;

export default class MainScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			postText: '',
			postImages: [],
			open: false,
			isLogged: false,
		};
	}

	componentDidMount(): void {
		let login = heimdallr.checkUser();
		login.then((resolve) => {
			console.log('checkado: ', resolve);
			if (heimdallr.user_id) {
				console.log('%c LOGGED', 'color: green');
				this.setState({isLogged: true});
			}
		})
	}

	toggleOpen = () => {
		this.setState({open: !this.state.open});
	};

	signUp = (data) => {
		let user = heimdallr.signIn(data);
		user.then((resolve) => {
			console.log('resolve asdasdasD:', resolve);
			if (resolve.user) {
				this.setState({isLogged: true});
			}
		});
	}

	openModal = () => {
		heimdallr.signOut();
		// this.setState({open: true});
		// this._drawer.open();
	}

	closeModal = () => {
		this.setState({open: false});
	}

	drawerContent = () => {
		return (
			<SideDrawer/>
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
						acceptPan={true}
						negotiatePan={true}
						panThreshold={0.1}
						panOpenMask={0.7}
					>
						<View style={styles.header}>
							<TouchableOpacity onPress={this.openModal.bind(this)}>
								<Image source={require('../../../../assets/images/bars-solid.png')}
								       style={{width: 30, height: 30, tintColor: 'white'}}/>
							</TouchableOpacity>
							<Text style={{color: 'white', fontSize: 24, marginLeft: 100}}>
								Spotted
							</Text>
						</View>
						<View>
							<Home navigation={this.props.navigation}/>
						</View>
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
		width: width,
		height: 40,
		backgroundColor: 'red',
		color: 'white',
		// justifyContent: 'center',
		// alignItems: 'center',
		flexDirection: 'row',
		padding: 5,
		margin: 0,
		paddingHorizontal: 10,
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
	}
});
