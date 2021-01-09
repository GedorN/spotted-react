import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	StatusBar, TouchableOpacity, Image
} from 'react-native';

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import UserInfoCard from "./components/UserInfoCard";
import theme from "../../../../../components/General/Theme";


export default class PortalUTFPR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	componentDidMount(): void {
		if (!heimdallr.UTFPRToken) {
			this.props.navigation.navigate('LoginPortal');
		} else {
			StatusBar.setBackgroundColor('#F6C500');
			StatusBar.setBarStyle('dark-content');
		}
	}

	returnToHome = () => {

	}

	render() {
		return (
			<View>
				<View style={styles.backColor}></View>
				<View style = {{alignSelf:'flex-start'}}>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 2,  paddingLeft: 15, width:theme.width * 0.2,height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, opacity: 0.6, position: 'absolute', marginLeft: 8, marginTop: 8}}
								source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
				</View>
				<UserInfoCard navigation={this.props.navigation}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	backColor: {
		width: theme.width,
		height: theme.height * 0.2,
		position: 'absolute',
		backgroundColor: '#F6C500'
	}
})
