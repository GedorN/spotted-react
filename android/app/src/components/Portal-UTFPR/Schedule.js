import React from 'react';
import {
    View,
    StyleSheet,
    Text, TouchableOpacity, Image
} from "react-native";

import theme from "../../../../../components/General/Theme";
import TextChip from "./components/TextChip";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import schedule from "../../../../../components/Heimdallr/UTFPRSchedule";


export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDay: 2,
        }
    }

    async componentDidMount() {
        heimdallr.getClassSchedule().then(
            async (resolve) => {
                let time = new Date(await heimdallr.getServerTime());
                let today = time.getDay() + 1
                // Pega todas as aulas no dia
                let todayClass = resolve.filter((aula) => (aula.horarios.filter((horario) => horario.horaDescrVc[0] == today).length > 0))

                this.setState({ weekDay: today })
                console.log("aulas hoje ", JSON.stringify(todayClass))
            },
            () => {

            }
        )
    }

    changeWeekDay(day){
        console.log("Dia: ", day)
        this.setState({ weekDay: day })
    }



    render() {
        return (
            <View style={styles.container}>
                <View style = { styles.header }>
                    <TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
                        <View style={{ flexDirection: 'row', width: theme.width * 0.2, height:theme.height * 0.04 }}>
                            <Image
                                style={ styles.arrowImage }
                                source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style = { styles.headerText }>Horário de Aulas</Text>
                </View>
                <View>
                    <View style={{ flexDirection: "row", justifyContent: 'space-evenly', alignItems: 'center', }}>
                        <TextChip color={theme.UTFPRPrimary} text={'SEG'} data={2} active={2 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 2)}/>
                        <TextChip color={theme.UTFPRPrimary} text={'TER'} data={3} active={3 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 3)}/>
                        <TextChip color={theme.UTFPRPrimary} text={'QUA'} data={4} active={4 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 4)}/>
                        <TextChip color={theme.UTFPRPrimary} text={'QUI'} data={5} active={5 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 5)}/>
                        <TextChip color={theme.UTFPRPrimary} text={'SEX'} data={6} active={6 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 6)}/>
                        <TextChip color={theme.UTFPRPrimary} text={'SAB'} data={7} active={7 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 7)}/>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        height: theme.height * 0.9,
        flex: 1
    },
    header: {
        backgroundColor: '#F6C500',
        paddingTop: 2,
        paddingBottom: 10,
        marginBottom: 6,
    },
    headerText: {
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    arrowImage: {
        width: 30,
        height: 30,
        opacity: 0.6,
        position: 'absolute',
        marginLeft: 8,
        marginTop: 8
    }
})
