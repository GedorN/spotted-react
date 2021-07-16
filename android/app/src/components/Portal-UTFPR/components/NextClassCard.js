import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image
} from 'react-native'

import theme from "../../../../../../components/General/Theme";

export default class NextClassCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        console.log("Minhas props: ", this.props.aula.begin)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.border} />
                <View style={{flex: 1, flexDirection: 'row', padding: 2}}>
                    <View style={{flex: 1}}>
                        <Text style={styles.cardTitle}>Próxima aula</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.botComponent}>
                                <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>{this.props.aula.discNomeVc} - </Text>
                                <Text style={{ color: 'rgba(0, 0, 0, 0.4)',  fontSize: 12, flexWrap: 'wrap' }}>{this.props.aula.professores[0].pessNomeVc}</Text>
                                <View>
                                    <Text style={{ fontSize: 12 }}>{this.props.aula.horarios.filter((h) => h.horaDescrVc === this.props.aula.schedule)[0].ambienteNomeVc}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 2}}>
                        <Image
                            source={require('../../../../../../assets/images/PORTAL-UTFPR/clock.png')}
                            style={{
                                width:  20,
                                height: 20,
                                opacity: 0.5,
                            }}
                        />
                        <Text style={{ marginLeft: 1 }}>{this.props.aula.begin}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: theme.width * 0.9,
        height: theme.height * 0.13,
        borderRadius: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 4,
    },
    border: {
        position: 'absolute',
        width: theme.width * 0.1,
        height: theme.height * 0.13,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        alignSelf: 'flex-start',
        backgroundColor: '#F6C500',
    },
    cardTitle: {
        alignSelf: 'center',
        color: 'rgba(0, 0, 0, 0.4)',
        marginLeft: 30
    },
    botComponent: {
        marginLeft: theme.width * 0.11,
        flex: 1,
        padding: 1
    }
})
