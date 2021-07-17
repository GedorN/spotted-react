import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity, Switch
} from "react-native";
import theme from "../../../../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import {NavigationActions, StackActions} from "react-navigation";

export default class PortalSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            acceptClassNotification: heimdallr.accepting_class_notification
        }
    }

    componentDidMount() {
    }
    toggleSwitch = () => {
        let acceptance = this.state.acceptClassNotification
        this.setState({ acceptClassNotification: !acceptance });
        heimdallr.setClassNotificationAcceptance(!acceptance)
    }

    disconnectUserFromPortal = () => {
        heimdallr.deleteUTFPRToken()
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{}}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
                        <View style={{flexDirection: 'row', marginTop: 7,width:theme.width * 0.2,height:theme.height * 0.04}}>
                            <Image
                                style={{width: 30, height: 30, marginTop:4, opacity: 0.6}}
                                source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{marginTop: 20}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
                            <Text style={{fontWeight: 'bold'}}>Receber notificação de aulas</Text>
                            <Switch
                                thumbColor={this.state.acceptClassNotification ? theme.UTFPRPrimary : "#a7a5a5"}
                                onValueChange={this.toggleSwitch.bind(this)}
                                value={this.state.acceptClassNotification}
                            />
                        </View>
                    </View>
                </View>

                <View style={{}}>
                    <View style={{padding: 5}}>
                        <FatBottomedButton text='Voltar' backgroundColor={theme.UTFPRPrimary} color={'white'} borderColor={theme.UTFPRPrimary}  onTap={() => {this.props.navigation.goBack()}} />
                    </View>
                    <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={this.disconnectUserFromPortal.bind(this)}>
                            <Text style={{color: theme.primary}}>
                                Desconectar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height: theme.height * 0.87,
        justifyContent: 'space-between',
    }
})
