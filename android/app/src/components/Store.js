import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList
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
						<LikeAPrayerductViewer
							scrolling={this.state.scrolling}
							product={item.data()}
							colors={this.state.colors ? this.state.colors : null}
							navigation={this.props.navigation}
						/>
					}
					ListHeaderComponent={({item}) =>
						<View>
							<SevenBannerArmy />
							<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',}}>
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
		padding: 20,
		height: theme.height,
		backgroundColor: 'white',
	}
});