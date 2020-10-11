import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	RefreshControl,
	ScrollView,
	StatusBar,
	BackHandler,
} from "react-native";

import ImNotTheOnlyChip from "./layout/ImNotTheOnlyChip";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import SevenBannerArmy from "./layout/SevenBannerArmy";
import LikeAPrayerductViewer from "./layout/LikeAPrayerductViewer";
import moment from "moment";
import 'moment/locale/pt-br';
import SkeletonPlaceholder from "react-native-skeleton-placeholder/lib/SkeletonPlaceholder";


let scrolling = false;
export default class Store extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			categories: [],
			filteredCategories: [],
			colors: [],
			products: [],
			filteredProducts: [],
			logo: null,
			banner: null,
			isRefreshing: false,
			partnersPlan: null,
			planId: [],
			validPlan: false,
			discount: null,
			discountType: null,
			dueDatePlan: null,
			plan: null,
			currentPlan: false,
			loaded: false,
		}
	}


	componentDidMount() {
		this.createListener();

		this.verifyPlan().then(() => {
			heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
				(resolve) => {
					if (resolve.docs.length > 0) {
						let mappedDocs =  resolve.docs.map((d) => d._data);
						this.setState({ products: mappedDocs, filteredProducts: mappedDocs, loaded: true });
					}
				}
			)
		});


		heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
			(resolve) => {
				StatusBar.setBackgroundColor(resolve.colors[0]);
				StatusBar.setBarStyle('light-content');
				this.setState({
					categories: resolve.categories,
					colors: resolve.colors,
					logo : resolve.logo,
					banner: resolve.banner,
				});
			}

		);

	}

	createListener = () => {
		this.props.navigation.addListener('willFocus', () => {
			if (heimdallr.newPlanAdded) {
				this.verifyPlan().then(
					() => {
						this.setState({products: [], filteredProducts: []});
						heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
							(resolve) => {
								if (resolve.docs.length > 0) {
									let mappedDocs =  resolve.docs.map((d) => d._data);
									mappedDocs = mappedDocs.filter((i) => i.stock > 0);
									this.setState({ products: mappedDocs, filteredProducts: mappedDocs });
								}
							}
						)
					});


				heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
					(resolve) => {
						StatusBar.setBackgroundColor(resolve.colors[0]);
						StatusBar.setBarStyle('light-content');
						this.setState({
							categories: resolve.categories,
							colors: resolve.colors,
							logo : resolve.logo,
							banner: resolve.banner,
						});
					}

				);

			}
		});
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true, products: [], filteredProducts: [] });
		heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
			(resolve) => {
				if (resolve.docs.length > 0) {
					let mappedDocs =  resolve.docs.map((d) => d._data);
					this.setState({ products: mappedDocs, filteredProducts: mappedDocs, isRefreshing: false });
				}
			}
		)

	}

	verifyPlan = async () => {
		let today = await heimdallr.getServerTime();
		return new Promise((result) => {
			let userPlans = null;
			let store_code = this.props.navigation.getParam('store');

			if(heimdallr.userPlans != null && heimdallr.userPlans[store_code]){
				userPlans = heimdallr.userPlans[store_code];
				if (today < userPlans[0].due_date && userPlans[0].active === 1 ) {
					this.setState({
						validPlan: true,
						discount: userPlans[0].value,
						discountType: userPlans[0].type,
						plan: userPlans[0].name,
						currentPlan: userPlans[0],
						dueDatePlan: moment(userPlans[0].due_date).format('DD/MM/YYYY'),
					});
				} else {
					this.setState({currentPlan: userPlans[0]});
					if (today > userPlans[0].due_date && userPlans[0].active === 1) {
						const store_code = this.props.navigation.getParam('store');
						heimdallr.sendEvent(`${store_code}_plan_expired`);
					}
				}
			}
			result();
		})

	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress');
	}



	chipPressed = (chip) => {
		let filteredCategories = this.state.filteredCategories;
		let filteredProducts = [];
		if (filteredCategories.find((fc) => fc === chip)) {
			filteredCategories.splice(filteredCategories.indexOf(chip), 1);
		} else {
			filteredCategories.push(chip);
		}

		if (filteredCategories.length > 0) {
			for(let i = 0; i < filteredCategories.length; i++) {
				let prod = this.state.products.filter((p) => p.category === filteredCategories[i]);
				filteredProducts = filteredProducts.concat(prod);
			}
		} else {
			filteredProducts = this.state.products;
		}
		this.setState({ filteredProducts: filteredProducts, filteredCategories: filteredCategories });

	}

	clearStatusBar = () => {
		StatusBar.setBackgroundColor('white');
		StatusBar.setBarStyle('dark-content');
	}

	goToPlans = () => {
		const store = this.props.navigation.getParam('store');
		this.props.navigation.push('Plans', {store: store, current_plan: this.state.currentPlan});
	}


	render() {
		return (
			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator = {false}
				refreshControl={
				<RefreshControl
					refreshing={this.state.isRefreshing}
					onRefresh={this.onRefresh.bind(this)}
				/>
			}>
				{
					this.state.loaded ?
						<View>
							<View style = {{width:theme.width*0.98,alignSelf:'center'}}>
								<View style={{flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10, position: 'absolute', zIndex: 999}}>
									<TouchableOpacity onPress={() => {this.clearStatusBar(); this.props.navigation.goBack()}}>
										<Image
											style={{width: 30, height: 30, marginTop:4, opacity: 0.6}}
											source={require('../../../../assets/images/chevron-circle-left-solid-white.png')}
										/>
									</TouchableOpacity>
								</View>
								<SevenBannerArmy url={this.state.banner}/>
								{
									this.state.validPlan &&
									<View style={styles.messageView}>
										<Text style={{fontSize:12, color:'#8f8f8f', alignSelf:'center'}}>{'Seu plano ' + this.state.plan + ' é válido até ' + this.state.dueDatePlan}</Text>
									</View>
								}
								{
									<View style={{ ...styles.partnerButton, backgroundColor: this.state.colors[0]}}>
										<TouchableOpacity
											style ={{ padding: 10, width: theme.width * 0.9 }}
											onPress = {this.goToPlans.bind(this)}
											onPressIn={() => heimdallr.sendEvent('partners_list_click')}
										>
											<View style={styles.partnerButtonView}>
												<Image
													style = {{ ...styles.partnerButtonIcon, tintColor: this.state.colors[0] ? heimdallr.getTxtColor(this.state.colors[0]) : 'white'}}
													source = {require('../../../../assets/images/star-solid.png')}
												/>
												<Text style={{ ...styles.buttonPartnerText, color:  this.state.colors[0] ? heimdallr.getTxtColor(this.state.colors[0]) : 'white'}}>TORNE-SE SÓCIO</Text>
											</View>
										</TouchableOpacity>
									</View>
								}
								<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',marginTop:10, paddingLeft:theme.width*0.04}}>
									{
										this.state.categories.map(i =>
											<View style={{margin: 5}} key={i.name}>
												<ImNotTheOnlyChip
													selected={this.state.filteredCategories}
													text={i.name}
													id={i.key}
													colors={this.state.colors ? this.state.colors : null}
													cbFunction={this.chipPressed.bind(this)}
												/>
											</View>
										)
									}
								</View>
								<View style = {{paddingLeft:theme.width*0.06,marginTop:30,flexDirection:'row'}}>
									<Text style = {{fontSize:23,fontWeight:'bold',paddingTop:theme.width*0.05}}>{'Produtos '}</Text>
									<View style = {{width:theme.width * 0.4, height : theme.height * 0.1, marginBottom:theme.height * 0.03, marginLeft: 5}}>
										<View style = {{width:theme.width * 0.35, height : theme.height * 0.1, marginBottom:theme.height * 0.03, marginLeft: -20}}>
											<Image
												source = {{ uri: this.state.logo }}
												style = {{resizeMode: 'contain', flex:1, width:null, height:null}}>
											</Image>
										</View>
									</View>
								</View>
							</View>
							<FlatList
								numColumns={2}
								showsVerticalScrollIndicator={false}
								onScrollEndDrag={() => {scrolling = false}}
								onScrollBeginDrag={() => {scrolling = false}}
								keyExtractor={item => item.name}
								data={this.state.filteredProducts}
								refreshControl={
									<RefreshControl
										refreshing={this.state.isRefreshing}
										onRefresh={this.onRefresh.bind(this)}
									/>
								}
								renderItem={({item}) =>
									<View style = {{width: theme.width * 0.49, marginBottom: theme.width * 0.07}}>
										<LikeAPrayerductViewer
											scrolling={scrolling}
											product={item}
											validPlan={this.state.validPlan}
											discountType={this.state.discountType}
											discount={this.state.discount}
											colors={this.state.colors ? this.state.colors : null}
											navigation={this.props.navigation}
										/>
									</View>
								}
							/>
						</View>
						:
						<SkeletonPlaceholder>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item width={theme.width * 0.98} height={theme.height * 0.23}  />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" alignSelf="center">
								<SkeletonPlaceholder.Item width={theme.width * 0.9} height={theme.height * 0.08} padding={10} borderRadius={15} marginTop={10}/>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={6} marginLeft={22}>
								<SkeletonPlaceholder.Item width={theme.width * 0.27} height={35} borderRadius={20} />
								<SkeletonPlaceholder.Item width={theme.width * 0.27} height={35} marginLeft={7} borderRadius={20} />
								<SkeletonPlaceholder.Item width={theme.width * 0.27} height={35} marginLeft={7} borderRadius={20} />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={130} marginLeft={22}>
								<SkeletonPlaceholder.Item width={theme.width * 0.43} height={theme.height * 0.4} borderRadius={30} />
								<SkeletonPlaceholder.Item width={theme.width * 0.43} height={theme.height * 0.4} marginLeft={7} borderRadius={30} />
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={22} marginLeft={22}>
								<SkeletonPlaceholder.Item width={theme.width * 0.43} height={theme.height * 0.4} borderRadius={30} />
								<SkeletonPlaceholder.Item width={theme.width * 0.43} height={theme.height * 0.4} marginLeft={7} borderRadius={30} />
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
				}
			</ScrollView>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		alignSelf:'center',
		backgroundColor: 'white',
		width:theme.width * 0.98
	},
	partnerButton: {
		elevation: 2,
		width: theme.width * 0.9,
		alignSelf: 'center',
		borderRadius: 15,
		flexDirection:'row',
		justifyContent: 'center',
		alignContent :'center',
		alignItems:'center',
	},
	partnerButtonIcon: {
		width: 22,
		height: 20,
		alignSelf: 'center',
	},
	partnerButtonView: {
		flexDirection : 'row',
		alignSelf: 'center',
		width: theme.width * 0.47,
		height: theme.height * 0.03,
		alignContent: 'center',
		justifyContent:'flex-start'
	},
	messageView: {
		width:theme.width * 0.8,
		alignSelf: 'center',
		marginBottom: 10
	},
	buttonPartnerText: {
		fontWeight: 'bold',
		fontSize: 15,
		letterSpacing: 1,
		alignSelf: 'center',
		marginLeft: 10,
	},
});
