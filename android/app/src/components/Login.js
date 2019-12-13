import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    Button,
    Text,
	TouchableOpacity,
} from 'react-native';
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
const width = Dimensions.get('screen').width;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            user: null,
            password: null,
        };
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Spotted
                </Text>
                <View style={styles.form}>
                    <TextInput
                        autoCapitalize='none'
                        style={styles.input}
                        placeholder='User...'
                        autoCompleteType='email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        onChangeText={text => this.setState({user: text})}
                    />
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder='Password...'
                        autoCompleteType='password'
                        textContentType='password'
                        onChangeText={text => this.setState({password: text})}
                    />
                    <TouchableOpacity style={styles.forgotPassword}>
	                    <Text style={{color: '#0645AD'}}>
		                    Esqueci minha senha
	                    </Text>
                    </TouchableOpacity>
                    <Button
                        style={styles.loginButton}
                        title='Login'
                        onPress={() => this.props.login({ user: this.state.user, password: this.state.password })}
                    />
                    <View style={{marginTop: 20}}>
		                <Button
			                style={styles.signUpButtom}
			                title='Registrar-se'
			                onPress={() => this.props.navigation.navigate('SignUp')}
		                />
                    </View>
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
    form: {
        width: width * 0.8,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        marginBottom: 5,
    },
    loginButton: {
        marginTop: 20,
	    marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 26,
    },
	signUpButtom: {
		marginTop: 60,
	},
	forgotPassword: {
    	alignSelf: 'flex-end',
		marginBottom: 50,
	}
});


