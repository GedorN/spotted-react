import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	Image
} from 'react-native';

import {ProgressBar} from "react-native-paper";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import UserInfoCard from "./components/UserInfoCard";
import theme from "../../../../../components/General/Theme";
import MenuOptionCard from "./components/MenuOptionCard";
import SkeletonPlaceholder from "react-native-skeleton-placeholder/lib/SkeletonPlaceholder";

export default class PortalUTFPR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticationVerified: false,
			userImage: '',
			courseData: null,
		}
	}


	async componentDidMount(): void {
		StatusBar.setBackgroundColor('#F6C500');
		StatusBar.setBarStyle('dark-content');
		heimdallr.sendEvent("portal_UTFPR_access");


		if (!heimdallr.UTFPRToken && !heimdallr.UTFPRPortalLogin) {
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
					this.setState({ courseData: resolve, authenticationVerified: true });
				},
				() => {
					if (!heimdallr.UTFPRPortalLogin) {
						this.props.navigation.replace('LoginPortal');
					} else {
						this.setState({ activity: true });
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
			)
		})
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
						this.setState({ activity: true });
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
							<UserInfoCard navigation={this.props.navigation} userImage={ this.state.userImage } courseData={ this.state.courseData } />
						</View>
						<View style={styles.body}>
							<View style={styles.bodyLine}>
								<MenuOptionCard icon={require('../../../../../assets/images/PORTAL-UTFPR/history.png')} title='Histórico Acadêmico' route='StudentHistory' navigation={this.props.navigation} />
								<MenuOptionCard icon={require('../../../../../assets/images/PORTAL-UTFPR/clock.png')} title='Horários Aulas' disabled />
							</View>
							<View style={styles.bodyLine}>
								<MenuOptionCard iconRetrato icon={require('../../../../../assets/images/PORTAL-UTFPR/utensils.png')} title='Cardápio RU' disabled />
								<MenuOptionCard iconPaisagem icon={require('../../../../../assets/images/PORTAL-UTFPR/star.png')} title='Boletim' disabled />
							</View>
							<View style={styles.bodyLine}>
								<MenuOptionCard iconPaisagem icon={require('../../../../../assets/images/PORTAL-UTFPR/newspaper.png')} title='Notícias' disabled />
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
