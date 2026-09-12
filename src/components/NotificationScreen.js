import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';

import heimdallr from '../components/Heimdallr/Heimdallr';
import Notification from "./Notification";
import ReceivedRequest from "./phoneRequest/ReceivedRequest";
import MyRequest from "./phoneRequest/MyRequest";
import theme from "../components/General/Theme";


export default class NotificationScreen extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
            notifications:[],
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
				this.setState({notifications: resolve, pulling: false});
		    }
	    );

	    heimdallr.resetNotifications(heimdallr.user_id);
    }

    onRefresh = () => {
		this.setState({ isRefreshing: true });
		let result = heimdallr.getUserNotifications(heimdallr.user_id,10);
		result.then( (resolve) => {
			this.setState({ notifications: resolve, isRefreshing: false  });
		});
    }

    pullMoreNotifications = () => {
		if (!this.state.endPulling) {
			if (!this.state.pulling) {
				this.setState({ pulling: true });
				let n = this.state.pulledNotifications;
				n = n + 5;
				let result = heimdallr.getUserNotifications(heimdallr.user_id,n);
				result.then((resolve) => {
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
					<ActivityIndicator size="large" color={theme.primary} />
				</View>
			);
		}
		return <View></View>;
	}



    render() {
        return (
            <View stle={styles.container}>
				{
					 this.state.notifications != null && this.state.notifications.length > 0 &&
					<FlatList
            data = {this.state.notifications}
            renderItem={ ({item}) =>
            <View style={item.visualized > 0 ? {} : {backgroundColor: '#e0e0eb'}}>
              {
                (item.entity !== 'phoneRequest' && item.entity !== 'sendedPhoneRequest') &&
								<Notification
									image_uri = {item.user_image}
									notification_text = {item.content}
                  user_name = {item.user_name}
									uid_notification = {item.uid_notification}
                  eid = {item.eid}
									navigation={this.props.navigation} visualized = {item.visualized}
                  anonymous = {item.anonymous?item.anonymous:'0'}
									origin={item.origin? item.origin : null}
									docName={item.board? item.board : null}
                  taggedUsers={ item.taggedUsers }
									entity={item.entity} />

              }
              {
								item.entity === 'phoneRequest' &&
								<ReceivedRequest senderImage={item.sender_image} senderName={item.sender_name} requestId={item.request_id} allowed={item.allowed} reading_status={item.reading_status} senderId={item.sender_id} navigation={this.props.navigation}/>

              }
              {
                item.entity === 'sendedPhoneRequest' &&
                <MyRequest receiverPhone={item.receiver_phone ? item.receiver_phone : null} receiverImage={item.receiver_image} receiverName={item.receiver_name} requestId={item.request_id} allowed={item.allowed} reading_status={item.reading_status} receiverId={item.receiver_id} navigation={this.props.navigation}/>
              }
              </View>
              }
                keyExtractor={item => item.nid ? item.nid : item.request_id}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    colors={[theme.primary, '#000000']}
                  />
                }
						onEndReachedThreshold={0.3}
						onEndReached={ ({ distanceFromEnd }) => {
							this.pullMoreNotifications(distanceFromEnd);
						}}
						ListFooterComponent={ this.renderFooter.bind(this)}
                	/>
				}
				{
					this.state.notifications === null &&
					<View style = {{width: theme.width * 0.9, alignSelf: 'center', marginTop: theme.height * 0.025}}>
						<Text style = {{ fontWeight: 'bold', color: '#8f8f8f', lineHeight: 25}}>Não há notificações no momento, mas  em breve poderá ter... ou poderá não ter. </Text>
					</View>
				}
            </View>
        )
    }

}


const styles = StyleSheet.create({
	container: {
    	width: theme.width * 0.8,
		backgroundColor: 'red',
	}

})

