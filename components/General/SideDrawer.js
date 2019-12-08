import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import UserImgProfile from "./UserImgProfile";
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
                        <Text> Home </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text> Configurações </Text>
                    </TouchableOpacity>
	                <TouchableOpacity onPress={() => {console.warn("hue")}}
	                                  style={{marginTop: 50, backgroundColor: 'green'}}
	                >
		                <Text> Sair </Text>
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
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 10
    },
    drawerHeader: {
        flex: 1,
        flexDirection: 'column',
        width: 200,
        alignItems: 'center',
        backgroundColor: 'blue',
        marginTop: 25,
    },
    userName: {
        color: 'white',
        marginTop: 15,
    },
    content: {
        flex: 2,
        flexDirection: 'column',
        // width: 200,
        alignItems: 'center',
        backgroundColor: 'yellow',
    },
    userImage: {

    }
});
