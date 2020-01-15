import React from 'react';
import {
	TextInput,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class RUMineTextInput extends React.Component {
	constructor () {
		super ();
		this.state = {
		};
	}

	componentDidMount(): void {
		if (!this.props.onChangeText) {
			console.warn('RUMineTextInput: onChangeText() method is necessary');
		}
	}

	render () {
		return (
			<TextInput
				onChangeText={this.props.onChangeText}
				autoCapitalize={ this.props.autoCapitalize ? this.props.autoCapitalize : 'none' }
				placeholder={ this.props.placeholder ? this.props.placeholder : '' }
				autoCompleteType = { this.props.autoCompleteType ? this.props.autoCompleteType : 'off' }
				keyboardType= { this.props.keyboardType ? this.props.keyboardType : 'default' }
				textContentType = { this.props.textContentType ? this.props.textContentType : 'none'}
				secureTextEntry={ this.props.secureTextEntry ? this.props.secureTextEntry : false }
				style={{
					height: this.props.height ? this.props.height : 40,
					borderBottomWidth: this.props.borderBottomWidth ? this.props.borderBottomWidth : 1,
					borderBottomColor: this.props.borderBottomColor ? this.props.borderBottomColor : theme.primary,
					marginBottom: this.props.marginBottom ? this.props.marginBottom : 10
				}}
			/>
		);
	}
}