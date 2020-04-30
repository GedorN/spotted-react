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
		}
	}

	componentDidMount(): void {
		console.log('loja escolhida: ', this.props.store);
		heimdallr.getStoreInfo(this.props.store).then(
			(resolve) => {
				console.log('antes', resolve.categories)
				this.setState({ categories: resolve.categories });
				console.log('depois', this.state.categories);
			}
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<SevenBannerArmy />
				<View style={{flexDirection: 'row', width: theme.width * 0.95, flexWrap: 'wrap',}}>
					{
						this.state.categories.map(i =>
							<View style={{margin: 5}}>
								<ImNotTheOnlyChip
									text={i.name}
								/>
							</View>
						)
					}
				</View>
				<LikeAPrayerductViewer />
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		padding: 20,
		height: theme.height,
		backgroundColor: 'white'
	}
});