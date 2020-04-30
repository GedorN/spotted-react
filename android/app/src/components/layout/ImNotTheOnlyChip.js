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

		}
	}

	render() {
		return (
			<TouchableOpacity onPress={() => {console.warn('uepa')}}>
				<View style={{
					borderWidth: 1,
					borderRadius: 20,
					padding: 5
				}}>
					<Text> {this.props.text} </Text>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
});