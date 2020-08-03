import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	RefreshControl,
	ScrollView,
	StatusBar,
	BackHandler,
	Modal,
	Linking,
} from "react-native";

import ImNotTheOnlyChip from "./layout/ImNotTheOnlyChip";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import SevenBannerArmy from "./layout/SevenBannerArmy";
import LikeAPrayerductViewer from "./layout/LikeAPrayerductViewer";
import PartnerPlans from "./Inputs/PartnerPlans";
import {Button} from 'react-native-paper';
import axios from 'react-native-axios';
import moment from "moment";
import 'moment/locale/pt-br';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

let scrolling = false;
var verify = null;
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
			showPartnerPlans: false,
			currentPlan: false,
			pushParameter: 0
		}
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
			(resolve) => {
				if (resolve.docs.length > 0) {
					let mappedDocs =  resolve.docs.map((d) => d._data);
					mappedDocs = mappedDocs.filter((i) => i.stock > 0);
					this.setState({ products: mappedDocs, filteredProducts: mappedDocs, isRefreshing: false });
				}
			}
		)

	}

	componentDidMount(): void {
		BackHandler.addEventListener('hardwareBackPress', () => {
			StatusBar.setBackgroundColor('white');
			StatusBar.setBarStyle('dark-content');
		});

		heimdallr.getPartnersPlan(this.props.navigation.getParam('store'))
		.then((resolve) => {
			this.setState({ planId: Object.keys(resolve), partnersPlan: resolve })
	 	});

		this.verifyPlan().then((result) => {
			heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
				(resolve) => {
					if (resolve.docs.length > 0) {
						let mappedDocs =  resolve.docs.map((d) => d._data);
						mappedDocs = mappedDocs.filter((i) => i.stock > 0);
						this.setState({ products: mappedDocs, filteredProducts: mappedDocs });
					}
					result();
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

	verifyPlan = async () => {

		let today = await heimdallr.getServerTime();

		return new Promise((result) => {
			
			let userPlans = null;
			let store_code =this.props.navigation.getParam('store');

			if(heimdallr.userPlans != null && heimdallr.userPlans[store_code]){

				userPlans = heimdallr.userPlans[store_code];
				this.setState({currentPlan: userPlans[0]})

				if(today < userPlans[0].due_date){
					this.setState({
						validPlan: true,
						discount: userPlans[0].value,
						discountType: userPlans[0].type,
						plan: userPlans[0].name,
						dueDatePlan: moment(userPlans[0].due_date).format('DD/MM/YYYY'),
					});
				}
			}
			result();
		})

	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress');
	}



	chipPressed = (chip) => {
		heimdallr.sendEvent(`${this.props.navigation.getParam('store')}_category`)
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


	getTxtColor = (color) => {
		let c = color.substring(1);      // strip #
		let rgb = parseInt(c, 16);   // convert rrggbb to decimal
		let r = (rgb >> 16) & 0xff;  // extract red
		let g = (rgb >>  8) & 0xff;  // extract green
		let b = (rgb >>  0) & 0xff;  // extract blue
		let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709


		if (luma < 40) {
			return 'white'
		} else {
			return '#000000'
		}

	}

	hideModal = () => {
		this.setState({showPartnerPlans: false});
	}

	render() {
		return (
			<ScrollView style={styles.container} showsVerticalScrollIndicator = {false}>
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
						this.state.planId.length > 0 &&
						<View style={{ ...styles.partnerButton, backgroundColor: this.state.colors[0]}}>
							<TouchableOpacity style ={{ padding:10, width: theme.width * 0.9 }} onPress = {()=> this.setState({ showPartnerPlans : true})}>
								<View style={styles.partnerButtonView}>
									<Image
										style = {{ ...styles.partnerButtonIcon, tintColor: this.state.colors[0] === 'white' ? 'black' : 'white'}}
										source = {require('../../../../assets/images/star-solid.png')}
									/>
									<Text style={{ ...styles.buttonPartnerText, color:  this.state.colors[0] === 'white' ? 'black' : 'white'}}>TORNE-SE SÓCIO</Text>
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
					<View style = {{width:theme.width*0.49,marginBottom:theme.width*0.07}}>
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
				<Modal
					statusBarTranslucent={false}
					transparent={true}
					hardwareAccelerated={true}
					animationType='slide'
					visible={this.state.showPartnerPlans}
					onDismiss={() => this.setState({ showPartnerPlans: false})}
					onRequestClose={() => this.setState({ showPartnerPlans: false})}
					contentContainerStyle={{backgroundColor: 'white', width: theme.width + 10, height: theme.height, position: 'absolute'}}
				>
					<PartnerPlans colors={this.state.colors} planId={this.state.planId} partnersPlan={this.state.partnersPlan} logo={this.state.logo} 
								  hideModal={this.hideModal.bind(this)} store_code={this.props.navigation.getParam('store')} navigation={this.props.navigation}
								  currentPlan={this.state.currentPlan} pushParameter={this.state.pushParameter}/>
				</Modal>
				<FlashMessage ref={'buyMessage'} style={{ zIndex: 99 }} duration={2500}/>
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
