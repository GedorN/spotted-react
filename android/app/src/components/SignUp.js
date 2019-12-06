import React from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	Dimensions,
	TextInput,
} from 'react-native';

const width = Dimensions.get('screen').width;
import DateTimePicker from '@react-native-community/datetimepicker';
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
export default  class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state= {
			email: null,
			name: null,
			password: null,
			confirmPassword: null,
			showDatePicker: false,
		};
	}

	register = () => {
		console.warn('recebido');
		const params = {};
		params.email = this.state.email;
		params.password = this.state.password;
		console.log('params: ', params);
		let result = heimdallr.signUp(params);
		result.then( (resolve) => {
			console.log('voltou>: ', resolve);
		});
	}

	setDate = (date) => {
		console.log('date', new Date(date.nativeEvent.timestamp));
		this.setState({birth: new Date(date.nativeEvent.timestamp)});
		this.postTextInput.setNativeProps({text: this.state.birth});
	}

	getDatePicker = () => {
		console.warn('selected');
		if (this.state.showDatePicker) {
			return (
				<DateTimePicker value={new Date('2020-06-12T14:42:42')}
				                mode={'date'}
				                is24Hour={true}
				                display="default"
				                onChange={this.setDate.bind(this)}
				/>
			);
		}
	}

	render(){
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						onChangeText={ text => this.setState({ email: text }) }
						autoCapitalize='none'
						placeholder='Email'
						keyboardType='email-address'
						textContentType='emailAddress'
					/>
				</View>
				<View style={{width: width * 0.8, flexDirection: 'row'}}>
					<TextInput
						style={styles.inputLeft}
						onChangeText={ text => this.setState({ name: text }) }
						autoCapitalize='words'
						placeholder='Nome'
						textContentType='name'
					/>
					<TextInput
						style={styles.inputRight}
						onFocus={ focus => this.setState({showDatePicker: true}) }
						onChangeText={ focus => this.setState({showDatePicker: true}) }
						autoCapitalize='none'
						ref={input => (this.postTextInput = input)}
						placeholder='Nascimento'
					/>
				</View>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						onChangeText={ text => this.setState({ password: text }) }
						autoCapitalize='none'
						placeholder='Password'
						textContentType='password'
					/>
				</View>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						onChangeText={ text => this.setState({ confirmPassword: text }) }
						autoCapitalize='none'
						placeholder='Confirm password'
						keyboardType='email-address'
						textContentType='emailAddress'
					/>
				</View>
				<View style={{marginBottom: 6, width: 100}}>
					<Button
						title='Sign Up'
						color='blue'
						onPress={this.register.bind(this)}
					/>
				</View>
				<View style={{width: 100}}>
					<Button
						title='Cancelar'
						color='red'
						onPress={() => this.props.navigation.goBack()}
					/>
				</View>
				{this.getDatePicker()}
			</View>
		);
	}
}

const styles= StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	formContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	form: {
		width: width * 0.8,
	},
	input: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
	},
	inputRight: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
		flex: 1,
		marginRight: 4,
	},
	inputLeft: {
		height: 40,
		borderBottomWidth: 1,
		borderBottomColor: 'blue',
		marginBottom: 5,
		flex: 1,
		marginRight: 4,
	}
});