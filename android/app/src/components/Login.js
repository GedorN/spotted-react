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
import EyeOfThePassword from "./Inputs/EyeOfThePassword";
import AwesomeAlert from 'react-native-awesome-alerts';
const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            user: null,
            password: null,
	        showAttemptFail: false,
	        securePassword: true,
	        showAlert: false,
        };
    }


	showAlert = () => {
		this.setState({
			showAlert: true
		});
	};

	hideAlert = () => {
		this.setState({
			showAlert: false
		});
	};

    toggleSecureEntry = () => {
    	this.setState({ securePassword: !this.state.securePassword });
    }

    doLogin = async () => {
	    let result = await this.props.login({ user: this.state.user, password: this.state.password }).then().catch((e) => {
	    	this.setState({ showAttemptFail: true });
	    });
    }

	anonymousLogin = async () => {
    	const params = {};
    	params.user = 'spotted@utfpr.com';
    	params.password = 'angeca123';
    	await this.props.login(params).then();
		this.setState({ showAlert: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
	                style={{width: 210, height: 258, padding: 0,  zIndex: -1}}
	                source={require('../../../../assets/images/simbol.png')}
                />
	            {
	            	this.state.showAttemptFail ?
			            <Text style={{color: 'red', marginTop: 10}}> *Usuário ou senha incorretos </Text> :
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
                    <EyeOfThePassword
	                    secureTextEntry={this.state.securePassword}
	                    toggleSecureEntry={this.toggleSecureEntry.bind(this)}
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
		                <FatBottomedButton color={theme.primary} text={'Login'} onTap={this.doLogin.bind(this)} />
	                </View>
	                <View>
		                <FatBottomedButton color={theme.primary} text={'Create account'} onTap={() => this.props.navigation.navigate('SignUp', {navigation: this.props.navigation})}/>
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
	            <View style={{position: 'absolute', bottom: 15, width: width, alignItems: 'flex-start'}}>
	                <TouchableOpacity onPress={() => { this.setState({ showAlert: true }) }}>
			            <Text style={{color: theme.primary, textDecorationLine: 'underline', marginLeft: 10}}>Entrar como anônimo</Text>
	                </TouchableOpacity>
	            </View>
	            <AwesomeAlert
		            show={this.state.showAlert}
		            showProgress={false}
		            title="Modo anônimo"
		            message="Usuários anônimos não podem realizar postagens e nem comentários"
		            closeOnTouchOutside={true}
		            closeOnHardwareBackPress={false}
		            showCancelButton={true}
		            showConfirmButton={true}
		            cancelText="Cancelar"
		            confirmText="Continuar"
		            confirmButtonColor={theme.primary}
		            onCancelPressed={() => {
			            this.hideAlert();
		            }}
		            onConfirmPressed={() => {
			            this.anonymousLogin();
		            }}
	            />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    	alignItems: 'center',
        flex: 1,
	    padding: 20
    },
    form: {
        width: width * 0.8,
	    marginTop: 20,
    },
	forgotPassword: {
    	alignSelf: 'flex-end',
		marginBottom: 50,
	}
});


