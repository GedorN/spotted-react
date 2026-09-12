import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity, Switch
} from "react-native";
import theme from "../../components/General/Theme";
import FatBottomedButton from "../buttons/FatBottomedButton";
import heimdallr from "../../components/Heimdallr/Heimdallr";
import {Slider} from '@miblanchard/react-native-slider';
import {NavigationActions, StackActions} from "react-navigation";

export default class PortalSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            acceptClassNotification: heimdallr.accepting_class_notification,
            customClassNotificationTime: heimdallr.customClassNotificationTime,
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

  renderTrackMarkComponent = () => {
      return (
       <Text>{this.state.customClassNotificationTime}</Text>
      )
  }

  setCustomClassNotificationTime = (newTime) => {
      heimdallr.setCustomClassNotificationTime(newTime[0])
      this.setState({customClassNotificationTime: newTime[0]})
  }

    render() {
        return (
            <View style={styles.container}>
                <View style={{}}>
                    <TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
                        <View style={{flexDirection: 'row', marginTop: 7,width:theme.width * 0.2,height:theme.height * 0.04}}>
                            <Image
                                style={{width: 30, height: 30, marginTop:4, opacity: 0.6}}
                                source={require('../../../assets/images/chevron-circle-left-solid-white.png')}
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
                        {
                          this.state.acceptClassNotification &&
                          <View style={{ marginTop: 16 }}>
                            <Text style={styles.activeText }>Quantos minutos antes da aula gostaria de receber a notificação?</Text>
                            <View style={{ marginTop: 25 }}>
                              <Slider
                                value={this.state.customClassNotificationTime}
                                onValueChange={this.setCustomClassNotificationTime}
                                animateTransitions
                                maximumValue={49}
                                minimumValue={1}
                                thumbStyle={styles.thumb}
                                trackStyle={styles.track}
                                thumbTintColor={'red'}
                                minimumTrackTintColor={theme.UTFPRPrimary}
                                trackClickable={true}
                                step={1}
                                trackMarks={[0,1 ,5]}
                                renderAboveThumbComponent={this.renderTrackMarkComponent.bind(this) }
                              />
                            </View>
                          </View>
                        }
                    </View>
                </View>

                <View style={{}}>
                    <View style={{padding: 5}}>
                        <FatBottomedButton text='Salvar' backgroundColor={theme.UTFPRPrimary} color={'white'} borderColor={theme.UTFPRPrimary}  onTap={() => {this.props.navigation.goBack()}} />
                        <View style={{ marginTop: 10, paddingHorizontal: 10,  alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={this.disconnectUserFromPortal.bind(this)}>
                                <Text style={{color: theme.primary}}>
                                    Desconectar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 30,
        height: theme.height * 0.87,
        justifyContent: 'space-between',
    },
   activeText: {
      color: 'black',
     fontWeight: 'bold'
   },
  inactiveText: {
      color: 'rgba(0, 0, 0, 0.5)'
  },
  thumb: {
    backgroundColor: theme.UTFPRPrimary,
    borderColor: '#000000',
    borderRadius: 100,
    borderWidth: 6,
    height: 22,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    width: 22,
  },
  track: {
    backgroundColor: '#d0d0d0',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    height: 10,
  },
})
