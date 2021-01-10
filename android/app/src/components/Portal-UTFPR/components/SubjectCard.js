import React from 'react';

import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
    Image,
    Animated,
    Easing,
} from 'react-native';

import theme from "../../../../../../components/General/Theme";

export default class SubjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.spinValue = new Animated.Value(0);
		this.state = {
            showHistory: false,
            spin: this.spinValue.interpolate({
	            inputRange: [0, 1],
	            outputRange: ['0deg', '-180deg']
            }),

		}
    }

    componentDidMount = () => {
    }

    showHistory = (item) => {
		Animated.timing(
			this.spinValue,
			{
				toValue: !this.state.showHistory ? 1 : 0,
				duration: 200,
				easing: Easing.linear, // Easing is an additional import from react-native
				useNativeDriver: true  // To make use of native driver for performance
			}
		).start();
		this.setState({showHistory: !this.state.showHistory });

	}

	render() {
        return (
            <View>
	            {

	            }
                <View style = {{ paddingTop: 20, paddingBottom: 20, borderColor: '#DCDCDC', borderWidth: 0.5 }} >
                    <TouchableOpacity onPress={this.showHistory.bind(this)} activeOpacity={0.75}>
                        <View style = {{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <View style = {{ width: theme.width * 0.8 /* ,borderWidth: 1, borderColor: '#DCDCDC' */ }}>
                                <Text style = {{ fontWeight: 'bold', paddingLeft: 20 , marginBottom: 10 }}>{this.props.subject.discNomeVc}</Text>
                                <Text style = {{paddingLeft: 20, fontSize: 12 }}>{this.props.subject.siHiDescrVc}</Text>
                            </View>
                            <View style={{width:20 , height: 30, marginTop: -10, alignItems: 'flex-end'/* , borderWidth: 1, borderColor: '#DCDCDC' */  }}>
                                <Animated.Image
                                    style={{ width: 20, height: 30, transform: [{ rotate: this.state.spin }] }}
                                    source={require('../../../../../../assets/images/sort-down-solid.png')}
                                />
                            </View>
                        </View>
                        {
                            this.state.showHistory &&
                            <View style = {{ flexDirection: 'row', alignSelf :'center'}}>
                            <View style = {{width: theme.width * 0.05, opacity: 0.5}}>
                                <Image
                                    style={{ width: 12, height: 11, marginTop: 15}}
                                    source={require('../../../../../../assets/images/PORTAL-UTFPR/star.png')} />
                                <Image
                                    style={{ width: 10, height: 10, marginTop: 18}}
                                    source={require('../../../../../../assets/images/PORTAL-UTFPR/chart.png')} />
                                <Image
                                    style={{ width: 10, height: 12, marginTop: 17}}
                                    source={require('../../../../../../assets/images/PORTAL-UTFPR/calendar.png')} />
                                <Image
                                    style={{ width: 10, height: 10, marginTop: 18}}
                                    source={require('../../../../../../assets/images/PORTAL-UTFPR/graduation-cap.png')} />
                                <Image
                                    style={{ width: 13, height: 10, marginTop: 17}}
                                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fusers-solid.png?alt=media&token=f0a5c738-772f-47e2-9451-cebb3e7184f1'}} />

                            </View>
                            <View style = {{ /* borderColor: '#000000', borderWidth: 1, */ width: theme.width * 0.7, alignSelf: 'center'}}>
                                <Text style = {{fontSize: 12, marginTop: 10}}>{'Média final: ' + this.props.subject.histnotanr}</Text>
                                <Text style = {{fontSize: 12,  marginTop: 10}}>{'Frequência: ' + this.props.subject.histfreqnr}</Text>
                                <Text style = {{fontSize: 12,  marginTop: 10}}>{'Ano: ' + this.props.subject.histanonr + ' - ' + this.props.subject.histperanonr}</Text>
                                <Text style = {{fontSize: 12,  marginTop: 10}}>{'Código da disciplina: ' + this.props.subject.discCodVelhoVc + ' / ' + this.props.subject.turmCodVc}</Text>
                                <Text style = {{fontSize: 12,  marginTop: 10}}>{'Média da turma: ' + this.props.subject.mediaNotaTurma}</Text>
                            </View>
                        </View>
                        }

                    </TouchableOpacity>
                </View>
        </View>
        )
    }
}
