import React from 'react';
import {
	View,
	StyleSheet,
	Text, TouchableOpacity, Image, RefreshControl, FlatList
} from 'react-native';
import theme from "../../../../../components/General/Theme";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import MyRequest from "./MyRequest";

export default class MyPhoneRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			requests: [],
			isRefreshing: false,
		}
	}

	componentDidMount(): void {
		heimdallr.getPhoneRequestsSended().then(
			(resolve) => {
				this.setState({ requests: resolve });
			}
		)
	}

	onRefresh = () => {
		heimdallr.getPhoneRequestsSended().then(
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
						<View style={{flexDirection: 'row', marginTop: 2,  paddingLeft: 15, width:theme.width * 0.2,height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, marginTop:4, opacity: 0.6}}
								source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.body}>
					<FlatList
						data={this.state.requests}
						keyExtractor={item => item.request_id}
						ListHeaderComponent ={() =>
							<View>
								<Text style={styles.pageTitle}>Solicitações realizadas</Text>
							</View>
						}
						renderItem={ ({item}) =>
							<MyRequest receiverPhone={item.receiver_phone ? item.receiver_phone : null} receiverImage={item.receiver_image} receiverName={item.receiver_name} requestId={item.request_id} allowed={item.allowed} reading_status={item.reading_status} receiverId={item.receiver_id} navigation={this.props.navigation}/>
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
		flex: 1
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
})
