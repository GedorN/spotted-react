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




    render () {
        return (
            <View style={styles.container}>
                <View style={styles.drawerHeader}>
                    <UserImgProfile circular height={100} width={100} uri={heimdallr.user_image} style={styles.userImage} />
                    <Text
                        style={styles.userName}
                    >
                        {heimdallr.user_name}
                    </Text>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity>
	                    <View style={styles.item}>
		                    <Image source={require('../../assets/images/user-solid.png')}
		                        style={styles.portraitIcon}
		                    />
	                        <Text> Perfil </Text>
	                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {console.warn("configs")}}>
	                    <View style={styles.item}>
		                    <Image source={require('../../assets/images/user-cog-solid.png')}
		                        style={styles.landscapeIcon}
		                    />
		                    <Text> Configurações </Text>
	                    </View>
                    </TouchableOpacity>
	                {/*<TouchableOpacity onPress={() => {console.warn("hue")}}*/}
	                {/*                  style={{marginTop: 50, backgroundColor: 'green'}}*/}
	                {/*>*/}
		            {/*    <Text> Sair </Text>*/}
	                {/*</TouchableOpacity>*/}
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
        padding: 10,
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
    	padding: 2,
		fontSize: 18,
		color: theme.primary,
    	flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 60,
		width: '100%',
		marginBottom: 21,
	},
    drawerHeader: {
        flex: 1,
        flexDirection: 'column',
        width: 200,
        alignItems: 'center',
        marginTop: 25,
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
    },
	landscapeIcon: {
		tintColor: theme.primary,
    	width: 40,
		height: 32,
		marginRight: 13,
	},
	portraitIcon: {
    	tintColor: theme.primary,
		width: 32,
		height: 36,
		marginRight: 21,
	},
    userImage: {

    }
});
