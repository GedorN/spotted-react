import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
	Image,
	DeviceEventEmitter
} from 'react-native';

import UserImgProfile from "./UserImgProfile";
import theme from "./Theme";
import heimdallr from "../Heimdallr/Heimdallr";

export default class SideDrawer extends React.Component {
    constructor () {
        super ();
        this.state= {};
    }

    componentDidMount(): void {
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

    render () {
        return (
            <View style={styles.container}>
                <View style={styles.drawerHeader}>
	                <View style={{flexDirection: 'column', alignItems: 'center', flex: 1}}>
	                    <UserImgProfile circular height={100} width={100} uri={heimdallr.user_image} style={styles.userImage} />
	                    <Text
	                        style={styles.userName}
	                    >
	                        {heimdallr.user_name}
	                    </Text>
	                </View>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
                                      onPressIn={() => heimdallr.sendEvent('config_menu_click')}
                                      onPress={() => {this.props.navigation.push('Settings', {navigation: this.props.navigation})}}>
	                    <View style={styles.item}>
							<View style = {{ width: 57 }}>
								<Image source={require('../../assets/images/user-cog-solid.png')}
									style={{
										tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
										width: 35,
										height: 27,
										marginRight: 13,
									}}
								/>
							</View>
		                    <Text> Configurações </Text>
	                    </View>
                    </TouchableOpacity>
					<TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
					                  onPressIn={() => {heimdallr.checkTicketsStatus(); heimdallr.sendEvent('tickts_menu_click')}}
					                  onPress={() => {this.props.navigation.push('Tickets',  {navigation: this.props.navigation})}}>
		                <View style={styles.item}>
							<View style = {{ width: 57 }}>
								<Image source={require('../../assets/images/shopping-bag.png')}
									style={{
										tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
										width: 30,
										height: 34,
										marginRight: 25,
									}}
								/>
							</View>
			                <Text>Pedidos</Text>
		                </View>
	                </TouchableOpacity>
	                <TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
	                                  onPressIn={() => heimdallr.sendEvent('cac_store_click')}
	                                  onPress={() => {this.props.navigation.push('Store', {store : 'cac'})}}>
		                <View style={styles.item}>
							<View style = {{ width: 57 }}>
								<Image source={require('../../assets/images/cac_logo.png')}
									style={{
										tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : null,
										width: 45,
										height: 37,
										marginRight: 13,
									}}
								/>
							</View>
			                <Text> Loja CAC </Text>
		                </View>
	                </TouchableOpacity>
	                <TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
	                                  onPressIn={() => heimdallr.sendEvent('maleficoz_store_click')}
	                                  onPress={() => {this.props.navigation.push('Store', {store : 'maleficoz'})}}>
		                <View style={styles.item}>
							<View style = {{ width: 57 }}>
								<Image source={require('../../assets/images/maleficoz_logo.png')}
									style={{
										resizeMode: 'contain',
										tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : null,
										width: 52,
										height: 47,
										marginRight: 13,
										marginLeft: -3

									}}
								/>
							</View>
			                <Text> Loja MALEFICOZ </Text>
		                </View>
	                </TouchableOpacity>
	                <TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}
	                                  onPressIn={() => heimdallr.sendEvent('avalanche_store_click')}
	                                  onPress={() => {this.props.navigation.push('Store', {store : 'avalanche'})}}>
		                <View style={styles.item}>
							<View style = {{ width: 57 }}>
								<Image source={require('../../assets/images/avalanche_logo.png')}
									style={{
										resizeMode: 'contain',
										tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : null,
										width: 49,
										height: 44,
										marginRight: 13,
									}}
								/>
							</View>
			                <Text> Loja AVALANCHE </Text>
		                </View>
	                </TouchableOpacity>
	                {
		                heimdallr.email === 'spotted@utfpr.com' &&
		                <TouchableOpacity
			                style={{position: 'absolute', bottom: 8, paddingLeft: 22, opacity: 0.8}}
			                onPress={() => {this.props.actionPressed('signIn')}}>
			                <View style={styles.item}>
				                <Image source={require('../../assets/images/sign-in-alt-solid.png')}
				                       style={{
					                       tintColor: theme.primary,
					                       width: 40,
					                       height: 32,
					                       marginRight: 13,
				                       }}
				                />
				                <Text>{ 'Registrar-se' }</Text>
			                </View>
		                </TouchableOpacity>
	                }
	                <TouchableOpacity
		                onPressIn={() => heimdallr.sendEvent('aboutUs_click')}
		                onPress={() => {this.props.navigation.push('AboutUs')}}
		                style={{position: 'absolute', bottom: 2, paddingLeft: 22}}>
		                <View >
			                <Text> About us </Text>
		                </View>
	                </TouchableOpacity>
                </View>
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
	    paddingTop: 8,
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
    userImage: {

    }
});
