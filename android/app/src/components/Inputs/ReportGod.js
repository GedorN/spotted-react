import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	RefreshControl,
} from 'react-native';

import {
	List
} from 'react-native-paper';

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../../components/General/Theme";


export default class ReportGod extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAlert: false,
		};
	}

	makeReport = async (idReport) => {
		this.props.close(false);
		if(this.props.typeEntity === 'comentario'){
			let params = {};
			params.pid = this.props.pid;
			params.author = heimdallr.user_id;
			params.category = idReport;
			params.uid = this.props.idEntity;
			params.date = await heimdallr.getServerTime();
			heimdallr.saveCollection('commentary_report',params);

		}

		else {
			let params = {};
			params.author = heimdallr.user_id;
			params.category = idReport;
			params.uid = this.props.idEntity;
			params.date = await heimdallr.getServerTime();
			heimdallr.saveCollection('post_report',params);
		}

	}

	deletePost = async () => {

		if(this.props.typeEntity === 'comentario'){
			this.props.close(true, this.props.idEntity);
		}
		else {
			this.props.close(true);
		}
	}


	render() {
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.reportTitle}>A postagem possui conteúdo: </Text>
					<TouchableOpacity onPress={this.makeReport.bind(this, 2)}>
						<View style={styles.listItem}>
							<Image style={styles.listImage} source={require('../../../../../assets/images/pig.png')}/>
							<Text> Pornográfico </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.makeReport.bind(this, 3)}>
						<View style={styles.listItem}>
							<Image style={styles.listImage} source={require('../../../../../assets/images/bully.png')}/>
							<Text> Ofensivo </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.makeReport.bind(this, 1)}>
						<View style={styles.listItem}>
							<Image style={styles.listImage} source={require('../../../../../assets/images/horror.png')}/>
							<Text> Violento </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.makeReport.bind(this, 4)}>
						<View style={styles.listItem}>
							<Image style={styles.listImage} source={require('../../../../../assets/images/flag.png')}/>
							<Text> Outros... </Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		height:200,
	},
	listImage: {
		width: 25,
		height: 25,
		marginRight: 20,
	},
	listItem: {
		flexDirection: 'row',
		alignContent: 'center',
		margin: 15,
	},
	reportTitle: {
		fontSize: 16,
		marginTop: 5,
		fontWeight: 'bold',
		paddingBottom: 15
	},
	deleteTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#8f8f8f'
	},
	deleteView: {
		padding: 5,
		paddingBottom: 20,
		paddingTop: 10,
		flexDirection: 'row',
		margin: 5
	},
	deleteIcon: {
		tintColor: '#491021',
		opacity: 0.5,
		width: 25,
		height: 25,
		marginRight: 15
	}
})
