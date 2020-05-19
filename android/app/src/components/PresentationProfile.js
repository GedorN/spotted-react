import React from 'react';
import {
	Text,
	StyleSheet,
	View,
	Dimensions,
} from 'react-native';

import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import UserImgProfile from "../../../../components/General/UserImgProfile";
const width = Dimensions.get('screen').width;
const height  = Dimensions.get('screen').height;
export default class PresentationProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: '',
			userImage: null,
			name: null,
		};
	}

	componentDidMount = () => {
		let uid = this.props.navigation.getParam('userId');
		this.state.userId = uid;
		// this.setState({ userId: uid });
		let user = heimdallr.getUserInfo(this.state.userId);
		user.then( (resolve) => {
			console.log('usuario retropando', resolve);
			console.log('printando a image', resolve.user_image);
			// this.state.userImage = resolve.user_image;
			this.setState({userImage: resolve.user_image, name: resolve.name});
			console.log('agora vai');
			console.log('image: ', this.state.userImage);
		});
		console.log('state', this.state);
		console.log('id: ', uid);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{width: width, height: (height / 3 ) , backgroundColor: 'yellow', postition: 'relative'}}>
				</View>
				<View style={styles.image}>
					<UserImgProfile circular height={200} width={200} uri={this.state.userImage}/>
					<View>
						<Text style={styles.text}>{this.state.name}</Text>
					</View>
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		backgroundColor: 'red',
		height: height,
		width: width
	},
	image: {
		position: 'absolute',
		top: width / 2,
		justifyContent: 'center',
		width: width,
		alignItems: 'center'
	},
	text: {
		fontWeight: 'bold',
		fontSize: 24
	}
});
