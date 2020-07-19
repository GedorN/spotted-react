import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet
} from 'react-native';

import BoardItemDetails from "../BoardItemDetails";
import moment from "moment";
import 'moment/locale/pt-br';

export default class BoardItemViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	goToBoardItemDetails = () => {
		this.props.navigation.push('BoardItemDetails', {
			item: this.props.item,
			docName: this.props.docName,
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.goToBoardItemDetails.bind(this)}>
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


