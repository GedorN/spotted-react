import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    Button,
    Text,
	TouchableOpacity,
	Image,
} from 'react-native';
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import FatBottomedButton from "./buttons/FatBottomedButton";
import RUMineTextInput from "./Inputs/RUMineTextInput";
const width = Dimensions.get('screen').width;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            user: null,
            password: null,
	        showAttemptFail: false,
        };
    }

    doLogin = () => {
	    let result = this.props.login({ user: this.state.user, password: this.state.password });
	    if (!result) {
	    	this.setState({ showAttemptFail: true });
	    	console.warn('caca: ', { user: this.state.user, password: this.state.password });
	    }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
	                style={{width: 300, height: 250, padding: 0}}
	                source={require('../../../../assets/images/logo-full.jpg')}
                />
	            {
	            	this.state.showAttemptFail ?
			            <Text style={{color: 'red'}}> *Login or password incorrect  </Text> :
			            null
	            }
                <View style={styles.form}>
                    <RUMineTextInput
	                    placeholder='User...'
	                    autoCompleteType='email'
	                    keyboardType='email-address'
	                    textContentType='emailAddress'
	                    onChangeText={text => this.setState({user: text})}
                    />
                    <RUMineTextInput
	                    secureTextEntry={true}
	                    placeholder='Password...'
	                    autoCompleteType='password'
	                    textContentType='password'
	                    onChangeText={text => this.setState({password: text})}
                    />
                    <TouchableOpacity style={styles.forgotPassword} onPress={() => this.props.navigation.navigate('PasswordRestore')}>
	                    <Text style={{color: theme.primary, textDecorationLine: 'underline'}}>
		                    Esqueci minha senha
	                    </Text>
                    </TouchableOpacity>
	                <View style={{marginBottom: 10}}>
		                <FatBottomedButton text={'Login'} onTap={this.doLogin.bind(this)} />
	                </View>
	                <View>
		                <FatBottomedButton text={'Create account'} />
	                </View>
                    {/*<Button*/}
                    {/*    style={styles.loginButton}*/}
                    {/*    title='Login'*/}
                    {/*    onPress={() => this.props.login({ user: this.state.user, password: this.state.password })}*/}
                    {/*/>*/}
                    {/*<View style={{marginTop: 20}}>*/}
		            {/*    <Button*/}
			        {/*        style={styles.signUpButtom}*/}
			        {/*        title='Registrar-se'*/}
			        {/*        onPress={() => this.props.navigation.navigate('SignUp')}*/}
		            {/*    />*/}
                    {/*</View>*/}
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
	forgotPassword: {
    	alignSelf: 'flex-end',
		marginBottom: 50,
	}
});


