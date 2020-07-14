import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity, RefreshControl, FlatList,
} from 'react-native';
import RUMineTextInput from "./Inputs/RUMineTextInput";
import theme from "../../../../components/General/Theme";
import {Button} from 'react-native-paper';
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import PostViewer from "../../../../components/General/PostViewer";
import BoardItemViewer from "./layout/BoardItemViewer";

export default class BoardItems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: null,
			items: [],
		}
	}

	changeText = (text) => {
		this.setState({ search: text });
	}

	componentWillMount(): void {
		console.warn('e aqui?', this.props.id);
		console.warn(this.props.navigation.getParam('id'));
	}

	componentDidMount(): void {
		heimdallr.getBoard(this.props.navigation.getParam('id')).then(
			(resolve) => {
				this.setState({ items: resolve });
				console.warn('ih', JSON.stringify(resolve));
			}
		)
	}


	render() {
		return (
			<View>
				<TouchableOpacity style={{ alignSelf: 'flex-start'}} onPress={() => this.props.navigation.goBack()}>
					<View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5,  paddingLeft: 12, alignSelf: 'flex-start'}}>
						<Image
							style={{width: 12, height: 12, marginTop:4}}
							source={require('../../../../assets/images/arrow-left.png')}
						/>
						<Text style={{marginLeft: 5}}>
							voltar
						</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.headerSearch}>
					<Image
						source={require('../../../../assets/images/search-solid.png')}
						style={{height: 30, width: 30, opacity:0.5, marginLeft:20}}
					/>
					<View style={styles.search}>
						<RUMineTextInput
							onChangeText={ text => this.changeText(text) }
							placeholder='Pesquisar'
							textContentType='name'
							flex={1}
						/>
					</View>
					<Button color="green" mode="contained" icon={require('../../../../assets/images/plus-solid.png')} onPress={() => console.warn('uepa')} >
						Post
					</Button>
				</View>
				<FlatList
					data = {this.state.items}
					ref={flatList => {this.flatList = flatList}}
					renderItem={ ({item}) =>
						<BoardItemViewer title={item.title} id={item.id}/>
					}
					keyExtractor={item => item.id}
					onEndReachedThreshold={0.3}
				/>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	search: {
		flexDirection: 'row',
		width: theme.width*0.50,
		marginLeft: 17,
		marginTop:20,

	},
	headerSearch: {
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
