import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class LikeAPrayer extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			opacityValue: 0.7,
			opacityValueScrolling: 1,
		}
	}

	getTxtColor = (color) => {
		if (!color) {
			return 'black';
		}
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

	getFontSize = (txt) => {
		if (!txt) {
			return ;
		}
		if (txt.length > 25) {
			return 11
		} else {
			return 16
		}
	}


	render() {
		return (
			<TouchableOpacity activeOpacity={this.props.scrolling ? this.state.opacityValueScrolling :  this.state.opacityValue}>
				<View style={styles.container}>
					<View style={{
						borderWidth: 1,
						height: theme.height * 0.08,
						width: theme.width * 0.4,
						borderTopLeftRadius: 30,
						borderTopRightRadius: 30,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: this.props.colors ? this.props.colors[0] : null,
					}}>
						<Text style={{
							textAlign: 'center',
							fontSize: this.props.product && this.props.product.name ? this.getFontSize(this.props.product.name) : null,
							color: this.props.colors ? this.getTxtColor(this.props.colors[0]) : 'black'
						}}>
							{ this.props.product ? this.props.product.name : '' }
						</Text>
					</View>
					<View style={{
						borderWidth: 1,
						borderTopWidth: 0,
						height: theme.height * 0.27,
						width: theme.width * 0.4,
						borderBottomRightRadius: 30,
						borderBottomLeftRadius: 30
					}}>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 15,
		marginRight: 25,
		width: theme.width * 0.35,
		height: theme.height * 0.4,
	},
})