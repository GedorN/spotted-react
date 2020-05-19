import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import UserImgProfile from "./UserImgProfile";

export default class UserBannerView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	goToUserProfile = () => {
	 	this.props.navigation.navigate('UserProfile', {
		   userId: this.props.userId,
	   });

   }

   	return = () => {
		this.props.navigation.goBack();
	}

	render() {
		return (
			<TouchableOpacity onPress={this.goToUserProfile.bind(this)}>
				<View style={styles.container}>
					<UserImgProfile circular height={45} width={45} uri={this.props.profileImage} />
					<View style={styles.info}>
						<Text>
							{this.props.userName}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 5,
		borderTopWidth: 0.2,
		borderColor: 'rgba(59, 56, 50, 0.2)',
	},
	info: {
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 20,
	},
})
