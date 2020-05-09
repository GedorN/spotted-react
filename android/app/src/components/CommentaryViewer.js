import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Dimensions, Image,
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";
import RBSheet from "react-native-raw-bottom-sheet";
import ReportGod  from './Inputs/ReportGod';
import AwesomeAlert from "react-native-awesome-alerts";


const width = Dimensions.get('screen').width;

export default class CommentaryViewer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showAlert: false,
		};
	}
	goToUserProfile = () => {
		 this.props.navigation.push('UserProfile', {
			userId: this.props.user_id,
		}); 

	}

	return = () => {
		this.props.navigation.goBack();
	}

	closeAlert = () => {
		this.RBSheet.close();
		this.setState({ showAlert: true });
		this.props.commentaryCallback(this.state.showAlert);
	}


	render = () => {
		return (
			<View style={styles.container}>
				<TouchableOpacity  onPress={this.props.anonymous? null : this.goToUserProfile.bind(this)}>
					<UserImgProfile circular marginBottom={5} height={45} width={45} uri={this.props.userImage ? this.props.userImage : null}/>
				</TouchableOpacity>
				<View style={styles.body}>
					<View style = {{flexDirection:'row'}}>
						<View style={{ width: theme.width * 0.68,height:theme.height*0.08, flexDirection: 'row', alignItems: 'center'}}>
							<Text style={styles.userNameText}>
								{this.props.user_name}
							</Text>
							{this.props.elapsed_time &&
							<Image
								style={{width: 4, height: 4, marginLeft: 4, marginRight: 4, marginTop:35, opacity:0.7}}
								source={require('../../../../assets/images/circle-solid.png') }
							/>
							}
							<Text style= {{marginTop:35, flexWrap: 'wrap'}}>
								{ this.props.elapsed_time }
							</Text>
						</View>
						<TouchableOpacity style = {{flexDirection: 'column', justifyContent:'flex-end', width:theme.width * 0.1,height:theme.height * 0.07}} onPress={() => this.RBSheet.open()}>
										<View style={{width: 40, height: 20, zIndex: 9999,alignItems: 'flex-end', justifyContent: 'flex-end',alignSelf:'flex-end',marginRight:theme.width*0.010}}>
										<Image
										style={{width: 20, height: 12,marginTop:5}}
										source={require('../../../../assets/images/ellipsis-h-solid.png')}
										/>
										</View>
						</TouchableOpacity>
					</View>
					<View style={{width: theme.width * 0.85}}>
						<Text style={styles.commentaryText}>
							{ this.props.text }
						</Text>
					</View>
				</View>
				<RBSheet
					ref={ref => {
						this.RBSheet = ref;
					}}
					height={300}
					animationType={'slide'}
					duration={250}
				>
					<ReportGod  close={this.closeAlert.bind(this)} idEntity = {this.props.cid} typeEntity = {'comentario'} pid = {this.props.pid}/>
				</RBSheet>
			</View>
		);
	}
}

const styles  = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 20,
		borderColor: 'rgba(59, 56, 50, 0.2)',
		borderBottomWidth: 0.18,

	},
	body: {
		flexDirection: 'column',
	},
	userNameText: {
		fontWeight: 'bold',
		marginLeft: 16,
		marginTop:35,
	},
	commentaryText: {
		marginLeft: 17,
		marginTop:10,
	}
});