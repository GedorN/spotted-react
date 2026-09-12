import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	StatusBar
} from 'react-native';

import theme from "../components/General/Theme";
import heimdallr from "../components/Heimdallr/Heimdallr";
import LikeARollingTicketViewer from "./layout/LikeARollingTicketViewer";
import SkeletonPlaceholder from "react-native-skeleton-placeholder/lib/SkeletonPlaceholder";

export default class Tickets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tickets: null,
			scrolling: false,
			isRefreshing: false,
			stores: []
		}
	}

	componentDidMount(): void {
		this.props.navigation.addListener('willFocus', () => {
			StatusBar.setBackgroundColor('white');
			StatusBar.setBarStyle('dark-content');
		});
		heimdallr.getUserTickets().then(
			(resolve) => {
				if (resolve.length <= 0) {
					heimdallr.getDrawer().then(
						(res) => {
							this.setState({ stores: res.items, isRefreshing: false, tickets: [] });
						}
					)
				} else {
					this.setState({ isRefreshing: false, tickets: resolve });
				}
			}
		)
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		heimdallr.getUserTickets().then(
			(resolve) => {
				if (resolve.length <= 0) {
					heimdallr.getDrawer().then(
						(res) => {
							this.setState({ stores: res.items, isRefreshing: false, tickets: [] });
						}
					)
				} else {
					this.setState({ isRefreshing: false, tickets: resolve });
				}

			}
		)
	}

	render() {
		return (
			<View style={styles.container}>
				{
					!this.state.tickets ?
						<SkeletonPlaceholder>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item marginTop={5} marginLeft={20} borderRadius={25} width={theme.width * 0.90} height={theme.height * 0.30}  />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item marginTop={5} marginLeft={20} borderRadius={25} width={theme.width * 0.90} height={theme.height * 0.30}  />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item marginTop={5} marginLeft={20} borderRadius={25} width={theme.width * 0.90} height={theme.height * 0.30}  />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item marginTop={5} marginLeft={20} borderRadius={25} width={theme.width * 0.90} height={theme.height * 0.30}  />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item marginTop={5} marginLeft={20} borderRadius={25} width={theme.width * 0.90} height={theme.height * 0.30}  />
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
						:
					this.state.tickets.length > 0 ?
						<FlatList
							style={{height: theme.height * 0.90}}
							ListHeaderComponent = {() =>
								<View>
									<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
										<View style={{flexDirection: 'row', marginTop: 7,  paddingLeft: theme.width * 0.05,width:theme.width * 0.2,height:theme.height * 0.04}}>
											<Image
												style={{ width: 30, height: 30, marginTop:4, opacity: 0.6 }}
												source={require('../../assets/images/chevron-circle-left-solid-white.png')}
											/>
										</View>
									</TouchableOpacity>
									<View style = {{ width:theme.width * 0.95,alignSelf:'center', paddingLeft:theme.width * 0.04, marginTop:theme.height * 0.01 }}>
										<Text style = {{fontWeight:'bold',color:'#8f8f8f'}}>Acompanhe seus pedidos</Text>
									</View>
								</View>}
								refreshControl={
									<RefreshControl
										refreshing={this.state.isRefreshing}
										onRefresh={this.onRefresh.bind(this)}
									/>
								}
								showsVerticalScrollIndicator={false}
								onScrollEndDrag={() => this.setState({ scrolling: false })}
								onScrollBeginDrag={() => this.setState({ scrolling: true })}
								keyExtractor={item => item._ref.id}
								data={this.state.tickets}
								renderItem={ ({ item }) =>
									<LikeARollingTicketViewer ticket={item.data()} scrolling={this.state.scrolling} navigation={this.props.navigation} />
								}
							/>
							:
							<FlatList
								ListHeaderComponent = {() =>
									<View>
										<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
											<View style={{flexDirection: 'row', marginTop: 7,  paddingLeft: theme.width * 0.05,width:theme.width * 0.2,height:theme.height * 0.04}}>
												<Image
													style={{ width: 30, height: 30, marginTop:4, opacity: 0.6 }}
													source={require('../../assets/images/chevron-circle-left-solid-white.png')}
												/>
											</View>
										</TouchableOpacity>
										<View style = {{ width:theme.width * 0.95,alignSelf:'center', paddingLeft:theme.width * 0.04, marginTop:theme.height * 0.01 }}>
											<Text style = {{fontWeight:'bold',color:'#8f8f8f'}}>Você ainda não possui pedidos. Que tal conhecer as lojas dos nossos parceiros?</Text>
										</View>
									</View>}
								refreshControl={
									<RefreshControl
										refreshing={this.state.isRefreshing}
										onRefresh={this.onRefresh.bind(this)}
									/>
								}
								showsVerticalScrollIndicator={false}
								onScrollEndDrag={() => this.setState({ scrolling: false })}
								onScrollBeginDrag={() => this.setState({ scrolling: true })}
								keyExtractor={item => item.key}
								data={this.state.stores}
								renderItem={ ({ item }) =>
									<View style={{ padding: 20 }}>
										<TouchableOpacity
											onPress={() => {this.props.navigation.push('Store', {store : item.key})}}
										>
											<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
												<View
													style={{
														width: 50,
														height: 50
													}}
												>
													<Image
														style={{
															flex: 1,
															width: null,
															height: null,
														}}
														resizeMode={'contain'}
														source={{uri: item.icon}}
													/>
												</View>
												<Text style={{marginLeft: 6}}>{ item.text }</Text>
											</View>
										</TouchableOpacity>
									</View>
								}
							/>

				}

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		paddingTop:theme.height * 0.03,
	}
})
