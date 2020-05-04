import React from 'react';

import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
} from 'react-native'

import theme from "../../../../../components/General/Theme";
import LikeAPrayerductViewer from "./LikeAPrayerductViewer";

export default class LikeARollingTicketViewer extends React.Component {
	constructor(props) {
		super (props);
		this.state = {
			product: null,
			opacityValue: 0.7,
			opacityValueScrolling: 1,
		}
	}
	componentDidMount(): void {
		console.log('ticket recebido: ', this.props.ticket);
		const obj = {};
		obj.images = this.props.ticket ? [this.props.ticket.image] : null;
		obj.name = this.props.ticket ? this.props.ticket.product_name : null;
		// this.setState({ product: obj });
		this.state.product = obj;
		this.setState({ product: obj });
		console.log('p: ', this.state.product);
		console.log('obj: ', obj);
	}


	render() {
		return (
			<TouchableOpacity onPress={this.props.pressed()}
			                  activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue}
			>
				<View style={styles.container}>
					<LikeAPrayerductViewer  product={this.state.product} colors={this.props.ticket ? this.props.ticket.colors : null}/>
					<View style={styles.product_info}>
						<Text>{ this.state.product? this.state.product.name : null }</Text>
						<Text style={{marginLeft: 5}}>{ this.props.ticket ? this.props.ticket.store_name : null } </Text>
						<Text> {this.props.ticket ? this.props.ticket.status : null}  </Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: theme.width,
		flexDirection: 'row',
	},
	product_info: {
		marginTop: 20,
		flexDirection:'row',
		flexWrap: 'wrap',
		width: theme.width * 0.35
	}
});
