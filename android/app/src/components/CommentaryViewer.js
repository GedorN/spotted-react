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
import PostOptions from "./Inputs/PostOptions";
import heimdallr from '../../../../components/Heimdallr/Heimdallr';


const width = Dimensions.get('screen').width;

export default class CommentaryViewer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			reportAlert: true,
		};
	}



	componentDidMount = () => {

		if(this.props.user_id === heimdallr.user_id){
			this.setState({reportAlert: false})
		}
	}

	goToUserProfile = () => {
		 this.props.navigation.push('UserProfile', {
			userId: this.props.user_id,
		});

	}

	return = () => {
		this.props.navigation.goBack();
	}

	deletePost = (deleteAction, cid) => {
		this.RBSheet.close();
		this.props.deleteCommentary(cid);
	}

	closeAlert = () => {
		this.RBSheet.close();
		this.props.commentaryCallback();
	}


	render = () => {
		return (
			<View style={styles.container}>
				<View style={styles.body}>
					<View style = {{flexDirection:'row'}}>
						<TouchableOpacity  onPress={this.props.anonymous? null : this.goToUserProfile.bind(this)}>
							<UserImgProfile circular marginBottom={5} height={45} width={45} uri={this.props.userImage ? this.props.userImage : null}/>
						</TouchableOpacity>
						<View style={{ width: theme.width * 0.8, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
							<View style = {{flexDirection:'row',alignItems: 'center'}}>
								<Text style={styles.userNameText}>
									{this.props.user_name}
								</Text>
								{this.props.elapsed_time &&
								<Image
									style={{width: 4, height: 4, marginLeft: 4, marginRight: 4,opacity:0.7}}
									source={require('../../../../assets/images/circle-solid.png') }
								/>
								}
								<Text style= {{flexWrap: 'wrap'}}>
									{ this.props.elapsed_time }
								</Text>
							</View>
							<TouchableOpacity style = {{justifyContent:'center', width:theme.width * 0.1,height:theme.height * 0.07}} onPress={() => this.RBSheet.open()}>
										<View style={{width: 40, height: 20, zIndex: 9999,alignItems: 'flex-end',marginRight:theme.width*0.010,alignSelf:'flex-end'}}>
										<Image
										style={{width: 20, height: 12,marginTop:5}}
										source={require('../../../../assets/images/ellipsis-h-solid.png')}
										/>
										</View>
							</TouchableOpacity>
						</View>

					</View>
					<View style={{width: theme.width * 0.75,flexWrap:'wrap',alignItems:'flex-start',alignSelf:'flex-end'}}>
						<Text>{ this.props.text }</Text>
					</View>
				</View>
				<RBSheet
					ref={ref => {
						this.RBSheet = ref;
					}}
					height={this.state.reportAlert ? 300 : 150}
					animationType={'slide'}
					duration={250}
				>
					{/*<ReportGod  close={this.closeAlert.bind(this)} idEntity = {this.props.cid} typeEntity = {'comentario'} pid = {this.props.pid} userId = {this.props.user_id}/>*/}
					<PostOptions  deletePost={this.deletePost.bind(this)} close={this.closeAlert.bind(this)} idEntity = {this.props.cid} typeEntity = {'comentario'} pid = {this.props.pid} userId = {this.props.user_id}/>
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
		borderBottomWidth: 0.18
	},
	body: {
		flexDirection: 'column',
		marginBottom:theme.height * 0.02,
	},
	userNameText: {
		fontWeight: 'bold',
		marginLeft: 16,

	},
});
