import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";


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
		 this.props.navigation.push('UserProfile', {
			userId: this.props.uid_notification,
		});

    }

    goToPostDetails = () => {
        this.props.navigation.push('PostDetails',{
            pid:this.props.eid,
        })
    }

    goToBoardItemDetails = () => {
        this.props.navigation.push('BoardItemDetails',{
            pid:this.props.eid,
            origin: this.props.origin,
            docName: this.props.docName,
        })
    }

    goToDetails = () => {
		if (this.props.origin) {
			switch (this.props.origin) {
				case 0:
					this.goToPostDetails();
					break;
				case 1:
					this.goToBoardItemDetails();
					break;
				default:
					break;
			}
		} else {
			this.goToPostDetails();
		}
    }

    render = () => {
		return (
            <View style = {this.props.visualized > 0 ? styles.postVisualized : styles.noVisualized}>
                <TouchableOpacity  onPress={this.props.anonymous == '0'?this.goToUserProfile.bind(this):null}>
                    <UserImgProfile circular height={45} width={45}  uri={this.props.anonymous == '0'?this.props.image_uri:null}/>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.goToDetails.bind(this)}>
                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', width: theme.width * 0.82,marginTop:14,marginLeft:7}}>
	                    {
	                    	this.props.entity === 'commentary' &&
			                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
	                            <Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{this.props.anonymous == '0'?this.props.user_name:'Anônimo'}</Text>
			                    <Text style={{flexWrap: 'wrap', marginLeft: 4}}>comentou na sua postagem:</Text>
		                        <Text style={{flexWrap: 'wrap', marginLeft: 4}}>
		                            "{this.props.notification_text}"
		                        </Text>
			                </View>
	                    }
	                    {
		                    this.props.entity === 'like' &&
		                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
			                    <Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{this.props.anonymous == '0'?this.props.user_name:'Anônimo'}</Text>
			                    <Text style={{flexWrap: 'wrap', marginLeft: 4}}>{this.props.notification_text}</Text>
		                    </View>
	                    }

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
