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
		this.props.close();
		if(this.props.typeEntity === 'comentario'){
			let params = {};
			params.pid = this.props.pid;
			params.author = heimdallr.user_id;
			params.category = idReport;
			params.uid = this.props.idEntity;
			params.date = await heimdallr.getServerTime();
			heimdallr.saveSpecificColletion('commentary_report',params);

		}

		else {
			let params = {};
			params.author = heimdallr.user_id;
			params.category = idReport;
			params.uid = this.props.idEntity;
			params.date = await heimdallr.getServerTime();
			heimdallr.saveSpecificColletion('post_report',params);
		}

	}


	render() {
		return (
			<View style={styles.container}>
				<Text
					style={{fontSize: 18, fontWeight: 'bold'}}
				>Denúncia de conteúdo impróprio </Text>
				<Text
					style={{fontSize: 16, marginTop: 5}}
				>A postagem possui conteúdo: </Text>
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
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	},
	listImage: {
		width: 25,
		height: 25,
		marginRight: 20,
	},
	listItem: {
		flexDirection: 'row',
		alignContent: 'center',
		margin: 10,
	}
})