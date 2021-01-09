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


export default class PortalUTFPR extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	componentDidMount(): void {
		if (!heimdallr.UTFPRToken) {
			this.props.navigation.navigate('LoginPortal');
		} else {
			StatusBar.setBackgroundColor('#F6C500');
			StatusBar.setBarStyle('dark-content');
		}
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
				<View style={{ marginTop: 25 }}>
					<UserInfoCard navigation={this.props.navigation}/>
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
