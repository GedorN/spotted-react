import React from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	PermissionsAndroid,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	Modal,
} from 'react-native';

import CameraRoll from '@react-native-community/cameraroll';
import heimdallr from '../../../../components/Heimdallr/Heimdallr';
import UserImgProfile from '../../../../components/General/UserImgProfile';
import UUIDGenerator from 'react-native-uuid-generator';
import ImageViewer from "react-native-image-zoom-viewer";
import MainScreen from "./MainScreen";
import Notification from "./Notification";
import moment from "moment";
import theme from "../../../../components/General/Theme";

const width = Dimensions.get('screen').width;

export default class NotificationScreen extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
            notifications:null,
            isRefreshing: false,
            endPulling: false,
            pulledNotifications: 10,
            pulling: false,
        }

    }

    componentDidMount = () => {
    	this.getData();
    }

    getData = (context) => {
    	if (context) {
    		context.setState({ numberBadge: null });
	    }
        heimdallr.badge = null;
	    this.setState({ pulling: true });
	    heimdallr.getUserNotifications( heimdallr.user_id, this.state.pulledNotifications).then(
		    (resolve) => {
		    	console.log('devolve dessa forma: ', resolve);
			    this.setState({notifications: resolve});
			    this.setState({ pulling: false });
		    }
	    );

	    heimdallr.resetNotifications(heimdallr.user_id);
    }

    onRefresh = () => {
		this.setState({ isRefreshing: true });
		let result = heimdallr.getUserNotifications(heimdallr.user_id,10);
		result.then( (resolve) => {
			this.setState({ notifications: resolve });
			this.setState({ isRefreshing: false });
		});
    }

    pullMoreNotifications = (distanceFromEnd) => {
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				this.setState({ pulling: true });
				let n = this.state.pulledNotifications;
				n = n + 5;
				let result = heimdallr.getUserNotifications(heimdallr.user_id,n);
				result.then((resolve) => {
					console.log('buscou: ', resolve);
					if (resolve.length === this.state.notifications.length) {
						this.setState({ endPulling: true });
					}
					this.setState( { notifications: resolve });
					this.setState({ pulledNotifications: n });
					this.setState({ pulling: false });
				})
			}
		}
	}

    renderFooter = () => {
	    if (this.state.notifications && this.state.notifications.length > 0 && !this.state.endPulling) {
			return (
				<View style={{marginBottom: 20}}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return <View></View>;
	}



    render() {
        return (
            <View stle={styles.container}>
                <FlatList
                    data = {this.state.notifications}
                    renderItem={ ({item}) =>
					<Notification
						image_uri = {item.user_image} notification_text = {item.content}
				   		user_name = {item.user_name} uid_notification = {item.uid_notification}
				   		eid = {item.eid} navigation={this.props.navigation} visualized = {item.visualized}
				   		anonymous = {item.anonymous?item.anonymous:'0'}/>
                        }
                        keyExtractor={item => item.nid}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
						onEndReachedThreshold={0.3}
						onEndReached={ ({ distanceFromEnd }) => {
							this.pullMoreNotifications(distanceFromEnd);
						}}
						ListFooterComponent={ this.renderFooter.bind(this)}
                />

            </View>
        )
    }

}


const styles = StyleSheet.create({
    post: {
        alignSelf: 'flex-start',
        padding: 2,
        marginLeft: 10,
        marginTop:5,
        borderRadius: 8,
        color: 'black',
        flexDirection: 'row',
        borderBottomWidth: 0.2,
        borderColor: 'rgba(59, 56, 50, 0.2)',
        paddingBottom: 15,
    },
	container: {
    	width: theme.width * 0.8,
		backgroundColor: 'red',
	}

})

