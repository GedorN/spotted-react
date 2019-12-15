import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	Button,
	Dimensions,
} from 'react-native';

const width = Dimensions.get('screen').width;
import heimdallr from "../../../../components/Heimdallr/Heimdallr";

export default class PasswordRestore extends React.Component{
	constructor (props) {
		super(props);
		this.state = {
			user: null,
		};
	}

	recover = () => {
		const params = {};
		params.email = this.state.user;
		let recovery = heimdallr.PasswordRestore(params);
		recovery.then((resolve) => {
			console.log('resolve: ', resolve);
			console.warn('Verifique seu email');
		});
	}


	render() {
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<TextInput
						autoCapitalize='none'
						style={styles.input}
						placeholder='E-mail...'
						autoCompleteType='email'
						keyboardType='email-address'
						textContentType='emailAddress'
						onChangeText={text => this.setState({ user: text })}
					/>
				</View>
				<View style={{marginTop: 20}}>
					<Button
						style={styles.signUpButtom}
						title='Recuperar'
						onPress={this.recover.bind(this)}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
	},
	form: {
		width: width * 0.8,
	},
	signUpButtom: {
		marginTop: 60,
	},
});