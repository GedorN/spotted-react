import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Image, TouchableOpacity,
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
		}
	}

	componentDidMount(): void {
		heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
			(resolve) => {
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

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					numColumns={2}
					showsVerticalScrollIndicator={false}
					onScrollEndDrag={() => {scrolling = false}}
					onScrollBeginDrag={() => {scrolling = false}}
					keyExtractor={item => item.name}
					data={this.state.filteredProducts}
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
					ListHeaderComponent={({item}) =>
						<View style = {{width:theme.width*0.98,alignSelf:'center'}}>
							<TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
								<View style={{flexDirection: 'row', marginTop: 7, marginBottom: 5,  paddingLeft: 10}}>
									<Image
										style={{width: 12, height: 12, marginTop:4}}
										source={require('../../../../assets/images/arrow-left.png')}
									/>
									<Text style={{marginLeft: 5}}>
										voltar
									</Text>
								</View>
							</TouchableOpacity>
							<SevenBannerArmy url={this.state.banner}/>
							<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',marginTop:10,paddingLeft:theme.width*0.04}}>
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
								<Text style = {{fontSize:23,fontWeight:'bold',paddingTop:theme.width*0.015}}>{'Produtos '}</Text>
								<View style = {{width:theme.width * 0.4,height : theme.height * 0.08,marginBottom:theme.height * 0.02}}>
									<Image
										source = {{ uri: this.state.logo}}
										style = {{resizeMode: 'contain',flex:1,width:null,height:null}}>
									</Image>
								</View>
							</View>
						</View>
					}
				/>
					{/*<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',}}>*/}
					{/*	{*/}
					{/*		this.state.products.map(p =>*/}
					{/*			<LikeAPrayerductViewer*/}
					{/*				product={p.data()}*/}
					{/*				colors={this.state.colors ? this.state.colors : null}*/}
					{/*			/>*/}
					{/*		)*/}
					{/*	}*/}
					{/*</View>*/}
			</View>
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
