import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";

import theme from "../../components/General/Theme";
import TextChip from "./components/TextChip";
import heimdallr from "../../components/Heimdallr/Heimdallr";
import schedule from "../../components/Heimdallr/UTFPRSchedule";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ClassCad from "./components/ClassCard";

var sun = require('../../../assets/images/PORTAL-UTFPR/sun-solid.png')
var cloud_sun = require('../../../assets/images/PORTAL-UTFPR/cloud-sun-solid.png')
var moon = require('../../../assets/images/PORTAL-UTFPR/moon-solid.png')

export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDay: 2,
            allClasses: [],
            classes: [],
            loaded: false,
            offlineServer: false,
        }
    }

    async componentDidMount() {
        heimdallr.getClassSchedule().then(
            async (resolve) => {
                let time = new Date(await heimdallr.getServerTime());
                if (resolve.length === 0) {
                    this.setState({ offlineServer: true })
                } else {
                    this.state.allClasses = resolve
                    let today = time.getDay() + 1
                    this.changeClasses(today)
                }

            },
            () => {

            }
        )
    }

    changeClasses(weekDay) {
        // Pega todas as aulas no dia
        let schedules_cod = schedule.map((i) => i.name)
        let aux = this.state.allClasses.map((i) => {
            return {...i}
        });
        // for (let i = 0 ; i < this.state.allClasses.length; i++) {
        //     aux.push({...this.state.allClasses[i]})
        // }
        let todayClass = aux.filter((aula) => {
            aula.inicio = -1
            aula.fim = -1
            aula.horarios = aula.horarios.filter((horario) => {
                if (horario.horaDescrVc[0] == weekDay) {
                    if (aula.inicio < 0 ||  schedules_cod.indexOf(horario.horaDescrVc.substring(1, 3)) < aula.inicio) {
                        aula.inicio = schedules_cod.indexOf(horario.horaDescrVc.substring(1, 3))
                    }
                    if (aula.fim < 0 || schedules_cod.indexOf(horario.horaDescrVc.substring(1, 3)) > aula.fim) {
                        aula.fim = schedules_cod.indexOf(horario.horaDescrVc.substring(1, 3))
                    }

                    return 1
                } else {
                    return 0
                }
            });

            if (aula.inicio >= 0 && aula.inicio < 5) {
                aula.icon = { icone: sun, altura: 30, largura: 30, cor: '#F6C500' }
            } else if (aula.inicio >= 5 && aula.inicio < 11) {
                aula.icon = { icone: cloud_sun, altura: 20, largura: 30, cor: '#DC8B00' }
            } else if (aula.inicio >= 11 ) {
                aula.icon = { icone: moon, altura: 30, largura: 30, cor: '#7B7878' }
            }

            return (aula.horarios).length > 0
        })
        todayClass.sort((a, b) => schedules_cod.indexOf(a.horarios[0].horaDescrVc.substring(1, 3)) - schedules_cod.indexOf(b.horarios[0].horaDescrVc.substring(1, 3)) );
        this.setState({ weekDay: weekDay, loaded: true, classes: todayClass })
    }

    changeWeekDay(day){
        this.setState({ loaded: false })
        this.changeClasses(day)
    }



    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.offlineServer ?
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, padding: 10 }}>
                            <Image
                                style={{width: 250, height: 200}}
                                source={require('../../../assets/images/PORTAL-UTFPR/no-data.png')}
                            />
                            <Text>Infelizmente não conseguimos contato com o servidor da UTFPR</Text>
                        </View>
                        :
                        <View>
                            <View style = { styles.header }>
                                <TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
                                    <View style={{ flexDirection: 'row', width: theme.width * 0.2, height:theme.height * 0.04 }}>
                                        <Image
                                            style={ styles.arrowImage }
                                            source={require('../../../assets/images/chevron-circle-left-solid-white.png')}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text style = { styles.headerText }>Horário de Aulas</Text>
                            </View>
                            <View>

                                <View style={{ flexDirection: "row", justifyContent: 'space-evenly', alignItems: 'center', padding: 5 }}>
                                    <TextChip color={theme.UTFPRPrimary} text={'SEG'} data={2} active={2 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 2)}/>
                                    <TextChip color={theme.UTFPRPrimary} text={'TER'} data={3} active={3 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 3)}/>
                                    <TextChip color={theme.UTFPRPrimary} text={'QUA'} data={4} active={4 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 4)}/>
                                    <TextChip color={theme.UTFPRPrimary} text={'QUI'} data={5} active={5 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 5)}/>
                                    <TextChip color={theme.UTFPRPrimary} text={'SEX'} data={6} active={6 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 6)}/>
                                    <TextChip color={theme.UTFPRPrimary} text={'SAB'} data={7} active={7 == this.state.weekDay} onClick={this.changeWeekDay.bind(this, 7)}/>
                                </View>
                                <View style={{ minHeight: theme.height * 0.78, maxHeight: theme.height * 0.78, flex: 1}}>
                                    {
                                        this.state.loaded ?
                                            <ScrollView style={{ flex: 1}}>
                                                <View style={{ marginTop: 25, padding: 5, justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 50, flex: 1 }}>
                                                    {
                                                        this.state.classes.length > 0 ?
                                                            this.state.classes.map(i =>
                                                                <View style={{ flex: 1, marginTop: 10 }} key={i.discCodVelhorVc}>
                                                                    <ClassCad
                                                                        className={i.discNomeVc}
                                                                        professor={i.professores[0].pessNomeVc}
                                                                        sala={i.horarios[0].ambienteNomeVc}
                                                                        inicio={schedule[i.inicio].begin}
                                                                        fim={schedule[i.fim].end}
                                                                        icon={i.icon}
                                                                    />
                                                                </View>

                                                            ) :
                                                            <View>
                                                                <Text>Sem aulas hoje</Text>
                                                            </View>
                                                    }
                                                </View>
                                            </ScrollView>
                                            :
                                            <SkeletonPlaceholder>
                                                <SkeletonPlaceholder style={{ marginTop: 25, justifyContent: 'space-evenly', alignItems: 'center'}}>
                                                    <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.23 } borderRadius={20}>
                                                    </SkeletonPlaceholder.Item>
                                                    <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.23 } borderRadius={20} marginTop={10}>
                                                    </SkeletonPlaceholder.Item>
                                                    <SkeletonPlaceholder.Item width={ theme.width * 0.93 } height={ theme.height * 0.23 } borderRadius={20} marginTop={10}>
                                                    </SkeletonPlaceholder.Item>
                                                </SkeletonPlaceholder>
                                            </SkeletonPlaceholder>

                                    }
                                </View>
                            </View>
                        </View>
                }

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
