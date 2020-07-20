import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	RefreshControl,
	FlatList,
	Modal,
} from 'react-native';
import RUMineTextInput from "./Inputs/RUMineTextInput";
import theme from "../../../../components/General/Theme";
import {Button} from 'react-native-paper';
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import PostViewer from "../../../../components/General/PostViewer";
import BoardItemViewer from "./layout/BoardItemViewer";
import BoardItemWriter from "./Inputs/BoardItemWriter";


export default class BoardItems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: null,
			items: [],
			allItems: null,
			isRefreshing: false,
			pullItemsRef: 1,
			showBoardWriterModal: false,
			id: null,
		}
	}

	openBoardWriter = () => {

		this.setState({ showBoardWriterModal: true });
	}

	hideModal = () => {
		this.setState({ showBoardWriterModal: false });

	};

	closeAndRefresh = () => {
		this.onRefresh();
		this.setState({ showBoardWriterModal: false });
	}

	onRefresh = () => {
		this.setState({ isRefreshing: true });
		heimdallr.getBoard(this.state.id).then(
			(resolve) => {
				const  n = this.state.pullItemsRef;
				this.setState({ allItems: resolve, items: resolve.slice(0, (10 * n)), pullItemsRef: n + 1, isRefreshing: false });
			}
		)
	}

	changeText = (text) => {
		if (!text || text === '') {
			heimdallr.sendEvent('searching_board');
		}

		let tempItems = this.state.allItems.filter((i) => i.title.toLowerCase().includes(text.toLowerCase()));
		this.setState({ items: tempItems.slice(0, 10),  search: text });
	}

	componentWillMount(): void {
		console.warn('e aqui?', this.props.id);
		console.warn(this.props.navigation.getParam('id'));
	}

	componentDidMount(): void {
		this.state.id = this.props.navigation.getParam('id');
		this.onRefresh();
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
						style={{height: 30, width: 30, opacity:0.5, marginLeft:5}}
					/>
					<View style={styles.search}>
						<RUMineTextInput
							onChangeText={ text => this.changeText(text) }
							placeholder='Pesquisar'
							textContentType='name'
							flex={1}
						/>
					</View>
					<Button color="green" mode="contained" icon={require('../../../../assets/images/plus-solid.png')}  onPress={this.openBoardWriter.bind(this)} >
						Post
					</Button>
				</View>
				<FlatList
					style={{height: theme.height * 0.80}}
					data = {this.state.items}
					ref={flatList => {this.flatList = flatList}}
					renderItem={ ({item}) =>
						<BoardItemViewer item={item} title={item.title} id={item.id} text={item.text} images={item.images} date={item.date} video={item.video}
										 comments={item.comments} navigation={this.props.navigation} uid={item.uid} userImage={item.user_image}
										 userName={item.user_name} date={item.date} pid={item.pid} docName={this.state.id}/>
					}
					keyExtractor={item => item.id}
					onEndReachedThreshold={0.3}
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this.onRefresh.bind(this)}
						/>
					}
				/>
				<Modal
					statusBarTranslucent={false}
					transparent={true}
					hardwareAccelerated={true}
					animationType='slide'
					visible={this.state.showBoardWriterModal}
					onDismiss={this.hideModal}
					onRequestClose={this.hideModal.bind(this)}
					contentContainerStyle={{ backgroundColor: 'white', width: theme.width + 10, height: theme.height, position: 'absolute' }}
				>
					<BoardItemWriter id={this.state.id}  refresh={this.onRefresh.bind(this)} closeAndRefresh={this.closeAndRefresh.bind(this)} close ={this.hideModal.bind(this)} navigation = {this.props.navigation}/>
				</Modal>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	search: {
		flexDirection: 'row',
		width: theme.width*0.52,
		marginLeft: 17,
		marginTop:20,

	},
	headerSearch: {
		height: theme.height * 0.06,
		padding: 0,
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
})
