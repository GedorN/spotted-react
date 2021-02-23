import React from 'react';

import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Modal
} from 'react-native';
import theme from "../../../../../../components/General/Theme";

export default class SubjectStatus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			preRequisites: null,
			hasPreRequisitesIncomplete: false,
			showPreRequisites: false,
		}
	}

	componentDidMount(): void {
		const len = this.props.preRequisite ? this.props.preRequisite.filter(i => i.subjectStatus === 0).length : 0;
		if (len > 0) {
			this.state.hasPreRequisitesIncomplete = true;
		}
		this.state.preRequisites = this.props.preRequisite;
		this.setState({});

	}

	returnPreRequisiteIndicator () {
		if (this.state.hasPreRequisitesIncomplete) {
			return (
				<View>
					<Text style={{ fontSize: 11, color: '#6D0202', marginLeft: 40 }} >Pré Requisito: Incompleto</Text>
				</View>
			)

		} else {
			return (
				<View>
					<Text style={{ fontSize: 11, color: '#027227', marginLeft: 40 }}>Pré Requisito: Ok</Text>
				</View>
			)

		}
	}


	render() {
		return (
			<TouchableOpacity style={styles.container} disabled={this.props.status === 1} onPress={() => this.setState({ showPreRequisites: true })}>
				<Image style={{...styles.icon, tintColor: this.props.status === 1 ? '#027227' : 'black'}}  source={ this.props.status === 1 ? require('../../../../../../assets/images/check.png') : require('../../../../../../assets/images/info-circle-solid.png')}/>
				<View>
					<Text style={styles.subjectName}>{ this.props.title }</Text>
					{
						this.props.status !== 1 && this.returnPreRequisiteIndicator()
					}
				</View>
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.showPreRequisites}
					onRequestClose={() => {
						this.setState({ showPreRequisites: false });
					}}
				>
					<TouchableOpacity activeOpacity={1} onPress={() => this.setState({ showPreRequisites: false }) }  style={styles.centeredView}>
						<TouchableOpacity  activeOpacity={1} style={styles.modalView}>
							<View style={styles.modalHeader}>
								<Text style={{ fontWeight: 'bold' }} >{this.props.title}</Text>
								<TouchableOpacity onPress={() => this.setState({ showPreRequisites: false })} style={{ position: 'absolute', right: 18, top: 18}}>
									<Image
										source={require('../../../../../../assets/images/times-solid.png')}
										style={{ width: 20, height: 20 }}
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.modalBody}>
								<Text style={{ color: '#AFAFAF', fontWeight: 'bold' }}>Pré Requisitos</Text>
								{
									this.state.preRequisites && this.state.preRequisites.map(i =>
										<View style={{ marginLeft: 8, marginTop: 12, flexDirection: 'row', alignItems: 'center' }} key={i.discCodvelhoVc}>
											<Image style={{...styles.icon, tintColor: i.subjectStatus === 1 ? '#027227' : '#970303'}}  source={ i.subjectStatus === 1 ? require('../../../../../../assets/images/check.png') : require('../../../../../../assets/images/times-solid.png')}/>
											<Text style={{ marginLeft: 10 }} >{i.discNomeVc}</Text>
										</View>
									)
								}
							</View>
						</TouchableOpacity>
					</TouchableOpacity>
				</Modal>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		width: 16,
		height: 16,
	},
	subjectName: {
		marginLeft: 40,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: theme.width * 0.8,
		zIndex: 99,

	},
	modalHeader: {
		height: theme.height * 0.1,
		width: theme.width * 0.8,
		backgroundColor: '#F6C500',
		padding: 15,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalBody: {
		minHeight: 80,
		padding: 16,
		width: theme.width * 0.8,
		alignItems: 'flex-start',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	}
});
