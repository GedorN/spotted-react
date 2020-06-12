import React from 'react';
import {
	TextInput,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class TextArea extends React.Component {
	constructor () {
		super ();
		this.state = {
            checked:'first',
            option : null,
		};
	}

	setOption = () => {
        this.props.customizationCallback(this.state.option);
    }
	

	render () {
		return (
				<TextInput
					style = {{
					borderColor: this.props.borderColor? this.props.borderColor :'#8f8f8f',
					borderWidth:this.props.borderWidth? this.props.borderWidth : 0,
					borderBottomWidth: this.props.borderBottomWidth? this.props.borderBottomWidth : 1,
					width: this.props.width? this.props.width : theme.width*0.9,
					opacity: this.props.opacity? this.props.opacity : 0.7,
					borderRadius: this.props.borderRadius? this.props.borderRadius : 10,
					fontSize: this.props.fontSize? this.props.fontSize : 14,
					fontWeight:this.props.fontWeight? this.props.fontWeight : '500',
					paddingLeft: this.props.paddingLeft ?  this.props.paddingLeft : 10
				}}
	                placeholder = {this.state.option === null ? this.props.placeholderText : this.state.option}
	                onChangeText = {text => this.setState({option :text})}
	                value = {this.state.option}
					onEndEditing = {this.setOption.bind(this)}
	            />
		);
	}
}