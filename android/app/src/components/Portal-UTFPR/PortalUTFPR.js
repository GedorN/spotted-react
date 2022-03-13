import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	Image
} from 'react-native';

import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import UserInfoCard from "./components/UserInfoCard";
import theme from "../../../../../components/General/Theme";
import MenuOptionCard from "./components/MenuOptionCard";
import SkeletonPlaceholder from "react-native-skeleton-placeholder/lib/SkeletonPlaceholder";
import FlashMessage from "react-native-flash-message";
import NextClassCard from "./components/NextClassCard";
import schedule from "../../../../../components/Heimdallr/UTFPRSchedule"

export default class PortalUTFPR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticationVerified: false,
			userImage: '',
			courseData: null,
            nextClass: null,
		}
	}


	async componentDidMount(): void {
		StatusBar.setBackgroundColor('#F6C500');
		StatusBar.setBarStyle('dark-content');
		heimdallr.sendEvent("portal_UTFPR_access");


		if (!heimdallr.UTFPRToken) {
			this.props.navigation.replace('LoginPortal');
		} else {
			this.getStudentPhoto();
			this.getStudentInfo();

		}
	}

	getStudentInfo = () => {
		return new Promise(() => {
			heimdallr.getStudentInfo().then(
				(resolve) => {
                    heimdallr.getClassSchedule().then(
                        async (resolve) => {
                            let time = new Date(await heimdallr.getServerTime());
                            let date_with_tolerance = time
                            date_with_tolerance.setMinutes(date_with_tolerance.getMinutes() - 15)
                            let today = time.getDay() + 1
                            // Pega todas as aulas no dia
                            let todayClass = resolve.filter((aula) => (aula.horarios.filter((horario) => horario.horaDescrVc[0] == today).length > 0))
                            // Vê quais horários ainda estão disponíveis
                            let todaySchedule = schedule.filter((h) => parseInt(h.begin.substring(0,2)) > parseInt(date_with_tolerance.getHours()) || (parseInt(h.begin.substring(0,2)) === parseInt(date_with_tolerance.getHours()) && parseInt(h.begin.substring(3, 6)) >= parseInt(date_with_tolerance.getMinutes())))
                            let schedules = Object.keys(todaySchedule)
                            let nextClass = []
                            for (let i = 0; i < schedules.length; i++) {
                                nextClass = todayClass.filter((clss) => (clss.horarios.filter((h) => h.horaDescrVc === `${today}${todaySchedule[i].name}` )).length > 0)
                                if (nextClass.length > 0) {
                                    nextClass = nextClass[0]
                                    nextClass.schedule = `${today}${todaySchedule[i].name}`
                                    nextClass.begin = schedule.filter((s) =>  nextClass.schedule.includes(s.name) )[0].begin
                                    this.setState({ nextClass: nextClass })
                                    break;
                                }
                            }
                        },
                        () => {

                        }
                    )
					heimdallr.getUserCourseData().then(
						() => {

						},
						() => {
							heimdallr.processCourseData();
						}
					);


					this.setState({ courseData: resolve, authenticationVerified: true });
				},
				(error) => {
					if (error && error.message) {
						this.props.navigation.replace('LoginPortal', {error: error.message});
					} else {
						if (!heimdallr.UTFPRPortalLogin) {
							this.props.navigation.replace('LoginPortal');
						} else {
							heimdallr.renewStudentAuthentication().then(
								() => {
									this.getStudentInfo();
								},
								() => {
									this.setState({ authenticationVerified: true});
									this.props.navigation.replace('LoginPortal');

								}
							)
						};
					}

				}
			)
		})
	}

	goToSettings() {
        this.props.navigation.navigate('PortalSettings');
    }

    disconnectUserFromPortal = () => {
        heimdallr.deleteUTFPRToken()
        this.props.navigation.replace('LoginPortal');
    }


	getStudentPhoto = () => {
		return new Promise(() => {
			heimdallr.getPortalPhoto().then(
				(resolve) => {
					this.setState({ userImage: `data:image/png;base64,${resolve}`, authenticationVerified: true });
				},
				() => {
					if (!heimdallr.UTFPRPortalLogin) {
						this.props.navigation.replace('LoginPortal');
					} else {
						heimdallr.renewStudentAuthentication().then(
							() => {
								this.getStudentPhoto();
							},
							() => {
								this.setState({ authenticationVerified: true});
								this.props.navigation.replace('LoginPortal');

							}
						)
					}
				}
			);
		})
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.backColor}></View>
				<View style = {{alignSelf:'flex-start'}}>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{flexDirection: 'row', marginTop: 2,  paddingLeft: 15, width:theme.width * 0.2,height:theme.height * 0.04}}>
							<Image
								style={{ width: 30, height: 30, opacity: 0.6, position: 'absolute', marginLeft: 8, marginTop: 8}}
								source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
				</View>
				{
					this.state.authenticationVerified ?
					<View>
						<View style={{ marginTop: 25 }}>
							<UserInfoCard navigation={this.props.navigation} userImage={ this.state.userImage } courseData={ this.state.courseData } goToSettings={this.goToSettings.bind(this)} />
						</View>
						<View style={styles.body}>
                            {
                                this.state.nextClass &&
                                <NextClassCard aula={this.state.nextClass}/>
                            }
							<View style={styles.bodyLine}>
                                <MenuOptionCard icon={require('../../../../../assets/images/PORTAL-UTFPR/clock.png')} title='Horários Aulas' route='Schedule' navigation={this.props.navigation}/>
								<MenuOptionCard iconPaisagem icon={require('../../../../../assets/images/PORTAL-UTFPR/star.png')} title='Boletim' route='ReportCard' navigation={this.props.navigation} />
							</View>
							<View style={styles.bodyLine}>
                                <MenuOptionCard icon={require('../../../../../assets/images/PORTAL-UTFPR/history.png')} title='Histórico Acadêmico' route='StudentHistory' navigation={this.props.navigation} />
								<MenuOptionCard width={65} iconPaisagem icon={require('../../../../../assets/images/PORTAL-UTFPR/graduation-cap.png')} title='Curso' route='CourseInfo' navigation={this.props.navigation}/>
							</View>
							<View style={styles.bodyLine}>
                                <MenuOptionCard width={50} height={55} iconRetrato icon={require('../../../../../assets/images/PORTAL-UTFPR/utensils.png')} title='Cardápio RU' disabled />
								<MenuOptionCard width={65} height={55} icon={require('../../../../../assets/images/PORTAL-UTFPR/newspaper.png')} title='Notícias' disabled />
							</View>
						</View>
					</View>
						:
					<SkeletonPlaceholder>
						<SkeletonPlaceholder.Item width={ theme.width * 0.9 } height={ theme.height * 0.32 } alignSelf="center" borderRadius={20}  marginTop={20}>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder style={{ marginTop: 25, padding: 30, justifyContent: 'space-between', flexDirection: 'row'}}>
							<SkeletonPlaceholder.Item width={ theme.width * 0.33 } height={ theme.height * 0.23 } borderRadius={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.33 } height={ theme.height * 0.23 } borderRadius={20}>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
						<SkeletonPlaceholder style={{ marginTop: 25, padding: 30, justifyContent: 'space-between', flexDirection: 'row'}}>
							<SkeletonPlaceholder.Item width={ theme.width * 0.33 } height={ theme.height * 0.23 } borderRadius={20}>
							</SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item width={ theme.width * 0.33 } height={ theme.height * 0.23 } borderRadius={20}>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
						<SkeletonPlaceholder style={{ marginTop: 25, padding: 30, justifyContent: 'space-between', flexDirection: 'row'}}>
							<SkeletonPlaceholder.Item width={ theme.width * 0.33 } height={ theme.height * 0.23 } borderRadius={20}>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
					</SkeletonPlaceholder>
				}
				<FlashMessage ref={'message'} style={{ zIndex: 99 }} />
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	backColor: {
		width: theme.width,
		height: theme.height * 0.22,
		position: 'absolute',
		backgroundColor: '#F6C500'
	},
	body: {
		padding: 20,
		paddingHorizontal: 40,
	},
	bodyLine: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20
	}
})
