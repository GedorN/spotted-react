import React from 'react';

import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Image,
} from 'react-native';

import theme from "../../../../../components/General/Theme";
import heimdallr from "../../../../../components/Heimdallr/Heimdallr";
import RUMineTextInput from "../Inputs/RUMineTextInput";
import SubjectCard from './components/SubjectCard';

export default class StudentHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allHistoryData: null,
			historyData: [],
			search: null,

		}
	}

	componentDidMount = () => {
		heimdallr.getStudentHistory().then(
			(resolve) => {
				this.setState({ historyData: resolve, allHistoryData: resolve });
			},
			() => {
				console.log('erro get history');
			}
		)
	}



	changeText = (text) => {
		let tempItems = this.state.allHistoryData.filter((i) => i.discNomeVc.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")));
		this.setState({ historyData: tempItems,  search: text });
	}

	getHeader () {
		return (
			<View style = { styles.searchInput }>
				<View style = {{ width: theme.width * 0.8 }} >
					<RUMineTextInput
						onChangeText={ text => this.changeText(text) }
						placeholder='Pesquisar'
						textContentType='name'
						flex={1}
					/>
				</View>
				<Image
					source={require('../../../../../assets/images/search-solid.png')}
					style={ styles.searchImage }
				/>
			</View>
		)
	}



	render() {

		return (
			<View>
				<View style = { styles.header }>
					<TouchableOpacity  onPress={() => {this.props.navigation.goBack()}}>
						<View style={{ flexDirection: 'row', width: theme.width * 0.2, height:theme.height * 0.04 }}>
							<Image
								style={ styles.arrowImage }
								source={require('../../../../../assets/images/chevron-circle-left-solid-white.png')}
							/>
						</View>
					</TouchableOpacity>
					<Text style = { styles.headerText }>Histórico Acadêmico</Text>
				</View>
				<FlatList
					ListHeaderComponent = { this.getHeader() }
					showsVerticalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'always'}
					keyExtractor={ (item, index) => index }
					data={ this.state.historyData }
					renderItem={ ({ item }) =>
						<SubjectCard subject = { item } />
					}
				/>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#F6C500',
		paddingTop: 10,
		paddingBottom: 20
	},
	headerText: {
		fontSize: 20,
		alignSelf: 'center',
		fontWeight: 'bold'
	},
	searchImage: {
		height: 20,
		width: 20,
		opacity:0.5,
		marginLeft:5,
		marginTop: 10
	},
	searchInput: {
		width: theme.width * 0.85,
		flexDirection: 'row',
		marginTop: 15,
		marginBottom: 10,
		alignSelf: 'center'
	},
	arrowImage: {
		width: 30,
		height: 30,
		opacity: 0.6,
		position: 'absolute',
		marginLeft: 8,
		marginTop: 8
	}
});
