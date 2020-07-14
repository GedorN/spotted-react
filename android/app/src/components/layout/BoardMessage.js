import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';

import theme from "../../../../../components/General/Theme";
import Ripple from 'react-native-material-ripple';


export default class BoardMessage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		}
    }

    componentDidMount = () => {

	}

	goToBoardSubject = () => {
		this.props.navigation.navigate('BoardItems', {id: this.props.collection});
	}

    render() {
		return (
			<View style = {styles.subject}>
				<Ripple
					rippleOpacity={0.42}
					rippleColor="rgba(143, 143, 143, .8)"
					onPress={this.goToBoardSubject.bind(this)}
					rippleCentered = {true}
				>
					<View style = {styles.subjectView}>
						<View style = {styles.subjectIcon}>
							<View style = {styles.subjectImageView}>
								<Image style={styles.subjectImage}
									   source={{ uri : this.props.icon }}
								/>
							</View>
						</View>
						<View style = {styles.subjectTitle}>
							<Text style = {styles.subjectText}>{this.props.title}</Text>
						</View>
					</View>
				</Ripple>
			</View>
        )
    }

}

const styles = StyleSheet.create({
	subject: {
		width: theme.width * 0.42,
		height: theme.height * 0.21,
		borderColor: 'black',
		flexDirection: 'column',
		alignContent: 'center',
		alignItems: 'center',
		elevation: 7,
		borderRadius: 35,
		backgroundColor: 'white',
		marginTop: 20,
	},
	subjectTitle: {
		flex: 0.3,
		borderBottomLeftRadius: 35,
		borderBottomRightRadius: 35,
		backgroundColor: theme.primary,
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		width: theme.width * 0.42,
		borderTopRightRadius: 1,
		borderTopLeftRadius: 1
	},
	subjectIcon: {
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		flex: 0.7,
		justifyContent: 'center',
		alignItems: 'center'
	},
	subjectText: {
		fontWeight:'bold',
		color: 'white',
		alignSelf: 'center',
		textAlign: 'center',
		width: theme.width * 0.38
	},
	subjectImageView: {
		width: theme.width * 0.2,
		height: theme.height * 0.1
	},
	subjectImage: {
		resizeMode: 'contain',
		flex: 1,
		width: null,
		height: null,
		opacity: 0.9,
		tintColor:'#c0abb2'
	},
	subjectView: {
		borderRadius: 35,
		height: theme.height * 0.22
	}
})
