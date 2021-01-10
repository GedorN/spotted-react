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
            showingHistory: false,
            spin: this.spinValue.interpolate({
	            inputRange: [0, 1],
	            outputRange: ['0deg', '-180deg']
            }),
			cardHeight: new Animated.Value(0)

		}
    }

    showHistory = () => {
		Animated.timing(
			this.spinValue,
			{
				toValue: !this.state.showingHistory ? 1 : 0,
				duration: 200,
				easing: Easing.linear, // Easing is an additional import from react-native
				useNativeDriver: true  // To make use of native driver for performance
			}
		).start();

		if (!this.state.showingHistory) {
			Animated.timing(this.state.cardHeight, {
				toValue: theme.height * 0.21 ,
				duration: 200,
				useNativeDriver: false
			}).start(
				() => {
					this.setState({showingHistory: !this.state.showingHistory });
				}
			);
		} else {
			this.setState({showingHistory: !this.state.showingHistory });
			Animated.timing(this.state.cardHeight, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false
			}).start();
		}

	}

	render() {
        return (
            <TouchableOpacity style={ styles.container } onPress={ this.showHistory.bind(this) } activeOpacity = { 0.75 }>
                <View style = {{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style = {{ width: theme.width * 0.8 }}>
                        <Text style = { styles.title }>{ this.props.subject.discNomeVc }</Text>
                        <Text style = {{ paddingLeft: 20, fontSize: 12 }}>{ this.props.subject.siHiDescrVc }</Text>
                    </View>
                    <View style={styles.arrowImage}>
                        <Animated.Image
                            style={{ width: 20, height: 30, transform: [{ rotate: this.state.spin }] }}
                            source={ require('../../../../../../assets/images/sort-down-solid.png') }
                        />
                    </View>
                </View>
                <Animated.View style = {{ flexDirection: 'row', height: this.state.cardHeight }}>
                    {
                        this.state.showingHistory &&
                        <View style={{ marginTop: 10, paddingLeft: 40 }}>
                            <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={{ width: 12, height: 11, opacity: 0.5 }}
                                    source={ require('../../../../../../assets/images/PORTAL-UTFPR/star.png') }
                                />
	                            <Text style = { styles.subjectData }>{ 'Média final: ' + this.props.subject.histnotanr }</Text>
                            </View>
	                        <View style = {{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
		                        <Image
	                                    style={{ width: 10, height: 10, opacity: 0.5 }}
	                                    source={ require('../../../../../../assets/images/PORTAL-UTFPR/chart.png') }
		                        />
		                        <Text style = { styles.subjectData }>{ 'Frequência: ' + this.props.subject.histfreqnr + '%'}</Text>
	                        </View>
	                        <View style = {{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
		                        <Image
			                        style={{ width: 10, height: 12, opacity: 0.5 }}
			                        source={ require('../../../../../../assets/images/PORTAL-UTFPR/calendar.png') }
		                        />
		                        <Text style = { styles.subjectData }>{ 'Ano: ' + this.props.subject.histanonr + ' - ' + this.props.subject.histperanonr }</Text>
	                        </View>
	                        <View style = {{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
		                        <Image
			                        style={{ width: 10, height: 10, opacity: 0.5 }}
			                        source={ require('../../../../../../assets/images/PORTAL-UTFPR/graduation-cap.png') }
		                        />
		                        <Text style = { styles.subjectData }>{ 'Código da disciplina: ' + this.props.subject.discCodVelhoVc + ' / ' + this.props.subject.turmCodVc }</Text>
	                        </View>
	                        <View style = {{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
		                        <Image
			                        style={{ width: 13, height: 10, opacity: 0.5 }}
			                        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fusers-solid.png?alt=media&token=f0a5c738-772f-47e2-9451-cebb3e7184f1' }}
		                        />
		                        <Text style = { styles.subjectData }>{ 'Média da turma: ' + this.props.subject.mediaNotaTurma }</Text>
	                        </View>
                        </View>
                    }
                </Animated.View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: '#DCDCDC',
        borderWidth: 0.5
    },
    title: {
        fontWeight: 'bold',
        paddingLeft: 20,
        marginBottom: 10
    },
    arrowImage: {
        width:20 ,
        height: 30,
        marginTop: -10,
        alignItems: 'flex-end'
    },
    subjectData: {
        fontSize: 12,
	    marginLeft: 4,
    }
})
