import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
	Image,
} from 'react-native';

import UserImgProfile from "./UserImgProfile";
import theme from "./Theme";
import heimdallr from "../Heimdallr/Heimdallr";

export default class SideDrawer extends React.Component {
    constructor () {
        super ();
        this.state= {};
    }

    actionPressed = (action) => {
	    this.props.actionPressed(action);
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
                        onPress={this.actionPressed.bind(this, 'settings')}>
	                    <View style={styles.item}>
		                    <Image source={require('../../assets/images/user-cog-solid.png')}
		                        style={{
			                        tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,
			                        width: 40,
			                        height: 32,
			                        marginRight: 13,
		                        }}
		                    />
		                    <Text> Configurações </Text>
	                    </View>
                    </TouchableOpacity>
	                {/*<TouchableOpacity disabled={heimdallr.email === 'spotted@utfpr.com'}*/}
	                {/*                  onPress={this.actionPressed.bind(this, 'cac')}>*/}
		            {/*    <View style={styles.item}>*/}
			        {/*        <Image source={require('../../assets/images/user-cog-solid.png')}*/}
			        {/*               style={{*/}
				    {/*                   tintColor: heimdallr.email === 'spotted@utfpr.com' ? 'gray' : theme.primary,*/}
				    {/*                   width: 40,*/}
				    {/*                   height: 32,*/}
				    {/*                   marginRight: 13,*/}
			        {/*               }}*/}
			        {/*        />*/}
			        {/*        <Text> Proto store </Text>*/}
		            {/*    </View>*/}
	                {/*</TouchableOpacity>*/}
	                {
		                heimdallr.email === 'spotted@utfpr.com' &&
		                <TouchableOpacity
			                style={{position: 'absolute', bottom: 8, paddingLeft: 22}}
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
				                <Text> Registrar-se </Text>
			                </View>
		                </TouchableOpacity>
	                }
	                {
		                heimdallr.email !== 'spotted@utfpr.com' &&
		                <TouchableOpacity
			                style={{position: 'absolute', bottom: 8, paddingLeft: 22}}
			                onPress={() => {this.props.actionPressed('signOut')}}>
			                <View style={styles.item}>
				                <Image source={require('../../assets/images/sign-in-alt-solid.png')}
				                       style={{
					                       tintColor: theme.primary,
					                       width: 40,
					                       height: 32,
					                       marginRight: 13,
				                       }}
				                />
				                <Text> Desconectar </Text>
			                </View>
		                </TouchableOpacity>
	                }
	                <TouchableOpacity style={{position: 'absolute', bottom: 2, paddingLeft: 22}}>
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
	},
    drawerHeader: {
        flex: 1,
	    borderBottomWidth: 1,
	    borderColor: theme.primary,
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
