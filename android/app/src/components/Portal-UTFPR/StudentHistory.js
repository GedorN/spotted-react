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

const spinValue = new Animated.Value(0);

export default class StudentHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			historyData: null,
			showHistory: false,
			showItem: null,
			items: [],
			search: null,
			spin: spinValue.interpolate({
				inputRange: [0, 1],
				outputRange: ['0deg', '-180deg']
			})

		}
	}

	componentDidMount = () => {
		console.log("Vou chamar as foto");
		heimdallr.getPortalPhoto().then(
			(resolve) => {
				this.setState({ userImage: `data:image/png;base64,${resolve}` });
			},
			(reject) => {
				console.log("caiu no reject");
				this.props.navigation.replace('LoginPortal');
			}
		);

		heimdallr.getStudentHistory().then(
			(resolve) => {
				this.setState({ historyData: resolve, items: resolve });
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

	showHistory = (item) => {
		this.setState({showHistory: !this.state.showHistory, showItem: item});

		Animated.timing(
			spinValue,
			{
				toValue: this.state.showHistory? 0 : 1,
				duration: 200,
				easing: Easing.linear, // Easing is an additional import from react-native
				useNativeDriver: true  // To make use of native driver for performance
			}
		).start();
	}

	changeText = (text) => {
		console.log('TEXT',text);
/* 
		let tempItems = this.state.historyData.filter((i) => i.discNomeVc.toLowerCase().includes(text.toLowerCase())); */
		let tempItems = this.state.historyData;
		this.setState({ historyData: tempItems,  search: text });
	}

	render() {
		return (
			<View>
				<View style = {{backgroundColor: '#F6C500', paddingTop: 20, paddingBottom: 20}}>
					<Text style = {{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>Histórico Acadêmico</Text>
				</View>
{
				<FlatList
					ListHeaderComponent = {() =>
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
					}
					showsVerticalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onScrollEndDrag={() => this.setState({ scrolling: false	 })}
					onScrollBeginDrag={() => this.setState({ scrolling: true })}
					keyExtractor={item => item.id}
					data={this.state.historyData}
					renderItem={ ({ item }) =>
					<View style = {{ paddingTop: 20, paddingBottom: 20, borderColor: '#DCDCDC', borderWidth: 0.5 }} >
						<TouchableOpacity onPress={this.showHistory.bind(this, this.state.historyData.indexOf(item))} >
							<View style = {{flexDirection: 'row', justifyContent: 'space-around'}}>
								<View style = {{ width: theme.width * 0.8 /* ,borderWidth: 1, borderColor: '#DCDCDC' */ }}>
									<Text style = {{ fontWeight: 'bold', paddingLeft: 20 , marginBottom: 10 }}>{item.discNomeVc}</Text>
									<Text style = {{paddingLeft: 20, fontSize: 12 }}>{item.siHiDescrVc}</Text>
								</View>
								<View style={{width:20 , height: 30, marginTop: -10, alignItems: 'flex-end'/* , borderWidth: 1, borderColor: '#DCDCDC' */  }}>
									<Animated.Image
										style={{ width: 20, height: 30, transform: [{ rotate: this.state.showItem === this.state.historyData.indexOf(item) ?  this.state.spin : '0deg' }] }}
										source={require('../../../../../assets/images/sort-down-solid.png')}
									/>
								</View>
							</View>
							{
								this.state.showHistory && this.state.showItem === this.state.historyData.indexOf(item) &&
								<View style = {{ flexDirection: 'row', alignSelf :'center'}}>
								<View style = {{width: theme.width * 0.05, opacity: 0.5}}>
									<Image 
										style={{ width: 12, height: 11, marginTop: 15}} 
										source={require('../../../../../assets/images/PORTAL-UTFPR/star.png')} />
									<Image 
										style={{ width: 10, height: 10, marginTop: 18}} 
										source={require('../../../../../assets/images/PORTAL-UTFPR/chart.png')} />
									<Image 
										style={{ width: 10, height: 12, marginTop: 17}} 
										source={require('../../../../../assets/images/PORTAL-UTFPR/calendar.png')} />
									<Image 
										style={{ width: 10, height: 10, marginTop: 18}} 
										source={require('../../../../../assets/images/PORTAL-UTFPR/graduation-cap.png')} />
									<Image 
										style={{ width: 13, height: 10, marginTop: 17}} 
										source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fusers-solid.png?alt=media&token=f0a5c738-772f-47e2-9451-cebb3e7184f1'}} />
									
								</View>
								<View style = {{ /* borderColor: '#000000', borderWidth: 1, */ width: theme.width * 0.7, alignSelf: 'center'}}>
									<Text style = {{fontSize: 12, marginTop: 10}}>{'Média final: ' + item.histnotanr}</Text>
									<Text style = {{fontSize: 12,  marginTop: 10}}>{'Frequência: ' + 	item.histfreqnr}</Text>
									<Text style = {{fontSize: 12,  marginTop: 10}}>{'Ano: ' + item.histanonr + ' - ' + item.histperanonr}</Text>
									<Text style = {{fontSize: 12,  marginTop: 10}}>{'Código da disciplina: ' + item.discCodVelhoVc + ' / ' + item.turmCodVc}</Text>
									<Text style = {{fontSize: 12,  marginTop: 10}}>{'Média da turma: ' + item.mediaNotaTurma}</Text>
								</View>
							</View>
							}
							
						</TouchableOpacity>
					</View>
					}
				/> }
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {

	}
});
