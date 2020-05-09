import React from 'react';
import {
	View,
	Text,
	StyleSheet,
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

		if(this.props.typeEntity === 'comentario'){
			let params = {};
			params.pid = this.props.pid;
			params.author = heimdallr.user_id;
			params.category = idReport;
			params.uid = this.props.idEntity,
			params.date = await heimdallr.getServerTime();

			let result = heimdallr.saveSpecificColletion('commentary_report',params);
			result.then((resolve) => {
				console.warn("REPORT SAVED");
			})

		}

		else {
			let params = {};
			params.author = heimdallr.user_id;
			params.category = idReport;
			params.uid = this.props.idEntity;
			params.date = await heimdallr.getServerTime();

			let result = heimdallr.saveSpecificColletion('post_report',params);
			result.then((resolve) => {
				console.warn("REPORT SAVED");
			})
		}

		
		this.props.close();
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
				<List.Item
					title="Pornográfico"
					onPress={this.makeReport.bind(this, 2)}
					left={() => <List.Icon icon={require('../../../../../assets/images/pig.png')} style={{width: 20, height: 20}}/>}
				/>
				<List.Item
					title="Ofensivo"
					onPress={this.makeReport.bind(this, 3)}
					left={() => <List.Icon icon={require('../../../../../assets/images/bully.png')} style={{width: 20, height: 20}}/>}
				/>
				<List.Item
					title="Violento"
					onPress={this.makeReport.bind(this, 1)}
					left={() => <List.Icon icon={require('../../../../../assets/images/horror.png')} style={{width: 20, height: 20}}/>}
				/>
				<List.Item
					title="Outros..."
					onPress={this.makeReport.bind(this, 4)}
					left={() => <List.Icon icon={require('../../../../../assets/images/flag.png')} style={{width: 20, height: 20}}/>}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	}
})