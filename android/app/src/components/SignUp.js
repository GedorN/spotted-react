import React from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
} from 'react-native';


export default  class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state= {};
	}

	render(){
		return (
			<View style={styles.container}>
				<Button title='Cancelar' color='red' onPress={() => this.props.navigation.goBack()} />
			</View>
		);
	}
}

const styles= StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
});