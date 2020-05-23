import React from 'react';
import {
	StyleSheet,
	View,
	Image,
} from 'react-native';

import theme from "../../../../../components/General/Theme";

export default class SevenBannerArmy extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render() {
		return (
			<View style={styles.banner}>
				<Image
					style={{flex: 1, resizeMode: 'contain', width: null, height: null}}
					source={{uri: this.props.url ? this.props.url : ''}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	banner: {
		width:theme.width*0.98,
		height: theme.height * 0.23,
		borderWidth: 1,
		flex: 1,
	}
})
