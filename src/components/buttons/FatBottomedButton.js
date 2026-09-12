/**
 * FatBottomedButton:
 * Button component to our default
 *
 * @params
 * borderColor: button border color
 * borderWidth: button border width
 * height: button height
 * borderRadius: button border radius
 * fontSize: font size of button text
 * color: color of button text
 * onTap: method called when button is tapped
 *
 * */

import React from 'react';
import {
	StyleSheet,
	Button,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

import theme from     "../../components/General/Theme";
export default class FatBottomedButton extends React.Component {
	constructor () {
		super ();
		this.state = {
		};
	}

	componentDidMount(): void {
		if (!this.props.onTap) {
			console.warn('FatBottomedButton: onTap() method is necessary');
		}
	}

	getBorderColor() {
		if (this.props.disabled) {
			return '#8f8f8f';
		}

		return this.props.borderColor;
	}

	getBackgroundColor() {
		if (this.props.disabled) {
			return '#8f8f8f';
		}
		return this.props.backgroundColor;
	}

	render () {
		return (
			<TouchableOpacity disabled={this.props.disabled ? this.props.disabled : false} onPress={ this.props.onTap }>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: this.props.backgroundColor ? this.getBackgroundColor() : 'white',
						borderColor: this.props.borderColor ? this.getBorderColor() : theme.primary,
						borderWidth: this.props.borderWidth ? this.props.borderWidth : 1.2,
						height: this.props.height ? this.props.height : 42,
						borderRadius: this.props.borderRadius ? this.props.borderRadius : 13,
						shadowColor: theme.primary,
						shadowOffset: {
							width: 0,
							height: 1,
						},
						shadowOpacity: 0.28,
						shadowRadius: 3.00,

						elevation: 2,
					}}
				>
					<Text
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
							fontWeight: 'bold',
							fontSize: this.props.fontSize ? this.props.fontSize : 16,
							color: this.props.color ? this.props.color : theme.primary,
						}}
					>
						{ this.props.text ? this.props.text : '' }
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}



const styles = StyleSheet.create({
});
