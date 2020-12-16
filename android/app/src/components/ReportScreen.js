import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput
} from 'react-native';

import {
	ProgressBar
} from 'react-native-paper';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import FatBottomedButton from "./buttons/FatBottomedButton";
import theme from "../../../../components/General/Theme";



export default class ReportScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: null,
			description : null,
			activity: false,
		};
	}

	makeReport = async () => {
		this.setState({ activity: true })
		const entity =  this.props.navigation.getParam('entity');
		const pid = this.props.navigation.getParam('pid');
		if(entity === 'commentary'){
			const cid = this.props.navigation.getParam('cid');
			let params = {};
			params.pid = pid;
			params.cid = cid;
			params.category = this.state.selectedOption;
			params.author = heimdallr.user_id;
			params.date = await heimdallr.getServerTime();
			params.description = this.state.description;
			heimdallr.saveCollection('commentary_report',params).then(
				() => {
					this.props.navigation.navigate('ThanksForReport');
					this.setState({ activity: false })
				},
				(e) => {
					console.log('[ERRO] - Erro ao salvar report: ', e);
					this.setState({ activity: false })
				}
			);
		} else if (entity === 'post') {
			let params = {};
			params.pid = pid;
			params.category = this.state.selectedOption;
			params.author = heimdallr.user_id;
			params.date = await heimdallr.getServerTime();
			params.description = this.state.description;
			heimdallr.saveCollection('post_report',params).then(
				() => {
					this.props.navigation.navigate('ThanksForReport');
					this.setState({ activity: false })
				},
				(e) => {
					console.log('[ERRO] - Erro ao salvar report: ', e);
					this.setState({ activity: false })
				}
			);
		} else if (entity === 'board') {
			let params = {};
			params.pid = pid;
			params.category = this.state.selectedOption;
			params.author = heimdallr.user_id;
			params.date = await heimdallr.getServerTime();
			params.description = this.state.description;
			heimdallr.saveCollection('board_report',params).then(
				() => {
					this.props.navigation.navigate('ThanksForReport');
					this.setState({ activity: false })
				},
				(e) => {
					console.log('[ERRO] - Erro ao salvar report: ', e);
					this.setState({ activity: false })
				}
			);
		} else {
			const cid = this.props.navigation.getParam('cid');
			let params = {};
			params.pid = pid;
			params.cid = cid;
			params.category = this.state.selectedOption;
			params.author = heimdallr.user_id;
			params.date = await heimdallr.getServerTime();
			params.description = this.state.description;
			heimdallr.saveCollection('board_commentary_report',params).then(
				() => {
					this.props.navigation.navigate('ThanksForReport');
					this.setState({ activity: false })
				},
				(e) => {
					console.log('[ERRO] - Erro ao salvar report: ', e);
					this.setState({ activity: false })
				}
			);
		}



	}

	selectType = (type) => {
		this.setState({ selectedOption: type });
	}

	return = () => {
		this.props.navigation.goBack();
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
				<ProgressBar size="large" visible={this.state.activity} indeterminate color={theme.primary}/>
				<TouchableOpacity onPress={this.return.bind(this)}>
					<View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5,  paddingLeft: 10}}>
						<Image
							style={{width: 12, height: 12, marginTop:4}}
							source={require('../../../../assets/images/arrow-left.png')}
						/>
						<Text style={{marginLeft: 5}}>
							voltar
						</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.body}>
					<Text style={styles.reportTitle}>A postagem possui conteúdo: </Text>
					<TouchableOpacity style={ this.state.selectedOption === 1 ? styles.selectedReport : '' } onPress={this.selectType.bind(this, 1)}>
						<View style={{ ...styles.listItem }}>
							<Image style={styles.listImage} source={require('../../../../assets/images/horror.png')}/>
							<Text> Violento </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={ this.state.selectedOption === 2 ? styles.selectedReport : '' } onPress={this.selectType.bind(this, 2)}>
						<View style={{ ...styles.listItem }}>
							<Image style={styles.listImage} source={require('../../../../assets/images/pig.png')}/>
							<Text> Pornográfico </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={ this.state.selectedOption === 3 ? styles.selectedReport : '' } onPress={this.selectType.bind(this, 3)}>
						<View style={{ ...styles.listItem }}>
							<Image style={styles.listImage} source={require('../../../../assets/images/bully.png')}/>
							<Text> Ofensivo </Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={ this.state.selectedOption === 4 ? styles.selectedReport : '' } onPress={this.selectType.bind(this, 4)}>
						<View style={{ ...styles.listItem }}>
							<Image style={styles.listImage} source={require('../../../../assets/images/flag.png')}/>
							<Text> Outros... </Text>
						</View>
					</TouchableOpacity>
					{
						this.state.selectedOption &&
						<View style={{marginTop: 8}}>
							<TextInput
								style={styles.textArea}
								placeholder={"Nos ajude a entender melhor o motivo da denúncia"}
								multiline
								onChangeText={text => this.setState({ description: text })}
								value={this.state.description}
							/>
							<View style={{marginTop: 26}}>
								<FatBottomedButton onTap={this.makeReport.bind(this)}  backgroundColor={ theme.primary } borderColor = {theme.primary} color={ 'white' } text={ 'Denunciar' } disabled={!this.state.description || this.state.activity}  />
							</View>
						</View>
					}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height:200,
	},
	body: {
		padding: 16,
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
	selectedReport: {
		borderWidth: 1,
		borderRadius: 16,
		borderColor: 'rgba(73, 16, 33, 0.3)',
		backgroundColor: 'rgba(73, 16, 33, 0.1)'
	},
	textArea: {
		borderWidth: 1,
		borderColor: 'rgba(100, 100, 100, 0.5)',
		borderRadius: 8,
		height: theme.height * 0.2,
		textAlignVertical: 'top',
	}
})
