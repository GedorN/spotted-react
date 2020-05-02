import React from 'react';

import {
	View,
	StyleSheet,
	Text
} from 'react-native'

import theme from "../../../../../components/General/Theme";
import LikeAPrayerductViewer from "./LikeAPrayerductViewer";

export default class LikeARollingTicketViewer extends React.Component {
	constructor(props) {
		super (props);
		this.state = {
			product: null,
		}
	}
	componentDidMount(): void {
		console.log('ticket recebido: ', this.props.ticket);
		const obj = {};
		obj.images = this.props.ticket ? [this.props.ticket.image] : null;
		obj.name = this.props.ticket ? this.props.ticket.product_name : null;
		this.setState({ product: obj });
		console.log('p: ', this.state.product);
	}


	render() {
		return (
			<View style={styles.container}>
				<LikeAPrayerductViewer  product={this.state.product}/>
				<Text>Pedidod loco</Text>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: theme.width,
		flexDirection: 'row',
		backgroundColor: 'yellow'
	}
});
