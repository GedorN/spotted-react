import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	DeviceEventEmitter,
	Animated,
	ScrollView, Easing
} from 'react-native';

import UserImgProfile from "./UserImgProfile";
import theme from "./Theme";
import heimdallr from "../Heimdallr/Heimdallr";

const spinValue = new Animated.Value(0);

export default class SideDrawer extends React.Component {
    constructor () {
        super ();
        this.state= {
        	stores: null,
	        drawerType: 0,
	        spin: spinValue.interpolate({
		        inputRange: [0, 1],
		        outputRange: ['0deg', '-180deg']
	        })
        };
    }

    componentDidMount = () => {
	    heimdallr.getDrawer().then(
		    (res) => {
		    	this.setState({ stores: res.items });
		    }
	    );

    	if (!heimdallr.user_name) {
		    let interval = setInterval(() => {
	            this.setState({  });
	            if (heimdallr.user_name) {
	                clearInterval(interval);
			    }
		    }, 3000);
	    }
    }



	actionPressed = (action) => {
    	heimdallr.signOut().then((resolve) => {
			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'SignUp' })],
			});
			this.props.navigation.dispatch(resetAction);
	    })
    }

    toggleDrawerContent = () => {
    	switch (this.state.drawerType) {
		    case 0:
			    this.setState({ drawerType: 1 });
			    Animated.timing(
				    spinValue,
				    {
					    toValue: 1,
					    duration: 200,
					    easing: Easing.linear, // Easing is an additional import from react-native
					    useNativeDriver: true  // To make use of native driver for performance
				    }
			    ).start();
			    break;
		    case 1:
		    	this.setState({ drawerType: 0 });
			    Animated.timing(
				    spinValue,
				    {
					    toValue: 0,
					    duration: 200,
					    easing: Easing.linear, // Easing is an additional import from react-native
					    useNativeDriver: true  // To make use of native driver for performance
				    }
			    ).start();
			    break;

	    }
    }

    getDrawerContent = () => {
    	if (this.state.drawerType === 0) {
		    return (
			    <View style={styles.content}>
				    <ScrollView contentContainerStyle= {styles.scrollview}
				                showsVerticalScrollIndicator = {false}>
					    <View >
						    <TouchableOpacity
							    onPressIn={() => heimdallr.sendEvent('board_menu_click')}
							    onPress={() => {this.props.navigation.push('Board', {navigation: this.props.navigation})}}>
							    <View style={styles.item}>
								    <View style = {{ width: 45, height: 45, marginRight: 13 }}>
									    <Image source={require('../../assets/images/UTFPR.png')}
									           style={{
										           resizeMode: 'contain',
										           flex:1,
										           width: null,
										           height: null,
									           }}
									    />
								    </View>
								    <Text>Mural UTFPR</Text>
							    </View>
						    </TouchableOpacity>
						    <TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
						                      onPressIn={() => {heimdallr.checkTicketsStatus(); heimdallr.sendEvent('tickts_menu_click')}}
						                      onPress={() => {this.props.navigation.push('Tickets',  {navigation: this.props.navigation})}}>
							    <View style={styles.item}>
								    <View style = {{ width: 45, height: 45, marginRight: 13 }}>
									    <Image source={require('../../assets/images/shopping-bag.png')}
									           style={{
										           tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
										           width: 28,
										           height: 32,
										           marginRight: 25,
									           }}
									    />
								    </View>
								    <Text>Pedidos</Text>
							    </View>
						    </TouchableOpacity>
						    {
							    this.state.stores &&
							    this.state.stores.map((s) =>
								    <TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
								                      onPressIn={() => heimdallr.sendEvent(s.event)}
								                      onPress={() => {this.props.navigation.push('Store', {store : s.key})}}>
									    <View style={styles.item}>
										    <View style = {{ width: 45, height: 45, marginRight: 13 }}>
											    <Image source={{uri: s.icon}}
											           style={{
												           resizeMode: 'contain',
												           tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : null,
												           flex:1,
												           width: null,
												           height: null,
											           }}
											    />
										    </View>
										    <Text> {s.text} </Text>
									    </View>
								    </TouchableOpacity>
							    )
						    }
						    {
							    heimdallr.email === 'spotted@utfpr.com' &&
							    <TouchableOpacity onPress={() => {this.props.actionPressed('signIn')}}>
								    <View style={styles.item}>
									    <View style = {{ width: 45, height: 45, marginRight: 13 }}>
										    <Image source={require('../../assets/images/sign-in-alt-solid.png')}
										           style={{
											           resizeMode: 'contain',
											           tintColor: theme.primary,
											           width: null,
											           height: null,
											           flex:1,
											           opacity: 0.8
										           }}
										    />
									    </View>
									    <Text>{ 'Registrar-se' }</Text>
								    </View>
							    </TouchableOpacity>
						    }
					    </View>
					    <View>
						    <TouchableOpacity
							    onPressIn={() => heimdallr.sendEvent('aboutUs_click')}
							    onPress={() => {this.props.navigation.push('AboutUs')}}>
							    <View style = {styles.aboutUs}>
								    <Text> About us </Text>
							    </View>
						    </TouchableOpacity>
					    </View>
				    </ScrollView>
			    </View>
		    )
	    } else {
    		return (
			    <View style={styles.content}>
				    <ScrollView contentContainerStyle= {styles.scrollview}
				                showsVerticalScrollIndicator = {false}>
					    <View >
						    <TouchableOpacity
							    onPressIn={() => heimdallr.sendEvent('board_menu_click')}
							    onPress={() => {this.props.navigation.push('Settings', {navigation: this.props.navigation})}}>
							    <View style={styles.item}>
								    <View style = {{ width: 30, height: 30, marginRight: 13 }}>
									    <Image source={require('../../assets/images/cog-solid.png')}
									           style={{
										           resizeMode: 'contain',
										           flex:1,
										           width: null,
										           height: null,
									           }}
									    />
								    </View>
								    <Text>Configurações</Text>
							    </View>
						    </TouchableOpacity>
						    <TouchableOpacity
							    onPressIn={() => heimdallr.sendEvent('send_phone_request_click')}
							    onPress={() => {this.props.navigation.push('ReceivedRequests')}}>
							    <View style={styles.item}>
								    <View style = {{ width: 30, height: 30, marginRight: 13 }}>
									    <Image source={require('../../assets/images/sender_phone.png')}
									           style={{
										           resizeMode: 'contain',
										           flex:1,
										           width: null,
										           height: null,
									           }}
									    />
								    </View>
								    <Text>Minhas solicitações</Text>
							    </View>
						    </TouchableOpacity>
						    <TouchableOpacity
							    onPressIn={() => heimdallr.sendEvent('received_phone_request_click')}
							    onPress={() => {this.props.navigation.push('ReceivedRequests')}}>
							    <View style={styles.item}>
								    <View style = {{ width: 30, height: 30, marginRight: 13 }}>
									    <Image source={require('../../assets/images/receiver_phone.png')}
									           style={{
										           resizeMode: 'contain',
										           flex:1,
										           width: null,
										           height: null,
									           }}
									    />
								    </View>
								    <Text>Solicitações recebidas</Text>
							    </View>
						    </TouchableOpacity>
					    </View>
				    </ScrollView>
			    </View>
		    )
	    }

    }

    render () {
        return (
            <View style={styles.container}>
                <View style={styles.drawerHeader}>
	                <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
		                <TouchableOpacity
			                style={{alignSelf: 'flex-end'}}
			                disabled={heimdallr.email === 'spotted@utfpr.com'}
                            // onPressIn={() => heimdallr.sendEvent('config_menu_click')}
			                onPressIn={this.toggleDrawerContent.bind(this)}
                            // onPress={() => {this.props.navigation.push('Settings', {navigation: this.props.navigation})}}
		                >
			                <Animated.Image source={require('../../assets/images/sort-down-solid.png')}
			                       style={{
			                            alignSelf: 'flex-end',
				                       tintColor: 'gray',
				                       width: 20,
				                       height: 30,
				                       marginRight: 13,
				                       transform: [{rotate: this.state.spin}]
			                       }}
			                />
		                </TouchableOpacity>
		                <TouchableOpacity
			                disabled={heimdallr.email === 'spotted@utfpr.com'}
			                onPressIn={() => heimdallr.sendEvent('config_menu_click')}
			                onPress={() => {this.props.navigation.push('Settings', {navigation: this.props.navigation})}}
		                >
	                        <UserImgProfile circular height={100} width={100} uri={heimdallr.user_image} style={styles.userImage} />
		                </TouchableOpacity>
		                <TouchableOpacity
			                disabled={heimdallr.email === 'spotted@utfpr.com'}
			                onPressIn={() => heimdallr.sendEvent('config_menu_click')}
			                onPress={() => {this.props.navigation.push('Settings', {navigation: this.props.navigation})}}
		                >
		                    <Text
		                        style={styles.userName}
		                    >
		                        {heimdallr.user_name}
		                    </Text>
		                </TouchableOpacity>
	                </View>
                </View>
	            {this.getDrawerContent()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
	    shadowColor: "#000",
	    shadowOffset: {
		    width: 0,
		    height: 2,
	    },
	    shadowOpacity: 0.23,
	    shadowRadius: 2.62,

	    elevation: 4,
    },
	item: {
    	padding: 12,
		fontSize: 18,
		color: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
    	flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 60,
		marginBottom: 21,
		width:theme.width * 0.7,
		zIndex: 100,
	},
    drawerHeader: {
        flex: 1,
	    borderBottomWidth: 1,
	    borderColor: 'rgba(163, 163, 163, 0.5)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        color: theme.primary,
	    fontSize: 21,
        marginTop: 15,
    },
    content: {
        flex: 2,
        flexDirection: 'column',
        // width: 200,,
	    width: '100%',
        alignItems: 'flex-start',
	    paddingLeft: 21,
	    zIndex: 9999,
    },
	landscapeIcon: {
		tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
    	width: 40,
		height: 32,
		marginRight: 13,
	},
	portraitIcon: {
    	tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
		width: 32,
		height: 36,
		marginRight: 21,
	},
	scrollview: {
    	flexDirection: 'column',
    	justifyContent: 'space-between',
		marginTop: 0,
	},
	aboutUs: {
		marginBottom: theme.height * 0.01,
		marginLeft: 12,
		zIndex: 100
	}
});
