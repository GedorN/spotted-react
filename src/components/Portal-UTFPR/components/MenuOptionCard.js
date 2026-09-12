import React from 'react';

import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Image
} from 'react-native';

import theme from "../../../components/General/Theme";

export default class MenuOptionCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		return (
			<TouchableOpacity style={styles.container} disabled={this.props.disabled} onPress={() => this.props.navigation.navigate(this.props.route)}>
				<View>
					{
						this.props.disabled &&
							<Text style={{ fontWeight: 'bold' }} >Em breve</Text>
					}
				</View>
				<Image
					source={this.props.icon}
					style={{
						width: this.props.width ? this.props.width : 50,
						height: this.props.height ? this.props.height : 50,
						opacity: this.props.disabled ?  0.2 : 1,
					}}
				/>
				<Text
					style={{
						alignSelf: 'center',
						textAlign:'center',
						fontSize: 12,
						lineHeight: 17,
						opacity: this.props.disabled ?  0.2 : 1,
					}}>
					{this.props.title}
				</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: theme.width * 0.33,
		height: theme.height * 0.23,
		borderRadius: 20,
		backgroundColor: 'white',
		elevation: 4,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'space-between'
	}
})
