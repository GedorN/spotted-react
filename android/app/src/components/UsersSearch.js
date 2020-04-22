import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Image,
	FlatList,
} from 'react-native';
import RUMineTextInput from "./Inputs/RUMineTextInput";
import heimdallr from "../../../../components/Heimdallr/Heimdallr";
import {Text} from "react-native-paper";
import UserBannerView from "../../../../components/General/UserBannerView";
const width = Dimensions.get('screen').width;

export default class UsersSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: null,
			users: [],
			allUsers: [],
		};
	}

	componentDidMount = () => {
		let users = heimdallr.getCollection('user');
		users.then((resolve) => {
			console.log('Resultado de todos os usuários: ', resolve);
			this.setState({ users: resolve.slice(0, 9) });
			this.setState({ allUsers: resolve });
		})
	}

	changeText = (text) => {
		console.log(text);
		this.setState({ search: text });
		console.log('carai: ', this.state.allUsers.filter((i) => i._data.name.includes(text)));
		let tempUser = this.state.allUsers.filter((i) => i._data.name.toLowerCase().includes(text.toLowerCase()));
		this.setState({ users: tempUser.slice(0, 9)});
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerSearch}>
					<Image
						source={require('../../../../assets/images/search-solid.png')}
						style={{height: 25, width: 25}}
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
		width: width - 40,
		marginLeft: 5,
	},
	headerSearch: {
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	usersContainer: {
		marginTop: 10,
		padding: 5,
	},
});