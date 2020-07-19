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
		console.warn('doc name',this.props.docName);
		this.props.navigation.push('BoardItemDetails', {
			title: this.props.title,
			id: this.props.id, 
			text: this.props.text,
			images: this.props.images, 
			date: this.props.date, 
			comments: this.props.comments,
			uid: this.props.uid,
			pid: this.props.pid,
			userImage: this.props.userImage,
			userName: this.props.userName,
			video: this.props.video,
			docName: this.props.docName,
			date: moment(this.props.date).locale('pt-br').format('LLLL'),
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


