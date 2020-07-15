import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native';


export default class BoardItemViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => console.warn('hue')}>
					<View style={styles.item}>
						<Text style={styles.title}> { this.props.title } </Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		borderBottomWidth: 0.2,
	},
	item: {
		height: 65
	},
	title: {
		fontWeight: 'bold'
	}
});


