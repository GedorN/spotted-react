import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	FlatList,
} from 'react-native';
import RUMineTextInput from "./Inputs/RUMineTextInput";
import heimdallr from "../components/Heimdallr/Heimdallr";
import {Text} from "react-native-paper";
import UserBannerView from "../components/General/UserBannerView";
import theme from '../components/General/Theme';

export default class UsersSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: null,
			users: [],
			allUsers: [],
			unicSearch: true,
			show: true,
		};
	}

	changeText = (text) => {
		if (!text || text === '') {
			heimdallr.sendEvent('searching_user');
		}
		if(this.state.unicSearch){
			heimdallr.getCollection('user').then(
				(resolve) => {
					this.setState({ users: resolve.slice(0, 9), allUsers: resolve, unicSearch: false, show: false });
				}
			)

		}

		let tempUser = this.state.allUsers.filter((i) => i._data.name.toLowerCase().includes(text.toLowerCase()));
		this.setState({ users: tempUser.slice(0, 9), search: text });

	}

	render() {
		return (
			<View style={ styles.container }>
				<View style={ styles.headerSearch }>
					<Image
						source={ require('../../assets/images/search-solid.png') }
						style={{ height: 30, width: 30, opacity: 0.5, marginLeft: 20 }}
					/>
					<View style={styles.search}>
						<RUMineTextInput
							onChangeText={ text => this.changeText(text) }
							placeholder='Usuario'
							textContentType='name'
							flex={1}
						/>
					</View>
				</View>
				{this.state.show?(
					<View style = {{width: theme.width, borderColor: 'rgba(59, 56, 50, 0.2)',borderTopWidth:0.9,
					padding:theme.width * 0.04}}>
					<Text  style = {{ opacity: 0.5}}>{'Nenhum Resultado'}</Text>
					</View>) : null
				}
				<View style={styles.usersContainer}>
					<FlatList
						data={this.state.users}
						renderItem={ ({item}) =>
							<UserBannerView profileImage={item._data.user_image} userName={item._data.name} userId = {item._data.uid} navigation={this.props.navigation}/>
						}
						keyExtractor={item=> item._ref.id}
					/>
				</View>
			</View>

		)
	}

}

const styles = StyleSheet.create({
	container: {
		padding: 5,
	},
	search: {
		flexDirection: 'row',
		width: theme.width * 0.85,
		marginLeft: 17,
		marginTop:20,

	},
	headerSearch: {
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	usersContainer: {
		marginTop: 2,
		padding: 5,
	},
});
