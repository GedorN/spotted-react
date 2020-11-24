import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity, Image
} from 'react-native';
import UserImgProfile from "../../../../../components/General/UserImgProfile";
import Contacts from 'react-native-contacts';

export default class MyRequest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSaveAction: false
		}
	}
	REQUEST_STATE = null;

	componentDidMount(): void {
		if (this.props.reading_status) {
			if (this.props.allowed) {
				this.REQUEST_STATE = 'requestAccepted';
			} else {
				this.REQUEST_STATE = 'requestRejected';
			}
			this.setState({});
		}
	}

	goToUserProfile = () => {
		this.props.navigation.push('UserProfile', {
			userId: this.props.receiverId,
		});
	}

	saveContact = () => {
		Contacts.openContactForm({
			phoneNumbers: [{
				label: 'mobile',
				number: this.props.receiverPhone,
			}],
			displayName: this.props.receiverName
		})
	}

	getRequestStatus = () => {
		if (this.REQUEST_STATE === null) {
			return (
				<Text style={{color: '#020c73'}} >Aguardando resposta...</Text>
			)
		} else {
			if (this.props.allowed) {
				return (
					<View style={{flexDirection: 'row'}}>
						<Image
							style = {{width: 25, height: 20, alignSelf: 'center', tintColor: '#0C880C'}}
							source = {require('../../../../../assets/images/receiver_phone.png')}
						/>
						<Text style={{marginLeft: 8}} >{this.props.receiverPhone}</Text>
					</View>
				)
			} else {
				return (
					<Text style={{ color: '#D40000' }}>Pedido negado</Text>
				)
			}
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity disabled={this.REQUEST_STATE !== 'requestAccepted'} onPress={this.saveContact.bind(this)}>
					<View style={{flexDirection: 'row', flex: 1}}>
						<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
							<UserImgProfile circular height={45} width={45} uri={this.props.receiverImage}/>
						</TouchableOpacity>
							<View style={{flexDirection: 'column', marginLeft: 16, flex: 1}}>
								<Text style={{ fontWeight: 'bold' }}>{this.props.receiverName}</Text>
								<View style={{flexDirection: 'row', flex: 1, marginTop: 8}}>
									{this.getRequestStatus()}
								</View>
							</View>
					</View>
				</TouchableOpacity>

			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 17,
		paddingVertical: 16,
		borderBottomWidth: 0.5,
	}
})
