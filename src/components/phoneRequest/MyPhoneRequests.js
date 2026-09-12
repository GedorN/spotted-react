import React from 'react';
import {
	View,
	StyleSheet,
	Text, TouchableOpacity, Image, RefreshControl, FlatList
} from 'react-native';
import theme from "../../components/General/Theme";
import heimdallr from "../../components/Heimdallr/Heimdallr";
import MyRequest from "./MyRequest";
import {ProgressBar} from "react-native-paper";

export default class MyPhoneRequests extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			requests: [],
			isRefreshing: false,
			loaded: false,
		}
	}

	componentDidMount(): void {
		heimdallr.getPhoneRequestsSended().then(
			(resolve) => {
				this.setState({ requests: resolve, loaded: true });
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
				<ProgressBar size="large" visible={!this.state.loaded} indeterminate color={theme.primary}/>
				<View style = {{alignSelf:'flex-start'}}>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5,  paddingLeft: 12}}>
							<Image
								style={{width: 12, height: 12, marginTop:4}}
								source={require('../../../assets/images/arrow-left.png')}
							/>
							<Text style={{marginLeft: 5}}>
								voltar
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				{
					this.state.loaded &&
					<View style={styles.body}>
						<FlatList
							data={this.state.requests}
							keyExtractor={item => item.request_id}
							ListHeaderComponent ={() =>
								<View>
									<Text style={styles.pageTitle}>{ this.state.requests && this.state.requests.length > 0 ? "Solicitações realizadas" : "Você ainda não realizou nenhuma solicitação" }</Text>
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
				}
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
		padding: 4,
		fontWeight: 'bold',
		fontSize: 18,
		alignSelf: 'center',
		textAlign: 'center',
		lineHeight: 25,
		opacity: 0.4,
	
	}
})
