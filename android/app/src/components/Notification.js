import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Dimensions,
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";

const width = Dimensions.get('screen').width;

export default class Notification extends React.Component {
	constructor (props) {
		super(props);
		this.state = {

		};
    }

    return = () => {
		this.props.navigation.goBack();
    }

    goToUserProfile = () => {
		 this.props.navigation.navigate('UserProfile', {
			userId: this.props.uid_notification,
		}); 

    }
    
    goToPostDetails = () => {
        this.props.navigation.navigate('PostDetails',{
            pid:this.props.pid,
        })
    }
    
    render = () => {
		return (
            <View style = {this.props.visualized > 0 ? styles.postVisualized : styles.noVisualized}>
                <TouchableOpacity  onPress={this.goToUserProfile.bind(this)}>
                    <UserImgProfile circular height={45} width={45}  uri={this.props.image_uri}/>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.goToPostDetails.bind(this)}>
	                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: theme.width * 0.9}}>
                        <Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{this.props.user_name}</Text>
		                <Text style={{flexWrap: 'wrap'}}>
                             comentou na sua postagem:
                        </Text>
		                <Text style={{flexWrap: 'wrap',}}>
			                "{this.props.notification_text}"
		                </Text>
	                </View>
                </TouchableOpacity>
            </View>
		);
	}
}

const styles = StyleSheet.create({
    postVisualized: {
        alignSelf: 'flex-start',
	    flex: 1,
        width: theme.width + 4,
        padding: 8,
        paddingLeft: 15,
        paddingTop: 15,
        paddingRight: 10,
        paddingBottom: 15,
        color: 'black',
        flexDirection: 'row', 
        borderWidth: 0.2,
        borderColor: 'rgba(59, 56, 50, 0.2)',
        
    },
    noVisualized: {
        backgroundColor: '#e0e0eb',
        alignSelf: 'flex-start',
	    flex: 1,
	    width: theme.width + 4,
        paddingLeft:15,
        paddingTop: 15,
        paddingRight:10,
        paddingBottom:15,
        color: 'black',
        flexDirection: 'row', 
        borderWidth:0.2,
        borderColor: 'rgba(59, 56, 50, 0.2)',
        
    },
        
})