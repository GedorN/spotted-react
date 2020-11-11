import React from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity, Image, Modal
} from 'react-native';

import UserImgProfile from "../../../../../components/General/UserImgProfile";
import theme from "../../../../../components/General/Theme";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import FatBottomedButton from "../buttons/FatBottomedButton";

export default class ReceivedRequest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			accepting: false,
			refusing: false,
		}
	}
	REQUEST_STATE = null;

	componentDidMount(): void {
		if (this.props.reading_status) {
			if (this.props.allowed) {
				this.REQUEST_STATE = 'confirmButtonFilled';
			} else {
				this.REQUEST_STATE = 'cancelButtonFilled';
			}
			this.setState({});
		}
	}

	disableModal = () => {
		this.setState({ showModal: false });
	}

	acceptRequest = () => {
		const params = {};
		params.receiver_id = heimdallr.user_id;
		params.request_id = this.props.requestId;
		params.sender_id = this.props.senderId;
		heimdallr.acceptPhoneRequest(params);
		this.REQUEST_STATE = "confirmButtonFilled";
		this.setState({ accepting: false, refusing: false, showModal: false });
	}

	refuseRequest = () => {
		const params = {};
		params.request_id = this.props.requestId;
		params.receiver_id = heimdallr.user_id;
		heimdallr.refusePhoneRequest(params);
		this.REQUEST_STATE = 'cancelButtonFilled';
		this.setState({ accepting: false, refusing: false, showModal: false });

	}

	openModal = (status) => {
		if (status === 'accepting') {
			this.setState({ accepting: true, refusing: false, showModal: true });
		} else {
			this.setState({ accepting: false, refusing: true, showModal: true });
		}
	}

	goToUserProfile = () => {
		this.props.navigation.push('UserProfile', {
			userId: this.props.senderId,
		});
	}


	render() {
		return (
			<View style={styles.container}>
				<View style={{flexDirection: 'row', flex: 1}}>
					<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
						<UserImgProfile circular height={45} width={45} uri={this.props.senderImage}/>
					</TouchableOpacity>
					<View style={{flexDirection: 'column', marginLeft: 16, flex: 1}}>
						<Text style={{ fontWeight: 'bold' }}>{this.props.senderName}</Text>
						<View style={{flexDirection: 'row', flex: 1, marginTop: 8}}>
							<TouchableOpacity onPress={this.openModal.bind(this)} disabled={this.REQUEST_STATE === 'confirmButtonFilled'} style={this.REQUEST_STATE === 'confirmButtonFilled' ? {opacity: 0.2} : {opacity: 1} } >
								{
									this.REQUEST_STATE && this.REQUEST_STATE === 'cancelButtonFilled'?
										<View style={styles.cancelButtonFilled}>
											<Text style={{ color: '#FFFFFF' }}>RECUSADO</Text>
										</View> :
										<View style={styles.cancelButton}>
											<Text style={{ color: '#D40000' }}>RECUSAR</Text>
										</View>
								}

							</TouchableOpacity>
							<TouchableOpacity onPress={this.openModal.bind(this, 'accepting')} >
								{
									this.REQUEST_STATE && this.REQUEST_STATE === 'confirmButtonFilled' ?
										<View style={styles.confirmButtonFilled}>
											<Text style={{ color: '#FFFFFF' }}>ACEITO</Text>
										</View>:
										<View style={styles.confirmButton}>
											<Text style={{ color: '#0C880C' }}>ACEITAR</Text>
										</View>
								}

							</TouchableOpacity>
						</View>
					</View>
				</View>
				<Modal
					hardwareAccelerated={true}
					animationType='fade'
					transparent={true}
					visible={this.state.showModal}
					onRequestClose={() => {
						this.disableModal();
					}}
					style={{ height: 50, width: theme.width * 0.5 }}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalContainer}>
							<View style = { styles.modalHeader }>
								<TouchableOpacity onPress={() => {this.disableModal()}}>
									<View style = {{ width:theme.width * 0.15, height:theme.height*0.05, alignSelf:'flex-end' }}>
										<Image
											style = {{ width: 15, height: 15,opacity:0.4, alignSelf: 'flex-end', tintColor: theme.primary }}
											source = {require('../../../../../assets/images/times-solid.png')}
										/>
									</View>
								</TouchableOpacity>
							</View>
							<View style = {{ height: theme.height * 0.40, flexDirection: 'column', alignContent :'space-between', justifyContent: 'space-between' }}>
								<View style = {{ marginTop: theme.height * 0.05, flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-between' }}>
									<View>
										<UserImgProfile circular height={70} width={70}  uri={this.props.senderImage}/>
									</View>
									<View style = {{ marginTop: 20}}>
										<Image
											style = {{width: 40, height: 40, opacity:0.4, tintColor: theme.primary}}
											source = {require('../../../../../assets/images/heart-solid.png')}
										/>
									</View>
									<View>
										<UserImgProfile circular height={70} width={70}  uri={ heimdallr.user_image }/>
									</View>
								</View>
								{
									this.state.phoneRequestMade?
									<View style = {{ width: theme.width * 0.8, alignSelf: 'center' }}>
										<Text style = {{ fontSize: 17, color: theme.primary, alignSelf: 'center', fontWeight: 'bold', opacity: 0.4 }}>{'Solicitação enviada'}</Text>
									</View>
									:
									<View style = {{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
										<Text style = {{ fontSize: 15, color: theme.primary, alignSelf: 'center', justifySelf: 'center', textAlign: 'center' }}>{`${this.state.accepting ? 'Aceitar' : 'Recusar'} a solicitação de ` + this.props.senderName + `?`}</Text>
									</View>
								}
								<View style={{marginTop:5, width: theme.width * 0.7, alignSelf:'center'}}>
									<FatBottomedButton borderColor={this.state.accepting ? '#0C880C' : '#D40000'} backgroundColor = {this.state.accepting ? '#0C880C' : '#D40000'} color={theme.secondary} text={this.state.accepting? ' Aceitar ' : 'Recusar'} onTap={this.state.accepting ? this.acceptRequest.bind(this) : this.refuseRequest.bind(this)}/>
								</View>

							</View>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 17,
		paddingVertical: 16,
		borderBottomWidth: 0.3,
	},
	cancelButton: {
		borderWidth: 1,
		padding: 6,
		paddingHorizontal: 16,
		borderRadius: 10,
		borderColor: '#D40000'
	},
	cancelButtonFilled: {
		borderWidth: 1,
		padding: 6,
		paddingHorizontal: 16,
		borderRadius: 10,
		borderColor: '#D40000',
		backgroundColor: '#D40000',
	},
	confirmButton: {
		borderWidth: 1,
		padding: 6,
		marginLeft: 26,
		borderRadius: 10,
		paddingHorizontal: 16,
		borderColor: '#0C880C',
		color: '#0C880C',
	},
	confirmButtonFilled: {
		borderWidth: 1,
		padding: 6,
		marginLeft: 26,
		borderRadius: 10,
		paddingHorizontal: 16,
		borderColor: '#0C880C',
		color: '#0C880C',
		backgroundColor: '#0C880C',
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingTop: theme.height * 0.1,
		marginTop: -(theme.height * 0.1)
	},
	modalContainer: {
		width: theme.width * 0.9,
		height: theme.height * 0.50,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		paddingBottom:20,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex:0,
	},
	modalHeader : {
		flexDirection: 'column',
		width: theme.width * 0.9,
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		padding: 20,
		paddingBottom: 0,
		position:'absolute',
		marginLeft:0.001,
	},
})
