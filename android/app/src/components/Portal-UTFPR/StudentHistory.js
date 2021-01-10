import React from 'react';

import {
	Text,
	View,
	StyleSheet,
	FlatList,
	Animated,
	TouchableOpacity,
	Image,
	Easing,
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
				console.log("HISTORY",resolve[0].discNomeVc);
			},
			(reject) => {
				console.log('erro get history');
				// this.props.navigation.pop();
				// this.props.navigation.navigate('LoginPortal');
				// console.log("caiu no reject");
			}
		)
	}



	changeText = (text) => {
		let tempItems = this.state.allHistoryData.filter((i) => i.discNomeVc.toLowerCase().includes(text.toLowerCase()));
		this.setState({ historyData: tempItems,  search: text });
	}

	getHeader () {
		return (
			<View style = {{ width: theme.width * 0.85, flexDirection: 'row', marginTop: 15, marginBottom: 10, alignSelf: 'center' }}>
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
					style={{height: 20, width: 20, opacity:0.5, marginLeft:5, marginTop: 10}}
				/>
			</View>
		)
	}



	render() {

		return (
			<View>
				<View style = {{backgroundColor: '#F6C500', paddingTop: 20, paddingBottom: 20}}>
					<Text style = {{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>Histórico Acadêmico</Text>
				</View>
				<FlatList
					ListHeaderComponent = { this.getHeader() }
					showsVerticalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onScrollEndDrag={() => this.setState({ scrolling: false	 })}
					onScrollBeginDrag={() => this.setState({ scrolling: true })}
					keyExtractor={item => item.turmIdVc}
					data={this.state.historyData}
					renderItem={ ({ item }) =>
						<SubjectCard subject = { item }/>
					}
				/>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {

	}
});
