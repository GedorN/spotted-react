import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native';

export default class ImNotTheOnlyChip extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pressed: false,
		}
	}

	componentDidMount(): void {
		console.log('pqp', this.props.selected, this.props.text);
		if (this.props.selected.length > 0 && this.props.selected.find((i) => i === this.props.id)){
			console.log('alterando');
			this.setState({ pressed: true });
			// this.state.pressed = true;
		}
	}

	pressed  = () => {
		this.setState({ pressed: !this.state.pressed });
		this.props.cbFunction(this.props.id);
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

	render() {
		return (
			<TouchableOpacity onPress={this.pressed.bind(this)}>
				<View style={{
					borderWidth: 1,
					borderRadius: 20,
					padding: 7,
					paddingLeft:11,
					paddingRight:11,
					backgroundColor: this.props.colors && this.state.pressed ?  this.props.colors[0] : 'rgba(166, 166, 162, 0.5)',
					borderColor: this.props.colors && this.state.pressed ?  this.props.colors[0] : 'rgba(166, 166, 162, 0.5)',

					elevation: 1,
				}}>
					<Text
						style={{
							color: this.props.colors && this.state.pressed ? this.getTxtColor(this.props.colors[0]) : 'black'
						}}
					> {this.props.text} </Text>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
});
