import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity
} from 'react-native';

import theme from "../components/General/Theme";
import BoardMessage from "./layout/BoardMessage";


export default class Board extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			board: [
				{title: 'Encontros e eventos', icon: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fusers-solid.png?alt=media&token=f0a5c738-772f-47e2-9451-cebb3e7184f1',id: 'meetings' },
				{title: 'Imóveis', icon: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fbuilding-solid.png?alt=media&token=36f930fa-0e26-402e-8613-5648bd6f83a8', id: 'properties' },
				{title: 'Cursos', icon: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fsitemap-solid.png?alt=media&token=739c3714-bdbe-407a-986d-a1e26d8fad04', id:'courses' },
				// {title: 'Avaliação dos professores', icon: 'https://firebasestorage.googleapis.com/v0/b/spotted-2d3e5.appspot.com/o/icons%2Fchalkboard-teacher-solid.png?alt=media&token=1515cb71-7309-4f5e-a456-0f3cc8d42a7a', id: 'teacher_evaluation' }
			],
			scrolling: false,
			isRefreshing: false,
		}

	}

	componentDidMount = () => {
	}


    render() {
        return (
            <View style = {styles.container} >
	            <TouchableOpacity style={{ alignSelf: 'flex-start'}} onPress={() => this.props.navigation.goBack()}>
		            <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5,  paddingLeft: 12, alignSelf: 'flex-start'}}>
			            <Image
				            style={{width: 12, height: 12, marginTop:4}}
				            source={require('../../assets/images/arrow-left.png')}
			            />
			            <Text style={{marginLeft: 5}}>
				            voltar
			            </Text>
		            </View>
	            </TouchableOpacity>
 				<FlatList
					ListHeaderComponent = {() =>
						<View style={styles.header}>
							<Text style={styles.boardTitle} >Mural</Text>
						</View>
					}
					numColumns={2}
					showsVerticalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					onScrollEndDrag={() => this.setState({ scrolling: false })}
					onScrollBeginDrag={() => this.setState({ scrolling: true })}
					keyExtractor={item => item.id}
					data={this.state.board}
					renderItem={ ({ item }) =>
					<View style = {styles.boardView}>
						<BoardMessage title = {item.title} icon = {item.icon} collection = {item.id} navigation={this.props.navigation}/>
					</View>
					}
				/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		paddingTop: theme.height * 0.01,
		alignItems: 'center',
		flexDirection: 'column',
		width: theme.width
	},
	header: {
		width: theme.width * 0.9,
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: theme.height * 0.02,
		marginTop: theme.width * 0.05
	},
	boardTitle: {
		fontSize: 25,
		color: '#8f8f8f',
		marginRight: theme.width * 0.03,
	},
	boardView: {
		width :theme.width * 0.49,
		alignContent: 'center',
		alignItems:'center',
		marginBottom: 10
	}
})
