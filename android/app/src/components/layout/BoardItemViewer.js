import React from 'react';
import {
	View,
	Text,
	TouchableOpacity
} from 'react-native';


export default class BoardItemViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<View>
				<TouchableOpacity onPress={() => console.warn('hue')}>
					<View>
						<Text> { this.props.title } </Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}


