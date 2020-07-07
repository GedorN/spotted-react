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
			console.warn('hue');
		});


		heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
			(resolve) => {
				StatusBar.setBackgroundColor(resolve.colors[0]);
				StatusBar.setBarStyle('light-content');
				this.setState({
					categories: resolve.categories,
					colors: resolve.colors,
					logo : resolve.logo,
					banner: resolve.banner
				});
				console.warn('RESOLVE',resolve.colors);
				console.warn('this.state.logo',this.state.logo);
			}

		);

		heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
			(resolve) => {
				if (resolve.docs.length > 0) {
					console.log('que porra: ', resolve.docs.map((d) => d._data));
					let mappedDocs =  resolve.docs.map((d) => d._data);
					mappedDocs = mappedDocs.filter((i) => i.stock > 0);
					this.setState({ products: mappedDocs, filteredProducts: mappedDocs });
				}
			}
		)

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
							colors={this.state.colors ? this.state.colors : null}
							navigation={this.props.navigation}
						/>
					</View>
					}
				/>
			</ScrollView>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		alignSelf:'center',
		backgroundColor: 'white',
		width:theme.width * 0.98
	}
});
