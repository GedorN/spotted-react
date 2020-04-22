import React from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Dimensions,
} from 'react-native';

import UserImgProfile from "../../../../components/General/UserImgProfile";
import theme from "../../../../components/General/Theme";

const width = Dimensions.get('screen').width;

export default class CommentaryViewer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {

		};
	}

	goToUserProfile = () => {
		console.warn("props user_id from commentary",this.props.user_id);
		 this.props.navigation.navigate('UserProfile', {
			userId: this.props.user_id,
		}); 

	}

	return = () => {
		this.props.navigation.goBack();
	}

	render = () => {
		return (
			<View style={styles.container}>
				<TouchableOpacity  onPress={this.goToUserProfile.bind(this)}>
					<UserImgProfile circular marginBottom={5} height={45} width={45} borderWidth={2} borderColor={theme.primary} uri={this.props.userImage ? this.props.userImage : null}/>
				</TouchableOpacity>
				<View style={styles.body}>
					<Text style={styles.userNameText}>
						{this.props.user_name}
					</Text>
					<Text style={styles.commentaryText}>
						{ this.props.text }
					</Text>
				</View>
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
		width: width,

	},
	body: {
		flexDirection: 'column',
	},
	userNameText: {
		fontWeight: 'bold',
		marginLeft: 30,
	},
	commentaryText: {
		marginLeft: 30,
	}
});