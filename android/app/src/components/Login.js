import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    Button,
    Text,
} from 'react-native';

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
                        onChangeText={text => this.setState({user: text})}
                    />
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder='Password...'
                        onChangeText={text => this.setState({password: text})}
                    />
                    <Button
                        style={styles.loginButton}
                        title='Login'
                        onPress={() => console.warn('Login')}
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
    },
    title: {
        fontWeight: 'bold',
        fontSize: 26,
    }
});


