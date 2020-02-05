/**
 * GirlsJustWannaDatePicker
 * Date picker component
 *
 * @params
 * text: label text to field
 * onChange: function callback to date result
 * color: label color text
 * textDecorationLine: ['underline'] to have underline in field
 */


import React from 'react';
import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View
} from 'react-native';

import theme from "../../../../../components/General/Theme";
import DateTimePicker from "@react-native-community/datetimepicker";
var mounth= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class GirlsJustWannaDatePicker extends React.Component {
	constructor () {
		super();
		this.state = {
			showDatePicker: false,
			text: 'Date',
		}
	}

	componentDidMount(): void {
		if (!this.props.onChange) {
			console.log('GirlJustWannaDatePicker: onChange() method is necessary');
		}
		this.props.text ? this.setState({text: this.props.text}) : null;
	}

	showPicker = () => {
		this.setState({showDatePicker : true});
	}

	dateChange = (event, date) => {
		let dt = date.toString();
		let m = mounth.indexOf(dt.substring(4, 7)) + 1;
		let formatedDate = `${dt.substring(8, 10)}/${m < 10 ? '0' + m : m}/${dt.substring(11, 15)}`;
		this.setState({text: formatedDate});
		this.setState({showDatePicker: false});
		this.props.onChange(event, date);
	}

	render() {
		return (
			<View
				style={{
					borderBottomWidth: this.props.textDecorationLine === 'underline' ? 1 : 0,
					height: 40,
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<TouchableOpacity onPress={this.showPicker.bind(this)}>
					<Text
						style={{
							color: this.props.color ? this.props.color : 'gray',
							alignSelf: 'center',
							alignItems: 'center'
						}}
					>
						{this.state.text}
					</Text>
				</TouchableOpacity>
				{this.state.showDatePicker && <DateTimePicker value={new Date()}
				                                              mode={'date'}
				                                              is24Hour={true}
				                                              display="default"
				                                              onChange={this.dateChange.bind(this)}/>
				}
			</View>
		);
	}
}