import React from 'react';
import {
	View,
	StyleSheet,
	Text,
} from 'react-native';
import UserImgProfile from "./UserImgProfile";

export default class UserBannerView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<View style={styles.container}>
				<UserImgProfile circular height={45} width={45} uri={this.props.profileImage} />
				<View style={styles.info}>
					<Text>
						{this.props.userName}
					</Text>
				</View>
			</View>
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