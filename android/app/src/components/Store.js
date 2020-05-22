import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Image,
} from "react-native";

import ImNotTheOnlyChip from "./layout/ImNotTheOnlyChip";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import SevenBannerArmy from "./layout/SevenBannerArmy";
import LikeAPrayerductViewer from "./layout/LikeAPrayerductViewer";
export default class Store extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			categories: [],
			filteredCategories: [],
			colors: [],
			products: [],
			filteredProducts: [],
			scrolling: false,
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
					const mappedDocs =  resolve.docs.map((d) => d._data);
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
					onScrollEndDrag={() => this.setState({ scrolling: false })}
					onScrollBeginDrag={() => this.setState({ scrolling: true })}
					keyExtractor={item => item.name}
					data={this.state.filteredProducts}
					renderItem={({item}) =>
					<View style = {{width:theme.width*0.49,marginBottom:theme.width*0.07}}>
						<LikeAPrayerductViewer
							scrolling={this.state.scrolling}
							product={item}
							colors={this.state.colors ? this.state.colors : null}
							navigation={this.props.navigation}
						/>
					</View>
					}
					ListHeaderComponent={({item}) =>
						<View style = {{width:theme.width*0.98,alignSelf:'center'}}>
							<SevenBannerArmy />
							<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',marginTop:10}}>
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
								<View style = {{alignItems:'flex-start'}}>
									<Image
										source = {{ uri:this.state.logo}}
										style = {{resizeMode: 'contain', width:theme.width*0.18,height:theme.height*0.07,marginBottom:10}}>
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
