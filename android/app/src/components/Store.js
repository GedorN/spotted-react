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
			colors: [],
			products: [],
			scrolling: false,
			logo: null,
		}
	}

	componentDidMount(): void {
		console.warn('loja escolhida: ', this.props.navigation.getParam('store'));
		heimdallr.getStoreInfo(this.props.navigation.getParam('store')).then(
			(resolve) => {
				console.log('antes', resolve.categories)
				this.setState({ categories: resolve.categories });
				console.log('depois', this.state.categories);
				this.setState({ colors: resolve.colors });
				this.setState({logo : resolve.logo});
				console.warn("LOGO",this.state.logo);
			}
		);

		heimdallr.getStoreProducts(this.props.navigation.getParam('store')).then(
			(resolve) => {
				if (resolve.docs.length > 0) {
					this.setState({ products: resolve.docs })
					console.log('produtos: ', this.state.products);
				}
			}
		)

	}


	chipPressed = (chip) => {
		console.warn(chip);
	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					numColumns={2}
					showsVerticalScrollIndicator={false}
					onScrollEndDrag={() => this.setState({ scrolling: false })}
					onScrollBeginDrag={() => this.setState({ scrolling: true })}
					keyExtractor={item => item.data().name}
					data={this.state.products}
					renderItem={({item}) =>
					<View style = {{width:theme.width*0.49,marginBottom:theme.width*0.07}}>
						<LikeAPrayerductViewer
							scrolling={this.state.scrolling}
							product={item.data()}
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
												text={i.name}
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