import React from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	Text,
	FlatList,
	RefreshControl
} from 'react-native';

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import ReceivedRequest from "./ReceivedRequest";
import theme from "../../../../../components/General/Theme";
import moment from "moment";


export default class extends React.Component {
	constructor() {
		super();
		this.state = {
			requests: [],
			isRefreshing: false,
		}
	}

	componentDidMount(): void {
		heimdallr.getPhoneRequestsReceived().then(
			(resolve) => {
				this.setState({ requests: resolve });
			}
		)
	}

	onRefresh = () => {
		heimdallr.getPhoneRequestsReceived().then(
			(resolve) => {
				this.setState({ requests: null });
				this.setState({ requests: resolve, isRefreshing: false });
			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style = {{alignSelf:'flex-start'}}>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5,  paddingLeft: 12}}>
							<Image
								style={{width: 12, height: 12, marginTop:4}}
								source={require('../../../../../assets/images/arrow-left.png')}
							/>
							<Text style={{marginLeft: 5}}>
								voltar
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.body}>
					<FlatList
						data={this.state.requests}
						keyExtractor={item => item.requestId}
						ListHeaderComponent ={() =>
							<View>
								<Text style={styles.pageTitle}>Solicitações recebidas</Text>
							</View>
						}
							renderItem={ ({item}) =>
							<ReceivedRequest senderImage={item.sender_image} senderName={item.sender_name} requestId={item.request_id} allowed={item.allowed} reading_status={item.reading_status} senderId={item.sender_id} navigation={this.props.navigation}/>
						}
						refreshControl={
							<RefreshControl
								refreshing={this.state.isRefreshing}
								onRefresh={this.onRefresh.bind(this)}
								colors={[theme.primary, '#000000']}
							/>
						}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	body: {
		height: theme.height - 110,
		marginTop: 16
	},
	pageTitle: {
		fontWeight: 'bold',
		fontSize: 18,
		alignSelf: 'center'
	}
});
