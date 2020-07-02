import React from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	Dimensions,
	Button,
	Text,
	TouchableOpacity,
	Image, Modal,
} from 'react-native';
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import theme from "../../../../components/General/Theme";
import FatBottomedButton from "./buttons/FatBottomedButton";
import RUMineTextInput from "./Inputs/RUMineTextInput";
import EyeOfThePassword from "./Inputs/EyeOfThePassword";
import AwesomeAlert from 'react-native-awesome-alerts';
import {ActivityIndicator} from "react-native-paper";
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
	        showConfirmCodeModal: false,
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
    	if (!this.state.user || !this.state.password) {
    		return ;
	    }
    	this.setState({ showConfirmCodeModal: true });
	    let result = await this.props.login({ user: this.state.user, password: this.state.password }).then().catch((e) => {
	    	this.setState({ showAttemptFail: true });
		    this.setState({ showConfirmCodeModal: false });
	    });
    }

	anonymousLogin = async () => {
		heimdallr.sendEvent('anonymous_login');
		this.setState({ showAlert: false });
		this.setState({ showConfirmCodeModal: true });
		const params = {};
    	params.user = 'spotted@utfpr.com';
    	params.password = 'angeca123';
    	heimdallr.signIn(params).then((resolve) => {
		    this.setState({ showConfirmCodeModal: true });
		    this.setState({ showAlert: false });
		    const resetAction = StackActions.reset({
			    index: 0,
			    actions: [NavigationActions.navigate({ routeName: 'Home' })],
		    });
		    this.props.navigation.dispatch(resetAction);
	    })
    }

    render() {
        return (
            <View style={styles.container}>
			<View style = {{width:width*0.6}}>
                <Image
	                style={{width: 210, height: 258, padding: 0,  zIndex: -1, alignSelf:'flex-start',borderColor:theme.primary}}
	                source={require('../../../../assets/images/simbol.png')}
                />
			</View>
	            {
	            	this.state.showAttemptFail ?
			            <Text style={{color: 'red', marginTop: 10}}> *Usuário ou senha incorretos </Text> :
			            null
	            }
                <View style={styles.form}>
                    <RUMineTextInput
	                    placeholder='Email'
	                    autoCompleteType='email'
	                    keyboardType='email-address'
	                    textContentType='emailAddress'
	                    borderBottomWidth={1}
	                    onChangeText={text => this.setState({user: text})}
                    />
                    <EyeOfThePassword
	                    secureTextEntry={this.state.securePassword}
	                    toggleSecureEntry={this.toggleSecureEntry.bind(this)}
	                    placeholder='Senha'
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
		                <FatBottomedButton color={'white'} backgroundColor={theme.primary} text={'Entrar'} onTap={this.doLogin.bind(this)} />
	                </View>
	                <View>
		                <FatBottomedButton color={theme.primary} text={'Registrar-se'} onTap={() => this.props.navigation.navigate('SignUp', {navigation: this.props.navigation})}/>
	                </View>
                </View>
	            <View style={{position: 'absolute', top: height * 0.85, width: width, alignItems: 'flex-start'}}>
	                <TouchableOpacity onPress={() => { this.setState({ showAlert: true }) }}>
			            <Text style={{color: theme.primary, textDecorationLine: 'underline', marginLeft: 10}}>Entrar como anônimo</Text>
	                </TouchableOpacity>
	            </View>
	            <AwesomeAlert
		            show={this.state.showAlert}
		            showProgress={false}
		            style={{position: 'absolute'}}
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
	            <Modal
		            statusBarTranslucent={true}
		            hardwareAccelerated={true}
		            animationType='fade'
		            transparent={true}
		            visible={this.state.showConfirmCodeModal}
		            style={{height: 50}}
	            >
		            <View style={styles.centeredView}>
			            <View style={styles.modalContainer}>
				            <ActivityIndicator animating={true} color={theme.primary} size={'large'}/>
				            <Text style={{marginTop: 5}}>Perguntando ao nosso servidor se você pode entrar...</Text>
			            </View>
		            </View>
	            </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    	alignItems: 'center',
        flex: 1,
		padding: 20,
		paddingTop:theme.height * 0.05
    },
	modalContainer: {
		// height: 150,
		width: 300,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingTop: theme.height * 0.1,
		marginTop: -(theme.height * 0.1),
	},
	textTitle: {
		fontSize: 16,
		fontWeight: 'bold',
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


