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
const height = Dimensions.get('screen').height;

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
	                style={{width: width, height: height, padding: 0, position: 'absolute', zIndex: -1, opacity: 0.7}}
	                source={require('../../../../assets/images/simbol.png')}
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
		                <FatBottomedButton backgroundColor={theme.primary} color={'white'} text={'Login'} onTap={this.doLogin.bind(this)} />
	                </View>
	                <View>
		                <FatBottomedButton backgroundColor={theme.primary} color={'white'} text={'Create account'} onTap={() => this.props.navigation.navigate('SignUp', {navigation: this.props.navigation})}/>
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


